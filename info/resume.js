// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log('Am ajuns sa pn datele');
//     console.log(message);
//     if (message.action === 'refreshData') {
//         chrome.storage.local.get([message.tabId.toString()], (result) => {
//             var data = result[message.tabId];
//             let dataElement = document.getElementById("cookie_stats");
//             if (data.cookieDiv.id) {
//                 dataElement.textContent = "We've found the cookie div!";
//             } else {
//                 dataElement.textContent = "Cookie div can't be located";
//             }
//             dataElement = document.getElementById("rejectButton_stats");
//             if (data.rejectButton.id) {
//                 dataElement.textContent = "We've found the reject button!";
//             } else {
//                 dataElement.textContent = "Reject button can't be located";
//             }
//             dataElement = document.getElementById("closeButton_stats");
//             if (data.closeButton.id) {
//                 dataElement.textContent = "We've found the close button!";
//             } else {
//                 dataElement.textContent = "Close button can't be located";
//             }
//             dataElement = document.getElementById("buttonsToDisplay");
//             if (!data.preferenceButton.id) {
//                 dataElement.style.visibility = "hidden";
//             } else {
//                 dataElement.addEventListener("click", clickPreferencesButton);
//             }
//         });
//     }
// });

document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const currentWindowId = tabs[0].windowId;
            chrome.storage.local.get([currentWindowId.toString()], (result) => {
                if (result) {
                    var tabId = result[currentWindowId].tabIdToAction.toString();
                    chrome.storage.local.get([tabId], (result) => {
                        if (result) {
                            let divs = result[tabId];
                            let dataElement = document.getElementById("cookie_stats");
                            if (divs.cookieDiv.id) {
                                dataElement.textContent = "We've found the cookie div!";
                            } else {
                                dataElement.textContent = "Cookie div can't be located";
                            }
                            dataElement = document.getElementById("rejectButton_stats");
                            if (divs.rejectButton.id) {
                                dataElement.textContent = "We've found the reject button!";
                            } else {
                                dataElement.textContent = "Reject button can't be located";
                            }
                            dataElement = document.getElementById("closeButton_stats");
                            if (divs.closeButton.id) {
                                dataElement.textContent = "We've found the close button!";
                            } else {
                                dataElement.textContent = "Close button can't be located";
                            }
                            dataElement = document.getElementById("buttonsToDisplay");
                            if (!divs.preferenceButton.id) {
                                dataElement.style.visibility = "hidden";
                            } else {
                                dataElement.addEventListener("click", clickPreferencesButton);
                            }
                        }
                    });
                }
            });
        }
    });
});

function clickPreferencesButton() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const currentWindowId = tabs[0].windowId;
            //console.log(currentTabId);
            chrome.storage.local.get([currentWindowId.toString()], (response) => {
                if (response) {
                    var localStorageValue = response[currentWindowId];
                    chrome.runtime.sendMessage({ action: 'clickPreferencesFromP', tabIdToAction: localStorageValue.tabIdToAction });
                    // chrome.runtime.sendMessage({ action: 'refreshData' });
                }
            });
        }
    });
}