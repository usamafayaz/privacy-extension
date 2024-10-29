// content.js
let settings = {
  blurNames: true,
  blurMessages: true,
  hideLastMessage: true,
};

function applyPrivacyFeatures() {
  // Blur chat names and group names
  const chatNames = document.querySelectorAll('span[title][dir="auto"]');
  chatNames.forEach((element) => {
    element.classList.toggle("blur-content", settings.blurNames);
  });

  // Blur messages in the chat window
  const messages = document.querySelectorAll("div.copyable-text");
  messages.forEach((element) => {
    element.classList.toggle("blur-content", settings.blurMessages);
  });

  // Select last messages and apply blur
  const lastMessages = document.querySelectorAll(
    'div[data-testid="cell-frame-container"] div[aria-label] span[class]:not([data-testid])'
  );

  lastMessages.forEach((element) => {
    // Apply blur if hideLastMessage setting is enabled
    element.classList.toggle("blur-content", settings.hideLastMessage);
  });
}

function observeDOM() {
  const targetNode = document.body;
  const config = { childList: true, subtree: true };
  const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        applyPrivacyFeatures();
      }
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
}

// Load settings and apply features
chrome.storage.sync.get(
  ["blurNames", "blurMessages", "hideLastMessage"],
  function (data) {
    settings = {
      blurNames: data.blurNames !== false,
      blurMessages: data.blurMessages !== false,
      hideLastMessage: data.hideLastMessage !== false,
    };
    applyPrivacyFeatures();
    observeDOM();
  }
);

// Listen for settings changes
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "updateSettings") {
    chrome.storage.sync.get(
      ["blurNames", "blurMessages", "hideLastMessage"],
      function (data) {
        settings = {
          blurNames: data.blurNames !== false,
          blurMessages: data.blurMessages !== false,
          hideLastMessage: data.hideLastMessage !== false,
        };
        applyPrivacyFeatures();
      }
    );
  }
});
