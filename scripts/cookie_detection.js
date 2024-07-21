import { WORDS } from './constants.js';
import _ from 'lodash';

// --------------------------------- Functions section ------------------------------
const constructAllKeywords = (listOfInitialKeywords) => {
    let finalList = [];
    listOfInitialKeywords.forEach(keyword => getAllCasesForKeyword(keyword, finalList));
    return finalList;
}
const getAllCasesForKeyword = (element, arrayCopy) => {
    arrayCopy.push(element);
    arrayCopy.push(element.toUpperCase());
    arrayCopy.push(_.startCase(element));
}
// ****************
const ALL_KEYWORDS = constructAllKeywords(WORDS.COOKIE_DIV_KEYWORDS);
// ****************
const computeBlackList = (keywordsArray, domElementsToBeChecked) => {
    let blackListXpath = " and not(ancestor::div[";
    domElementsToBeChecked.forEach(domElement => {
        keywordsArray.forEach(keyword => {
            blackListXpath = blackListXpath.concat("contains(@", domElement, ", '", keyword, "') or ");
        });
    });

    blackListXpath = blackListXpath.slice(0, -4) + "])]";
    return blackListXpath;
}
const checkIfIdExistsInMap = (iterator, domElement) => {
    let res;
    while (true) {
        res = iterator.next();
        if (res.done) {
            return false;
        }
        var value = res.value.entries().next().value[0];
        if (value.id === domElement.id) {
            return true;
        }
    }
}
const insertDomElementIfSuitable = (list, domElement) => {
    let isPresent = checkIfIdExistsInMap(list, domElement);

    if (isPresent || domElement.clientHeight <= 0 || domElement.clientHeight <= 0) {
        return;
    }
    return true;
}
const getBestElement = (map) => {
    var max = -10, position = -1;
    for (var [key, value] of map.entries()) {
        if (value.entries().next().value[1] > max) {
            max = value.entries().next().value[1];
            position = key;
        }
    }
    if (position > -1) {
        return map.get(position).entries().next().value[0];
    }
    return undefined;
}
const getSpecifiedElement = (initialArray) => {
    let allKeywordsArray = [];
    let domElementsFound = new Map();
    initialArray.forEach(keyword => getAllCasesForKeyword(keyword, allKeywordsArray));
    let index = 0;
    allKeywordsArray.forEach(keyword => {
        let maxWeight = WORDS.FALLBACKMECHANISM_ELEMENTS.length * 10;
        for (var position = 0; position < WORDS.FALLBACKMECHANISM_ELEMENTS.length; position++) {
            var currentElement = WORDS.FALLBACKMECHANISM_ELEMENTS[position];
            var currentWeight = maxWeight - position * 10;
            var xpath = "//*[self::div or self::button][contains(@" + currentElement + ", '" + keyword + "')]";
            let result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < result.snapshotLength; i++) {
                var div = result.snapshotItem(i);
                if (!checkIfIdExistsInMap(domElementsFound.values(), div)) {
                    var value = new Map();
                    value.set(div, currentWeight);
                    domElementsFound.set(index++, value);
                }
            }
        }
    });
    if (domElementsFound.size > 1) {
        identifyBestFittingActionButton(domElementsFound, true);
    }
    return getBestElement(domElementsFound);
}
const checkIfKeywordPresent = (listOfKeywords, domElement) => {
    let listfWordsForWrap = constructAllKeywords(listOfKeywords);
    for (var idx = 0; idx < listfWordsForWrap.length; idx++) {
        if (domElement.id.includes(listfWordsForWrap[idx]) || domElement.className.includes(listfWordsForWrap[idx])) {
            return true;
        }
    }
    return false;
}
const calculateWeight = (domElement, weight, checkForButton) => {
    var minWeight = weight;
    if (checkForButton) {
        if (domElement.tagName === WORDS.BUTTON_TAG) {
            minWeight += 25;
        } else {
            minWeight += 15;
        }
        if (checkIfKeywordPresent(WORDS.COOKIE_DIV_KEYWORDS, domElement)) {
            minWeight += 2;
        }
        if (checkIfKeywordPresent(WORDS.ALL, domElement)) {
            minWeight++;
        }
    }
    if (checkIfKeywordPresent(WORDS.WRAP_KEYWORD, domElement)) {
        minWeight -= 10;
    }
    return minWeight;
}
const verifyIfWrapDiv = (div) => {
    if (checkIfKeywordPresent(WORDS.WRAP_KEYWORD, div)) {
        if (div.children.length === 1 && div.id.includes(div.children[0].id)) {
            return true;
        }
    }
    return false;
}
const identifyBestFittingActionButton = (possibleOptionsMap, checkForButton) => {
    var elements = possibleOptionsMap.values();
    console.log(possibleOptionsMap);
    let currentElement;
    while (true) {
        currentElement = elements.next();
        if (currentElement.done) {
            break;
        }
        var value = currentElement.value.entries().next().value[0];
        var currentWeight = currentElement.value.entries().next().value[1];
        var weight = calculateWeight(value, currentWeight, checkForButton);
        currentElement.value.set(value, weight);
    }
}

const detectCookieMainDiv = () => {
    let divsMap = new Map();

    // XPath expression to select divs with 'cookie' in their id
    let blackList = computeBlackList(ALL_KEYWORDS, WORDS.FALLBACKMECHANISM_ELEMENTS);
    let index = 0;
    for (var position = 0; position < WORDS.FALLBACKMECHANISM_ELEMENTS.length; position++) {
        var domElement = WORDS.FALLBACKMECHANISM_ELEMENTS[position];
        let maxWeight = WORDS.FALLBACKMECHANISM_ELEMENTS.length * 10;
        var currentWeight = maxWeight - position * 10;
        ALL_KEYWORDS.forEach(keyword => {
            var xpath = "//div[contains(@" + domElement + ", '" + keyword + "')" + blackList;
            let result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < result.snapshotLength; i++) {
                var div = result.snapshotItem(i);
                if (verifyIfWrapDiv(div)) {
                    div = div.children[0];
                }
                if (insertDomElementIfSuitable(divsMap.values(), div)) {
                    var value = new Map();
                    value.set(div, currentWeight);
                    divsMap.set(index, value);
                }
            }
        });
    }
    if (divsMap.size > 1) {
        identifyBestFittingActionButton(divsMap);
    }
    return getBestElement(divsMap);
}

const checkIfCloseButtonHidden = (element) => {
    while (element) {
        console.log(element);
        // Get computed style of the current element
        let style = window.getComputedStyle(element);
        console.log(style.visibility);
        
        // Check if the visibility property is hidden
        if (style.visibility === 'hidden' || style.display === 'none') {
          return true;
        }
        
        // Move to the parent element
        element = element.parentElement;
      }
}

// --------------------------------- Functions section end ------------------------------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'getInitialDivs':
            let cookiesDiv = detectCookieMainDiv();
            let rejectButton = getSpecifiedElement(WORDS.REJECT_BUTTON_KEYWORDS);
            let closeButton = getSpecifiedElement(WORDS.CLOSE_BUTTON);
            //console.log(checkIfCloseButtonHidden(closeButton));
            let preferenceButton = getSpecifiedElement(WORDS.CUSTOMISE_COOKIE_BUTTON);
            if (cookiesDiv) {
                if (rejectButton && !cookiesDiv.contains(rejectButton)) {
                    rejectButton = undefined;
                }
                if (closeButton && !cookiesDiv.contains(closeButton) || checkIfCloseButtonHidden(closeButton)) {
                    closeButton = undefined;
                }
                if (preferenceButton && !cookiesDiv.contains(preferenceButton)) {
                    preferenceButton = undefined;
                }
            }
            var oldStyle = {
                cookieDiv: {
                    id: cookiesDiv ? cookiesDiv.id : undefined,
                    class: cookiesDiv ? cookiesDiv.className : undefined,
                    divHeight: cookiesDiv ? cookiesDiv.clientHeight : undefined,
                    divWidth: cookiesDiv ? cookiesDiv.clientWidth : undefined,
                    borderStyle: cookiesDiv ? cookiesDiv.style.border : undefined
                },
                rejectButton: {
                    id: rejectButton ? rejectButton.id : undefined,
                    class: rejectButton ? rejectButton.className : undefined,
                    borderStyle: rejectButton ? rejectButton.style.border : undefined
                },
                closeButton: {
                    id: closeButton ? closeButton.id : undefined,
                    class: closeButton ? closeButton.className : undefined,
                    borderStyle: closeButton ? closeButton.style.border : undefined
                },
                preferenceButton: {
                    id: preferenceButton ? preferenceButton.id : undefined,
                    class: preferenceButton ? preferenceButton.className : undefined
                }
            }
            // clear any values may be previously set
            chrome.storage.local.remove([message.tabId.toString()]);
            // should include tabId
            var oldStyleById = {};
            oldStyleById[message.tabId] = oldStyle;
            chrome.storage.local.set(oldStyleById);
            sendResponse(oldStyle);
            break;
        case 'clickPreferences':
            if (_.isString(message.divs.preferenceButton.id) && _.isString(message.divs.preferenceButton.class)) {
                let prefBut = document.getElementById(message.divs.preferenceButton.id);
                let rejectButton = getSpecifiedElement(WORDS.REJECT_BUTTON_KEYWORDS);
                let closeButton = getSpecifiedElement(WORDS.CLOSE_BUTTON);
                prefBut.click();
                sendResponse({
                    divs: {
                        rejectButton: {
                            id: rejectButton ? rejectButton.id : undefined,
                            class: rejectButton ? rejectButton.className : undefined
                        },
                        closeButton: {
                            id: closeButton ? closeButton.id : undefined,
                            class: closeButton ? closeButton.className : undefined
                        }
                    },
                    tabId: message.tabId
                });
            }
            break;
    }
});