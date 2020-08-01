/* global browser */

function listenForClicks() {
  document.addEventListener('click', (e) => {

    /**
     * send a "therapy" message to the content script in the active tab.
     */
    function therapy(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: 'therapy',
        type: e.target.textContent
      });
    }

    /**
      * send a "reset" message to the content script in the active tab.
      */
    function reset(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: 'reset'
      });
    }

    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`Could not execute: ${error}`);
    }

    /**
     * Get the active tab,
     * then call "therapy()" or "reset()" as appropriate.
     */
    if (e.target.classList.contains('therapy')) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(therapy)
        .catch(reportError);
    }
    else if (e.target.classList.contains('reset')) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(reset)
        .catch(reportError);
    }

  });
}

/**
  * There was an error executing the script.
  * Display the popup's error message, and hide the normal UI.
  */
function reportExecuteScriptError(error) {
  document.querySelector('#popup-content').classList.add('hidden');
  document.querySelector('#error-content').classList.remove('hidden');
  console.error(`Failed to execute content script: ${error.message}`);
}

/**
  * When the popup loads, inject a content script into the active tab,
  * and add a click handler.
  * If we couldn't inject the script, handle the error.
  */
browser.tabs.executeScript({file: '/content_scripts/pika.js'})
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
