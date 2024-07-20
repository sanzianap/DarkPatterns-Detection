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
        }
    });
});

function clickPreferencesButton() {
    chrome.runtime.sendMessage({ action: 'clickPreferences' }, (response) => {
        console.log("Response from content script:", response);
    });
}