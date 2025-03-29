// This script is for a Chrome extension popup that allows users to start and stop an auto-scrolling feature on the current tab.
// It uses the Chrome Extensions API to interact with the browser and injects a content script into the active tab to perform the scrolling.
// The script includes input fields for the user to specify the start delay, scroll delay, and number of scrolls.
// It also includes error handling to ensure that the user inputs valid numbers and provides feedback on the status of the scrolling.
// Author: Vedant Korade - https://github.com/godspeed-003/AutoScroller.git

document.getElementById('startBtn').addEventListener('click', async () => {
  const startDelay = parseFloat(document.getElementById('startDelay').value);
  const delay = parseFloat(document.getElementById('delay').value);
  const count = parseInt(document.getElementById('count').value);

  if (isNaN(startDelay) || isNaN(delay) || isNaN(count) || startDelay < 0 || delay <= 0 || count <= 0) {
    document.getElementById('status').innerText = 'Please enter valid positive numbers.';
    return;
  }

  document.getElementById('status').innerText = 'Scrolling will start soon...';

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: startAutoScroll,
      args: [startDelay, delay, count]
    }).catch((error) => {
      console.error('Error injecting script:', error);
      document.getElementById('status').innerText = 'Error: Unable to start scrolling.';
    });
  }
});

document.getElementById('stopBtn').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: stopAutoScroll
    }).catch((error) => {
      console.error('Error injecting stop script:', error);
      document.getElementById('status').innerText = 'Error: Unable to stop scrolling.';
    });
  }
  document.getElementById('status').innerText = 'Scrolling stopped.';
});

// Function to start auto-scrolling
function startAutoScroll(startDelay, delay, count) {
  if (window.scrollIntervalId) {
    clearInterval(window.scrollIntervalId);
  }

  setTimeout(() => {
    let scrolled = 0;
    window.scrollIntervalId = setInterval(() => {
      // Simulate pressing the down arrow key
      const event = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'ArrowDown',
        code: 'ArrowDown',
        keyCode: 40, // Key code for down arrow
        which: 40
      });

      document.dispatchEvent(event); // Dispatch the event on the document
      scrolled++;
      console.log(`SCROLL! ${scrolled} times`);

      if (scrolled >= count) {
        clearInterval(window.scrollIntervalId);
        window.scrollIntervalId = null;
        alert('Auto Scrolling Complete!');
      }
    }, delay * 1000);
  }, startDelay * 1000);
}

// Function to stop auto-scrolling
function stopAutoScroll() {
  if (window.scrollIntervalId) {
    clearInterval(window.scrollIntervalId);
    window.scrollIntervalId = null;
    alert('Auto Scrolling Stopped!');
  }
}
