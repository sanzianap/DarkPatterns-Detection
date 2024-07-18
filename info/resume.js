document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(['oldStyles'], (result) => {
        const dataElement = document.getElementById("cookie_stats");
        if (result.oldStyles.cookieDiv.id) {
            dataElement.textContent = "We've found the cookie div!";
        } else {
            dataElement.textContent = "Cookie div can't be located";
        }
    });
});

chrome.runtime.sendMessage({ action: 'hello' }, (response) => {
    console.log("Response from content script:", response);
});