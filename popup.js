document.addEventListener("DOMContentLoaded", function () {
  const blurNames = document.getElementById("blurNames");
  const blurMessages = document.getElementById("blurMessages");
  const hideLastMessage = document.getElementById("hideLastMessage");

  // Load saved settings
  chrome.storage.sync.get(
    ["blurNames", "blurMessages", "hideLastMessage"],
    function (data) {
      blurNames.checked = data.blurNames !== false;
      blurMessages.checked = data.blurMessages !== false;
      hideLastMessage.checked = data.hideLastMessage !== false;
    }
  );

  // Save settings when changed
  function saveSettings() {
    chrome.storage.sync.set(
      {
        blurNames: blurNames.checked,
        blurMessages: blurMessages.checked,
        hideLastMessage: hideLastMessage.checked,
      },
      function () {
        // Notify content script that settings have changed
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "updateSettings" });
          }
        );
      }
    );
  }

  blurNames.addEventListener("change", saveSettings);
  blurMessages.addEventListener("change", saveSettings);
  hideLastMessage.addEventListener("change", saveSettings);
});
