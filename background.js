chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF'
  });
});

let initialValues;
let tabId;
function injectContentScript(tabId, script) {
  console.log(`Attempting to inject content script into tab: ${tabId} at ${new Date().toISOString()}`);
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: [script]
  }, () => {
    if (chrome.runtime.lastError) {
      console.error(`Error injecting content script: ${chrome.runtime.lastError.message}`);
    } else {
      console.log(`Content script successfully injected into tab: ${tabId} at ${new Date().toISOString()}`);
    }
  });
}
let responseFromScript;
function injectContentScriptWithMessage(tabId, script, message) {
  console.log(`Attempting to inject content script into tab: ${tabId} at ${new Date().toISOString()}`);
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: [script]
  }, () => {
    if (chrome.runtime.lastError) {
      console.error(`Error injecting content script: ${chrome.runtime.lastError.message}`);
    } else {
      console.log(`Content script successfully injected into tab: ${tabId} at ${new Date().toISOString()}`);
      chrome.tabs.sendMessage(tabId, message, (response) => {
        console.log("Response from content script:", response);
        if (response) {
          responseFromScript = response;
        }
      });
    }
  });
}

function updateWindow(windowId, modificationObj) {
  // Update the window
  chrome.windows.update(windowId, {
    width: modificationObj.width,
    height: modificationObj.height,
    state: 'normal'
  }, function (updatedWindow) {
    if (chrome.runtime.lastError) {
      console.error('Update failed:', chrome.runtime.lastError.message);
    } else {
      console.log('Window updated successfully:', updatedWindow);
    }
  });
}

function updateDivCookies(message) {
  injectContentScriptWithMessage(tabId, 'scripts/percentge_computation.js', { action: 'colorDivs', divs: message.divs, per: message.per });
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
    chrome.windows.getCurrent({}, function (window) {
      initialValues = {
        windowId: window.id,
        focused: window.focused,
        height: window.height,
        left: window.left,
        state: window.state,
        top: window.top,
        width: window.width
      };
      if (initialValues.state !== 'maximized') {
        updateWindow(window.id, { state: "maximized" });
      }
      console.log(initialValues.height);
      //updateWindow(window.id, { width: message.width, height: message.height, state: "normal"});
    });
    injectContentScript(tab.id, 'dist/content.bundle.js');
    tabId = tab.id;
  } else {
    //chrome.tabs.reload(tab.id, { bypassCache: true });
    injectContentScriptWithMessage(tabId, 'scripts/percentge_computation.js', { action: 'undoStyles' });
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "divRetrieved") {
    chrome.windows.getCurrent({}, function (window) {
      let initialPercentage = (message.cookieDiv.divHeight * message.cookieDiv.divWidth) * 100 / (window.height * window.width);
      // console.log(` initialvaues ${initialValues.height}`);
      console.log(`Initial % ${initialPercentage}`);
      updateWindow(initialValues.windowId, { width: 360, height: 740, state: "normal" });
      injectContentScriptWithMessage(tabId, 'scripts/percentge_computation.js', { action: 'computeNewPercentage', divs: message });
      //console.log(`newHeight ${responseFromScript.newHeight} newWidth ${responseFromScript.newWidth}`);
      // chrome.runtime.sendMessage({
      //   action: "computeNewPercentage",
      //   id: message.id,
      //   class: message.className
      // }, function (response) {
      //   console.log("Response from background:", response);
      // });
      let secondPercentage = (responseFromScript.newHeight * responseFromScript.newWidth) * 100 / (360 * 740);
      let finalPercentage = secondPercentage * 0.7 + (initialPercentage - secondPercentage) * (-1) * 0.3;
      updateDivCookies({ per: finalPercentage, divs: message });
      updateWindow(initialValues.windowId, initialValues);
      // call resume.html
      chrome.windows.create({
        url: chrome.runtime.getURL("info/resume.html"),
        type: "panel",
        width: 400,
        height: 300
      });
      // Indicate that we will send a response asynchronously
      return true;
    });
  } else if (message.action === "clickPreferences") {
    injectContentScriptWithMessage(tabId, 'dist/content.bundle.js', {action: message.action});
    sendResponse();
  }
});