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

const getAllCasesForKeyword = (element, arrayCopy) => {
    arrayCopy.push(element);
    arrayCopy.push(element.toUpperCase());
    arrayCopy.push(_.startCase(element));
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
    let isPresent = list.some(element => element.id === domElement.id);

    if (isPresent || domElement.clientHeight <= 0 || domElement.clientHeight <= 0) {
        return;
    }
    list.push(domElement);
    return true;
    // check if id>class>aria-label
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
// --------------------------------- Functions section end ------------------------------

let allKeywords = [], divsRetreived = [];

WORDS.COOKIE_DIV_KEYWORDS.forEach(keyword => getAllCasesForKeyword(keyword, allKeywords));
// XPath expression to select divs with 'cookie' in their id
let blackList = computeBlackList(allKeywords, WORDS.FALLBACKMECHANISM_ELEMENTS);
WORDS.FALLBACKMECHANISM_ELEMENTS.forEach(domElement => {
    allKeywords.forEach(keyword => {
        var xpath = "//div[contains(@" + domElement + ", '" + keyword + "')" + blackList;
        let result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < result.snapshotLength; i++) {
            var div = result.snapshotItem(i);
            insertDomElementIfSuitable(divsRetreived, div);
        }
    });
});

divsRetreived.forEach(div => {
    console.log("width: " + div.clientWidth + " height: " + div.clientHeight); div.style.border = "2px solid red";
});

let rejectbuttons = [];
WORDS.REJECT_BUTTON_KEYWORDS.forEach(reject_button => {
    WORDS.FALLBACKMECHANISM_ELEMENTS.forEach(domElement => {
        var xpath = "//button[contains(@" + domElement + ", '" + reject_button + "')]";
        let result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < result.snapshotLength; i++) {
            var div = result.snapshotItem(i);
            rejectbuttons.push(div);
        }
        console.log(xpath);
        xpath = "//div[contains(@" + domElement + ", '" + reject_button + "')]";
        result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < result.snapshotLength; i++) {
            var div = result.snapshotItem(i);
            rejectbuttons.push(div);
        }
        console.log(xpath);
    });
});

// iterate thru all rejctbuttons and chose the right one
console.log(rejectbuttons)

let closebuttons = [];
WORDS.FALLBACKMECHANISM_ELEMENTS.forEach(domElement => {
    var xpath = "//button[contains(@" + domElement + ", '" + WORDS.CLOSE_BUTTON + "')]";
    let result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < result.snapshotLength; i++) {
        var div = result.snapshotItem(i);
        closebuttons.push(div);
    }
    console.log(xpath);
    xpath = "//div[contains(@" + domElement + ", '" + WORDS.CLOSE_BUTTON + "')]";
    result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < result.snapshotLength; i++) {
        var div = result.snapshotItem(i);
        closebuttons.push(div);
    }
    console.log(xpath);
});

console.log(closebuttons);

let preferencebuttons = [];
WORDS.CUSTOMISE_COOKIE_BUTTON.forEach(customise_button => {
    WORDS.FALLBACKMECHANISM_ELEMENTS.forEach(domElement => {
        var xpath = "//button[contains(@" + domElement + ", '" + customise_button + "')]";
        let result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < result.snapshotLength; i++) {
            var div = result.snapshotItem(i);
            preferencebuttons.push(div);
        }
        console.log(xpath);
        xpath = "//div[contains(@" + domElement + ", '" + customise_button + "')]";
        result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < result.snapshotLength; i++) {
            var div = result.snapshotItem(i);
            preferencebuttons.push(div);
        }
        console.log(xpath);
    });
});

console.log(preferencebuttons);