// THIS DOESN'T WORK FOR NOW; See .improvements/moduleType
//import { COOKIE_DIV_KEYWORDS } from './constants.js';

// --------------------------------- Functions section ------------------------------
const sentenceCase = (word) => {
    return word.charAt(0).toUpperCase() + word.substring(1);
}

const getAllCasesForKeyword = (element, arrayCopy) => {
    arrayCopy.push(element);
    arrayCopy.push(element.toUpperCase());
    arrayCopy.push(sentenceCase(element));
}

const appendToString = (word, stringToAppend) => {
    word = word.concat(stringToAppend); s
}

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

const insertDomElementIfSuitable = (list, domElement) => {
    let isPresent = list.some(element => {element.id === domElement.id});

    if(isPresent || domElement.clientHeight <= 0 || domElement.clientHeight <= 0) {
        return;
    }
    list.push(domElement);
    // check if id>class>aria-label
};
// --------------------------------- Functions section end ------------------------------

let allKeywords = [], divsRetreived = [];
const cookieDivKeywords = ['cookie', 'gdpr'];
const fallbackMechanisElements = ['id', 'class', 'aria-label'];

cookieDivKeywords.forEach(keyword => getAllCasesForKeyword(keyword, allKeywords));
// console.log(allKeywords);
// XPath expression to select divs with 'cookie' in their id
let blackList = computeBlackList(allKeywords, fallbackMechanisElements);
fallbackMechanisElements.forEach(domElement => {
    allKeywords.forEach(keyword => {
        const xpath = "//div[contains(@" + domElement + ", '" + keyword + "')" + blackList;
        const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < result.snapshotLength; i++) {
            let div = result.snapshotItem(i);
            insertDomElementIfSuitable(divsRetreived, div);
        }
    });
});

console.log(divsRetreived);
divsRetreived.forEach(div => console.log("width: " + div.clientWidth + " height: " + div.clientHeight));