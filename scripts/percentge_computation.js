chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('I found the message ');
    console.log(message);
    if (message.action === "computeNewPercentage") {
        const cookieDiv = document.querySelector("#" + message.divs.cookieDiv.id);
        sendResponse({ newHeight: cookieDiv.clientHeight, newWidth: cookieDiv.clientWidth });
    } else if (message.action === 'colorDivs') {
        const cookieDiv = document.querySelector("#" + message.divs.cookieDiv.id);
        console.log(cookieDiv.style);
        if (cookieDiv) {
            if (message.per <= 25) {
                cookieDiv.style.border = "2px solid green";
            } else if (message.per <= 50) {
                cookieDiv.style.border = "2px solid yellow";
            } else if (message.per <= 75) {
                cookieDiv.style.border = "2px solid orange";
            } else {
                cookieDiv.style.border = "2px solid red";
            }
        }

        const rejectButton = document.querySelector('#' + message.divs.rejectButton.id);
        if (rejectButton) {
            rejectButton.style.border = "2px solid green";
        }
        
        const closeButton = document.querySelector('#' + message.divs.closeButton.id);
        if (closeButton) {
            closeButton.style.border = "2px solid red";
        }
        sendResponse({ ok: true });
    } else if (message.action === 'undoStyles') {
        var localStorageValue = message.divs;
        const cookieDiv = document.querySelector("#" + localStorageValue.cookieDiv.id);
        console.log(cookieDiv.style);
        if (cookieDiv) {
            cookieDiv.style.border = localStorageValue.cookieDiv.borderStyle;
        }

        const rejectButton = document.querySelector('#' + localStorageValue.rejectButton.id);
        if (rejectButton) {
            rejectButton.style.border = localStorageValue.rejectButton.borderStyle;
        }

        const closeButton = document.querySelector('#' + localStorageValue.closeButton.id);
        if (closeButton) {
            closeButton.style.border = localStorageValue.closeButton.borderStyle;
        }

        sendResponse({ ok: true });
    }
});