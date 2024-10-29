const CLASS_NAMES = {
  blurContent: "blur-content",
  hideContent: "hide-content",
  chatNames: 'span[title][dir="auto"]',
  messages: "div.copyable-text",
  profilePictures: 'img[data-testid="user-avatar"]',
  lastMessages:
    'div[data-testid="cell-frame-container"] div[aria-label] span[class]:not([data-testid])',
  media: 'div[data-testid="media-viewer-container"]',
};

let settings = {
  blurNames: true,
  blurMessages: true,
  hideProfilePictures: true,
  hideLastMessages: true,
  hideMedia: true,
};

function applyPrivacyFeatures() {
  // Blur chat names and group names
  document.querySelectorAll(CLASS_NAMES.chatNames).forEach((element) => {
    element.classList.toggle(CLASS_NAMES.blurContent, settings.blurNames);
  });

  // Blur messages in the chat window
  document.querySelectorAll(CLASS_NAMES.messages).forEach((element) => {
    element.classList.toggle(CLASS_NAMES.blurContent, settings.blurMessages);
  });

  // Hide profile pictures in the chat list
  document.querySelectorAll(CLASS_NAMES.profilePictures).forEach((element) => {
    element.classList.toggle(
      CLASS_NAMES.hideContent,
      settings.hideProfilePictures
    );
  });

  // Hide last messages in the chat list
  document.querySelectorAll(CLASS_NAMES.lastMessages).forEach((element) => {
    element.classList.toggle(
      CLASS_NAMES.hideContent,
      settings.hideLastMessages
    );
  });

  // Hide media in the chat window
  document.querySelectorAll(CLASS_NAMES.media).forEach((element) => {
    element.classList.toggle(CLASS_NAMES.hideContent, settings.hideMedia);
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
  [
    "blurNames",
    "blurMessages",
    "hideProfilePictures",
    "hideLastMessages",
    "hideMedia",
  ],
  function (data) {
    settings = {
      blurNames: data.blurNames !== false,
      blurMessages: data.blurMessages !== false,
      hideProfilePictures: data.hideProfilePictures !== false,
      hideLastMessages: data.hideLastMessages !== false,
      hideMedia: data.hideMedia !== false,
    };
    applyPrivacyFeatures();
    observeDOM();
  }
);

// Listen for settings changes
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "updateSettings") {
    chrome.storage.sync.get(
      [
        "blurNames",
        "blurMessages",
        "hideProfilePictures",
        "hideLastMessages",
        "hideMedia",
      ],
      function (data) {
        settings = {
          blurNames: data.blurNames !== false,
          blurMessages: data.blurMessages !== false,
          hideProfilePictures: data.hideProfilePictures !== false,
          hideLastMessages: data.hideLastMessages !== false,
          hideMedia: data.hideMedia !== false,
        };
        applyPrivacyFeatures();
      }
    );
  }
});
