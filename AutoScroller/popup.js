// This script is for a Chrome extension popup that allows users to start and stop an auto-scrolling feature on the current tab.
// It uses the Chrome Extensions API to interact with the browser and injects a content script into the active tab to perform the scrolling.
// The script includes input fields for the user to specify the start delay, scroll delay, and number of scrolls.
// It also includes error handling to ensure that the user inputs valid numbers and provides feedback on the status of the scrolling.
// Author: Vedant Korade - https://github.com/godspeed-003/AutoScroller.git

let scrollIntervalId = null;

document.getElementById('startBtn').addEventListener('click', async () => {
  const startDelay = parseFloat(document.getElementById('startDelay').value);
  const delay = parseFloat(document.getElementById('delay').value);
  const count = parseInt(document.getElementById('count').value);

  if (isNaN(startDelay) || isNaN(delay) || isNaN(count) || startDelay < 0 || delay <= 0 || count <= 0) {
    document.getElementById('status').innerText = 'Please enter valid positive numbers.';
    return;
  }

  document.getElementById('status').innerText = 'Scrolling will start soon...';

  // Get the active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.id) {
    // Inject the content script with parameters and handle any potential errors
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: startAutoScroll,
      args: [startDelay, delay, count]
    }).catch((error) => {
      console.error('Error injecting script: ', error);
      document.getElementById('status').innerText = 'Error: Unable to start scrolling.';
    });
  }
});

document.getElementById('stopBtn').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.id) {
    // Stop the auto-scroll script and handle any potential errors
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: stopAutoScroll
    }).catch((error) => {
      console.error('Error injecting stop script: ', error);
      document.getElementById('status').innerText = 'Error: Unable to stop scrolling.';
    });
  }
  document.getElementById('status').innerText = 'Scrolling stopped.';
});

function startAutoScroll(startDelay, delay, count) {
  if (window.scrollIntervalId) {
    clearInterval(window.scrollIntervalId);
  }

  setTimeout(() => {
    let scrolled = 0;
    window.scrollIntervalId = setInterval(() => {
      window.scrollBy(0, 100); // Scroll down by 100 pixels
      scrolled++;
      console.log(`Scrolled ${scrolled} times`);

      if (scrolled >= count) {
        clearInterval(window.scrollIntervalId);
        window.scrollIntervalId = null;
        alert('Auto Scrolling Complete!');
      }
    }, delay * 1000);
  }, startDelay * 1000);
}

function stopAutoScroll() {
  if (window.scrollIntervalId) {
    clearInterval(window.scrollIntervalId);
    window.scrollIntervalId = null;
    alert('Auto Scrolling Stopped!');
  }
}
