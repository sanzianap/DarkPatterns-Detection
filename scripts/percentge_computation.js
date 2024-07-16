console.log("Content script has been injected.");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('I found the message ');
    console.log(message);
    if (message.action === "computeNewPercentage") {
        const article = document.querySelector("#" + message.divId);
        //console.log(`newHeight ${article.clientHeight} newWidth ${article.clientWidth}`);
        sendResponse({ newHeight: article.clientHeight, newWidth: article.clientWidth });
    } else if (message.action === 'colorDiv') {
        const article = document.querySelector("#" + message.divId);
        console.log(article);
        if (message.per <= 25) {
            article.style.border = "2px solid green";
        } else if (message.per <= 50) {
            article.style.border = "2px solid yellow";
        } else if (message.per <= 75) {
            article.style.border = "2px solid orange";
        } else {
            article.style.border = "2px solid red";
        } 
    }
    // sendResponse({ bye: 'bye'});
});