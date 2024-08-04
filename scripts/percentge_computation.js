function prepareSelectoForElement(element) {
    if (element.id) {
        return '#' + element.id;
    } else if (element.class) {
        let selector = '';
        let classArray = element.class.split(' ');
        classArray.forEach(function (cl) {
            selector += '.' + cl;
        });
        return selector;
    }
    return;
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "computeNewPercentage") {
        if (message.divs.cookieDiv) {
            let selector = prepareSelectoForElement(message.divs.cookieDiv);
            if (selector) {
                const cookieDiv = document.querySelector(selector);
                sendResponse({ newHeight: cookieDiv.clientHeight, newWidth: cookieDiv.clientWidth });
            }
        }
        sendResponse({ found: false});
    } else if (message.action === 'colorDivs') {
        if (message.divs.cookieDiv) {
            let selector = prepareSelectoForElement(message.divs.cookieDiv);
            if (selector) {
                const cookieDiv = document.querySelector(selector);

                if (cookieDiv) {
                    if (message.per <= 25) {
                        cookieDiv.style.border = "10px solid green";
                    } else if (message.per <= 50) {
                        cookieDiv.style.border = "10px solid yellow";
                    } else if (message.per <= 75) {
                        cookieDiv.style.border = "10px solid orange";
                    } else {
                        cookieDiv.style.border = "10px solid red";
                    }
                }
            }
        }

        if (message.divs.rejectButton) {
            selector = prepareSelectoForElement(message.divs.rejectButton);
            if (selector) {
                const rejectButton = document.querySelector(selector);
                if (rejectButton) {
                    rejectButton.style.border = "5px solid green";
                }
            }
        }

        if (message.divs.closeButton) {
            selector = prepareSelectoForElement(message.divs.closeButton);
            if (selector) {
                const closeButton = document.querySelector(selector);
                if (closeButton) {
                    closeButton.style.border = "2px solid red";
                }
            }
        }
        sendResponse({ ok: true });
    } else if (message.action === 'undoStyles') {
        var localStorageValue = message.divs;
        if (localStorageValue.cookieDiv) {
            let selector = prepareSelectoForElement(localStorageValue.cookieDiv);
            if (selector) {
                const cookieDiv = document.querySelector(selector);
                if (cookieDiv) {
                    cookieDiv.style.border = localStorageValue.cookieDiv.borderStyle;
                }
            }
        }
        if (localStorageValue.rejectButton) {
            selector = prepareSelectoForElement(localStorageValue.rejectButton);
            if (selector) {
                const rejectButton = document.querySelector(selector);
                if (rejectButton) {
                    rejectButton.style.border = localStorageValue.rejectButton.borderStyle;
                }
            }
        }

        if (localStorageValue.closeButton) {
            selector = prepareSelectoForElement(localStorageValue.closeButton);
            if (selector) {
                const closeButton = document.querySelector(selector);
                if (closeButton) {
                    closeButton.style.border = localStorageValue.closeButton.borderStyle;
                }
            }
        }

        sendResponse({ ok: true });
    }
});