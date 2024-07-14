document.getElementById('resizeButton').addEventListener('click', () => {
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);
  
    chrome.runtime.sendMessage({
      action: "resizeWindow",
      width: width,
      height: height
    });
  });