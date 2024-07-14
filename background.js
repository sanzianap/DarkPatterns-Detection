chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "resizeWindow") {
        chrome.windows.getCurrent({}, function (window) {
            chrome.system.display.getInfo(function (displays) {
                // Find the display where the window is currently located
                let currentDisplay = displays.find(display => display.isPrimary);
                console.log('Displays:', displays);

                // Update the window
                chrome.windows.update(window.id, {
                    width: message.width,
                    height: message.height,
                    state: "normal"
                }, function (updatedWindow) {
                    if (chrome.runtime.lastError) {
                        console.error('Update failed:', chrome.runtime.lastError.message);
                    } else {
                        console.log('Window updated successfully:', updatedWindow);
                    }
                });
            });
        });
    }
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['dist/content.bundle.js']
      }, () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          console.log("Content script injected programmatically.");
        }
      });
    }
  });