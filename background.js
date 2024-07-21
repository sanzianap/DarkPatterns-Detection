chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF'
  });
});

function updateWindow(windowId, modificationObj) {
  // Update the window
  chrome.windows.update(windowId, {
    width: modificationObj.width,
    height: modificationObj.height,
    state: 'normal'
  });
}

function clearLocalStorage(tabId) {
  var key_initialValues = 'initial_values_' + tabId;
  var key_tabId = tabId.toString();
  var key_popups = 'popups_' + tabId;

  chrome.storage.local.remove([key_initialValues]);
  chrome.storage.local.remove([key_tabId]);
  chrome.storage.local.get([key_popups], (response) => {
    if (response) {
      let arrayPop = response[key_popups];
      if (arrayPop && arrayPop.length > 0) {
        arrayPop.forEach(popupId => {
          chrome.storage.local.remove([popupId.toString()]);
          chrome.windows.remove(popupId);
        });
      }
    }
  });
  chrome.storage.local.remove([key_popups]);
}

function updateDivCookies(message, tabId) {
  injectContentScriptWithMessage(tabId, 'scripts/percentge_computation.js', { action: 'colorDivs', divs: message.divs, per: message.per });
}

function processResponse(message, responseFromScript) {
  switch (message.action) {
    case 'getInitialDivs':
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const currentTabId = tabs[0].id;
          chrome.windows.getCurrent({}, function (window) {
            let initialPercentage = (responseFromScript.cookieDiv.divHeight * responseFromScript.cookieDiv.divWidth) * 100 / (window.height * window.width);
            var key = 'initial_values_' + currentTabId.toString();
            chrome.storage.local.get([key], (response) => {
              if (response) {
                var localStorageVariable = response[key];
                localStorageVariable.initialPercentage = initialPercentage;
                var newVariable = {};
                newVariable[key] = localStorageVariable;
                chrome.storage.local.set(newVariable);
                updateWindow(localStorageVariable.windowId, { width: 360, height: 740, state: "normal" });
                injectContentScriptWithMessage(localStorageVariable.tabId, 'scripts/percentge_computation.js', { action: 'computeNewPercentage', divs: responseFromScript });
              }
            });
          });
        }
      });
      break;
    case 'clickPreferences':
      updateDivCookies(responseFromScript, responseFromScript.tabId);
      break;
    case 'computeNewPercentage':
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const currentTabId = tabs[0].id;
          let key = 'initial_values_' + currentTabId.toString();
          chrome.storage.local.get([key], (response) => {
            if (response) {
              const initialValues = response[key];
              let secondPercentage = (responseFromScript.newHeight * responseFromScript.newWidth) * 100 / (360 * 740);
              let finalPercentage = secondPercentage * 0.7 + Math.abs(initialValues.initialPercentage - secondPercentage) * 0.3;
              updateDivCookies({ per: finalPercentage, divs: message.divs }, initialValues.tabId);
              updateWindow(initialValues.windowId, initialValues);
              // call resume.html
              chrome.windows.create({
                url: chrome.runtime.getURL("info/resume.html"),
                type: "panel",
                width: 400,
                height: 300
              }, (newWindow) => {
                // clear any values may be previously set
                chrome.storage.local.remove([newWindow.id.toString()]);

                // should include tabId
                var popupDetails = {};
                popupDetails[newWindow.id] = { tabIdToAction: initialValues.tabId };
                chrome.storage.local.set(popupDetails);

                var keyPopup = "popups_" + initialValues.tabId.toString();
                chrome.storage.local.get([keyPopup], (response) => {
                  if (response) {
                    var arrayWithPopups = response[keyPopup];
                    if (!arrayWithPopups) {
                      var newVar = {};
                      newVar[keyPopup] = [newWindow.id];
                      chrome.storage.local.set(newVar);
                    } else {
                      arrayWithPopups.push(newWindow.id);
                      var newVar = {};
                      newVar[keyPopup] = arrayWithPopups;
                      chrome.storage.local.set(newVar);
                    }
                  }
                });
              });
            }
          });
        }
      });
      break;
    case 'undoStyles':
      // close the popup
      break;
    case 'colorDivs':
      // Do I need something here?
      break;
  }
}

function injectContentScriptWithMessage(tabId, script, message) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: [script]
  }, () => {
    if (chrome.runtime.lastError) {
      console.error(`Error injecting content script: ${chrome.runtime.lastError.message}`);
    } else {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (response) {
          processResponse(message, response);
        }
      });
    }
  });
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
      // clear any values may be previously set
      var key = 'initial_values_' + tab.id.toString();
      chrome.storage.local.remove([key]);

      var objectToStore = {
        tabId: tab.id,
        windowId: window.id,
        focused: window.focused,
        height: window.height,
        left: window.left,
        state: window.state,
        top: window.top,
        width: window.width
      };
      var initialValues = {};
      initialValues[key] = objectToStore;
      chrome.storage.local.set(initialValues);

      if (objectToStore.state !== 'maximized') {
        updateWindow(window.id, { state: "maximized" });
      }
    });
    injectContentScriptWithMessage(tab.id, 'dist/content.bundle.js', { action: 'getInitialDivs', tabId: tab.id });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const currentTabId = tabs[0].id;
        var key = currentTabId.toString();
        chrome.storage.local.get([key], (response) => {
          if (response) {
            injectContentScriptWithMessage(tab.id, 'scripts/percentge_computation.js', { action: 'undoStyles', divs: response[key] });
          }
        });
        clearLocalStorage(currentTabId);
      }
    });
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "clickPreferencesFromP") {
    chrome.storage.local.get([message.tabIdToAction.toString()], (response) => {
      if (response) {
        var localStorageValue = response[message.tabIdToAction.toString()];
        injectContentScriptWithMessage(message.tabIdToAction, 'dist/content.bundle.js', { action: 'clickPreferences', divs: localStorageValue, tabId: message.tabIdToAction });
      }
    });
  }
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  clearLocalStorage(tabId);
});