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

const computeBlackList = (keywordsArray) => {
    let blackListXpath = " and not(ancestor::div[";
    keywordsArray.forEach(keyword => {
        blackListXpath = blackListXpath.concat("contains(@id, '", keyword, "') or ");
    });

    blackListXpath = blackListXpath.slice(0, -4) + "])]";
    return blackListXpath;
}
// --------------------------------- Functions section end ------------------------------

let allKeywords = [], divsRetreived = [];
const cookieDivKeywords = ['cookie', 'gdpr'];

cookieDivKeywords.forEach(keyword => getAllCasesForKeyword(keyword, allKeywords));
// console.log(allKeywords);
// XPath expression to select divs with 'cookie' in their id
allKeywords.forEach(keyword => {
    const xpath = "//div[contains(@id, '" + keyword + "')" + computeBlackList(allKeywords);
    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < result.snapshotLength; i++) {
        let div = result.snapshotItem(i);
        divsRetreived.push(div);
    }
    //console.log(result.snapshotItem);
    //divsRetreived.push.apply(divsRetreived, result.snapshotItem);
});

console.log(divsRetreived);
divsRetreived.forEach(div => console.log("width: " + div.clientWidth + " height: " + div.clientHeight));

//const xpath = "//div[contains(@id,'cookie') and not(ancestor::div[contains(@id, 'cookie') or contains(@id, 'Cookie') or contains(@id, 'COOKIE') or contains(@id, 'gdpr') or contains(@id, 'Gdpr') or contains(@id, 'GDPR')])]";
//const xpath = "//div[contains(@id,'cookie') and not(ancestor::div[contains(@id, 'cookie') or contains(@id, 'Cookie') or contains(@id, 'COOKIE') or contains(@id, 'gdpr') or contains(@id, 'Gdpr') or contains(@id, 'GDPR')])]";
//const xpath = "//div[contains(@id,'cookie') and not(ancestor::div[contains(@id, 'cookie') or contains(@id, 'Cookie') or contains(@id, 'COOKIE') or contains(@id, 'gdpr') or contains(@id, 'Gdpr') or contains(@id, 'GDPR')])]";
//const xpath = "//div[contains(@id,'cookie') and not(ancestor::div[contains(@id, 'cookie') or contains(@id, 'Cookie') or contains(@id, 'COOKIE') or contains(@id, 'gdpr') or contains(@id, 'Gdpr') or contains(@id, 'GDPR')])]";

// Evaluate the XPath expression
//const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

// for (let i = 0; i < result.snapshotLength; i++) {
//     let div = result.snapshotItem(i);
//     console.log(div);
// }

// function getAllCasesForKeyword(keyword) {
//
// }