//console.log("Content script has been injected.");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('I found the message ');
    console.log(message);
    if (message.action === "computeNewPercentage") {
        const cookieDiv = document.querySelector("#" + message.divs.cookieDiv.id);
        //console.log(`newHeight ${cookieDiv.clientHeight} newWidth ${cookieDiv.clientWidth}`);
        sendResponse({ newHeight: cookieDiv.clientHeight, newWidth: cookieDiv.clientWidth });
    } else if (message.action === 'colorDivs') {
        const cookieDiv = document.querySelector("#" + message.divs.cookieDiv.id);
        console.log(cookieDiv.style);
        if (!cookieDiv) {
            sendResponse({ notFound: true });
        }
        if (message.per <= 25) {
            cookieDiv.style.border = "2px solid green";
        } else if (message.per <= 50) {
            cookieDiv.style.border = "2px solid yellow";
        } else if (message.per <= 75) {
            cookieDiv.style.border = "2px solid orange";
        } else {
            cookieDiv.style.border = "2px solid red";
        }

        const rejectButton = document.querySelector('#' + message.divs.rejectButton.id);
        if (!rejectButton) {
            sendResponse({ notFound: true });
        }
        rejectButton.style.border = "2px solid green";

        const closeButton = document.querySelector('#' + message.divs.closeButton.id);
        if (!closeButton) {
            sendResponse({ notFound: true });
        }
        closeButton.style.border = "2px solid red";
        sendResponse({ ok: true });
    } else if (message.action === 'undoStyles') {
        chrome.storage.local.get(['oldStyles'], (result) => {
            const cookieDiv = document.querySelector("#" + result.oldStyles.cookieDiv.id);
            console.log(cookieDiv.style);
            if (cookieDiv) {
                cookieDiv.style.border = result.oldStyles.cookieDiv.borderStyle;
            }

            const rejectButton = document.querySelector('#' + result.oldStyles.rejectButton.id);
            if (rejectButton) {
                rejectButton.style.border = result.oldStyles.rejectButton.borderStyle;
            }

            const closeButton = document.querySelector('#' + result.oldStyles.closeButton.id);
            if (closeButton) {
                closeButton.style.border = result.oldStyles.closeButton.borderStyle;
            }
            
            sendResponse({ ok: true });
        });
    }
    // sendResponse({ bye: 'bye'});
});