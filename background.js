chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: 'OFF'
    });
});

function injectContentScript(tabId) {
    console.log(`Attempting to inject content script into tab: ${tabId} at ${new Date().toISOString()}`);
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['dist/content.bundle.js']
    }, () => {
      if (chrome.runtime.lastError) {
        console.error(`Error injecting content script: ${chrome.runtime.lastError.message}`);
      } else {
        console.log(`Content script successfully injected into tab: ${tabId} at ${new Date().toISOString()}`);
      }
    });
  }

function updateWindow(windowId, modificationObj) {

}
// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
      // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
      const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
      // Next state will always be the opposite
      const nextState = prevState === 'ON' ? 'OFF' : 'ON';
  
      // Set the action badge to the next state
      await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState
      });
      if (nextState === 'ON') {
        injectContentScript (tab.id);
      }
  
    //   if (nextState === 'ON') {
    //     // Insert the CSS file when the user turns the extension on
    //     await chrome.scripting.insertCSS({
    //       files: ['focus-mode.css'],
    //       target: { tabId: tab.id }
    //     });
    //   } else if (nextState === 'OFF') {
    //     // Remove the CSS file when the user turns the extension off
    //     await chrome.scripting.removeCSS({
    //       files: ['focus-mode.css'],
    //       target: { tabId: tab.id }
    //     });0
    //   }
  });
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
        sendResponse({ farewell: "goodbye" });
    }
});