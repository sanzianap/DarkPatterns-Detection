document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(['oldStyles'], (result) => {
        let dataElement = document.getElementById("cookie_stats");
        if (result.oldStyles.cookieDiv.id) {
            dataElement.textContent = "We've found the cookie div!";
        } else {
            dataElement.textContent = "Cookie div can't be located";
        }
        dataElement = document.getElementById("rejectButton_stats");
        if (result.oldStyles.rejectButton.id) {
            dataElement.textContent = "We've found the reject button!";
        } else {
            dataElement.textContent = "Reject button can't be located";
        }
        dataElement = document.getElementById("closeButton_stats");
        if (result.oldStyles.closeButton.id) {
            dataElement.textContent = "We've found the close button!";
        } else {
            dataElement.textContent = "Close button can't be located";
        }
        dataElement = document.getElementById("buttonsToDisplay");
        if (!result.oldStyles.preferenceButton.id) {
            dataElement.style.visibility = "hidden";
        } else {
            dataElement.addEventListener("click", clickPreferencesButton);
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
                }
            });
        }
    });
}