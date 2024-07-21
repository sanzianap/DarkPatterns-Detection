document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const currentWindowId = tabs[0].windowId;
            console.log(`Current window in resume.html ${currentWindowId}`);
            chrome.storage.local.get([currentWindowId.toString()], (result) => {
                if (result) {
                    let tabId = result[currentWindowId].tabIdToAction.toString();
                    console.log(`Tab to execute action on ${tabId}`);
                    chrome.storage.local.get([tabId], (result) => {
                        console.log(`Am gasit divurile ${result}`);
                        console.log(result);
                        if (result) {
                            let divs = result[tabId];
                            let dataElement = document.getElementById("cookie_stats");
                            if (divs.cookieDiv.id || divs.cookieDiv.class) {
                                dataElement.textContent = "We've found the cookie div!";
                            } else {
                                dataElement.textContent = "Cookie div can't be located";
                            }
                            dataElement = document.getElementById("rejectButton_stats");
                            if (divs.rejectButton.id || divs.rejectButton.class) {
                                dataElement.textContent = "We've found the reject button!";
                            } else {
                                dataElement.textContent = "Reject button can't be located";
                            }
                            dataElement = document.getElementById("closeButton_stats");
                            if (divs.closeButton.id || divs.closeButton.class) {
                                dataElement.textContent = "We've found the close button!";
                            } else {
                                dataElement.textContent = "Close button can't be located";
                            }
                            dataElement = document.getElementById("buttonsToDisplay");
                            if (!divs.preferenceButton.id && !divs.preferenceButton.class) {
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