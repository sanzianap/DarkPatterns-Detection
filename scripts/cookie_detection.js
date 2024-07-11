// THIS DOESN'T WORK FOR NOW; See .improvements/moduleType
import { COOKIE_DIV_KEYWORDS, FALLBACKMECHANISM_ELEMENTS } from './constants.js';
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
let x = "//div[contains(@id, 'cookie')]";
let result = document.evaluate(x, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
console.log(result.snapshotLength);

COOKIE_DIV_KEYWORDS.forEach(keyword => getAllCasesForKeyword(keyword, allKeywords));
// XPath expression to select divs with 'cookie' in their id
let blackList = computeBlackList(allKeywords, FALLBACKMECHANISM_ELEMENTS);
FALLBACKMECHANISM_ELEMENTS.forEach(domElement => {
    allKeywords.forEach(keyword => {
        const xpath = "//div[contains(@" + domElement + ", '" + keyword + "')" + blackList;
        const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < result.snapshotLength; i++) {
            console.log("cvea");
            let div = result.snapshotItem(i);
            insertDomElementIfSuitable(divsRetreived, div);
        }
    });
});

console.log(divsRetreived);
divsRetreived.forEach(div => console.log("width: " + div.clientWidth + " height: " + div.clientHeight));
//divsRetreived[0].style.border = "2px solid red";

//getApiSynonyms();


//console.log(_.isString(":Sanziana:"));
//console.log(COOKIE_DIV_KEYWORDS[0]);
//getApiSynonyms();