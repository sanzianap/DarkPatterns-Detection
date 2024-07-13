// THIS DOESN'T WORK FOR NOW; See .improvements/moduleType
import { WORDS } from './constants.js';
import _ from 'lodash';
//import cors from 'cors';
//import thesaurus from 'powerthesaurus-api';

// const corsOptions = {
//     origin: '*',
//     credentials: true,            //access-control-allow-credentials:true
//     optionSuccessStatus: 200,
// }

// var app = express();
// app.use(cors(corsOptions));

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
const checkIfIdExists = (list, domElement) => {
    return list.some(element => element.id === domElement.id);
}
const checkIfIdExistsInMap = (iterator, domElement) => {
    let res;
    while(true) {
        res = iterator.next();
        if (res.done) {
            return false;
        }
        // console.log("initial");
        // console.log(res);
        var value = res.value.entries().next().value[0];
        // console.log("after trying to take the value");
        // console.log(value);
        if (value.id === domElement.id) {
            return true;
        }
    }
}
const insertDomElementIfSuitable = (list, domElement) => {
    let isPresent = checkIfIdExists(list, domElement);

    if (isPresent || domElement.clientHeight <= 0 || domElement.clientHeight <= 0) {
        return;
    }
    list.push(domElement);
    return true;
    // check if id>class>aria-label mare smechera esti :>
    // 
}
// const getApiSynonyms = () => {
//     app.get('/synonyms/:word', async (req, res) => {
//         const word = req.params.word;
//         try {
//           const synonyms = await powerthesaurus.synonyms(word);
//           res.json(synonyms);
//         } catch (error) {
//           console.error(error);
//           res.status(500).json({ error: 'Failed to fetch data from PowerThesaurus API' });
//         }
//       });
// }
const getBestElement = (map) => {
    var max = -10, position = 0;
    for (var [key, value] of map.entries()) {
        // console.log(value.entries().next().value[1]);
        if (value.entries().next().value[1] > max) {
            max = value.entries().next().value[1];
            position = key;
        }
    }
    // let elements = map.values();
    // let currentElement;
    // while(true) {
    //     currentElement = elements.next();
    //     if (currentElement.done) {
    //         break;
    //     }
    //     var value = currentElement.value.entries().next().value[0];
    //     var currentWeight = currentElement.value.entries().next().value[1];
    //     if (currentWeight > max) {
    //         position = 
    //     }
    // }
    // console.log(position);
    return map.get(position).entries().next().value[0];
}
const getSpecifiedElement = (initialArray) => {
    let allKeywordsArray = [];
    let domElementsFound = new Map();
    initialArray.forEach(keyword => getAllCasesForKeyword(keyword, allKeywordsArray));
    let index = 0;
    allKeywordsArray.forEach(keyword => {
        let maxWeight = WORDS.FALLBACKMECHANISM_ELEMENTS.length * 10;
        for(var position = 0; position < WORDS.FALLBACKMECHANISM_ELEMENTS.length; position++) {
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
    console.log("BEFORE FILTERING");
    console.log(domElementsFound);
    if (domElementsFound.size > 1) {
        identifyBestFittingActionButton(domElementsFound);
    }
    return getBestElement(domElementsFound);
}
const calculateWeight = (domElement, weight) => {
    //console.log(domElement + ' ' + weight);
    var minWeight = weight;
    // "id: " + div.id + " class: " + div.className + " element type: " + div.tagName + " ariaLabel:" + div.ariaLabel
    if (domElement.tagName === WORDS.BUTTON_TAG) {
        minWeight += 20;
    } else {
        minWeight += 10;
    }
    for (var idx = 0; idx < ALL_KEYWORDS.length; idx++) {
        if (domElement.id.includes(ALL_KEYWORDS[idx])) {
            minWeight++;
            break;
        }
    }
    let listfWordsForAll = constructAllKeywords(WORDS.ALL);
    for (var idx = 0; idx < listfWordsForAll.length; idx++) {
        if (domElement.id.includes(listfWordsForAll[idx])) {
            minWeight++;
            break;
        }
    }
    let listfWordsForWrap = constructAllKeywords(WORDS.WRAP_KEYWORD);
    for (var idx = 0; idx < listfWordsForWrap.length; idx++) {
        if (domElement.id.includes(listfWordsForWrap[idx])) {
            minWeight -= 5;
            break;
        }
    }
    return minWeight;
}
const identifyBestFittingActionButton = (possibleOptionsMap) => {
    // for(var position = 0; position < possibleOptionsArray.length; position++) {
    //     var weight = calculateWeight(possibleOptionsArray[position]);
    //     weightMap.set(position, weight);
    // }
    var elements = possibleOptionsMap.values();
    let currentElement;
    while(true) {
        currentElement = elements.next();
        if (currentElement.done) {
            break;
        }
        var value = currentElement.value.entries().next().value[0];
        var currentWeight = currentElement.value.entries().next().value[1];
        var weight = calculateWeight(value, currentWeight);
        //currentWeight = weight;
        //console.log("AFTER2 "+currentWeight);
        currentElement.value.set(value, weight);
    }
} 

// --------------------------------- Functions section end ------------------------------

let  divsRetreived = [];

// XPath expression to select divs with 'cookie' in their id
let blackList = computeBlackList(ALL_KEYWORDS, WORDS.FALLBACKMECHANISM_ELEMENTS);
WORDS.FALLBACKMECHANISM_ELEMENTS.forEach(domElement => {
    ALL_KEYWORDS.forEach(keyword => {
        var xpath = "//div[contains(@" + domElement + ", '" + keyword + "')" + blackList;
        let result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < result.snapshotLength; i++) {
            var div = result.snapshotItem(i);
            insertDomElementIfSuitable(divsRetreived, div);
        }
    });
});

divsRetreived.forEach(div => {
    console.log("width: " + div.clientWidth + " height: " + div.clientHeight);
    div.style.border = "2px solid red";
});

let rejectButtonsMap = getSpecifiedElement(WORDS.REJECT_BUTTON_KEYWORDS);
console.log("rejectButtonsMap");
console.log(rejectButtonsMap);

let closebuttons = getSpecifiedElement(WORDS.CLOSE_BUTTON);
console.log("closebuttons");
console.log(closebuttons);

let preferencebuttons = getSpecifiedElement(WORDS.CUSTOMISE_COOKIE_BUTTON);
console.log("preferencebuttons");
console.log(preferencebuttons);