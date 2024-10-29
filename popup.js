document.addEventListener("DOMContentLoaded", function () {
  const blurNames = document.getElementById("blurNames");
  const blurMessages = document.getElementById("blurMessages");
  const hideProfilePictures = document.getElementById("hideProfilePictures");
  const hideLastMessages = document.getElementById("hideLastMessages");
  const hideMedia = document.getElementById("hideMedia");

  // Load saved settings
  chrome.storage.sync.get(
    [
      "blurNames",
      "blurMessages",
      "hideProfilePictures",
      "hideLastMessages",
      "hideMedia",
    ],
    function (data) {
      blurNames.checked = data.blurNames !== false;
      blurMessages.checked = data.blurMessages !== false;
      hideProfilePictures.checked = data.hideProfilePictures !== false;
      hideLastMessages.checked = data.hideLastMessages !== false;
      hideMedia.checked = data.hideMedia !== false;
    }
  );

  // Save settings when changed
  function saveSettings() {
    chrome.storage.sync.set(
      {
        blurNames: blurNames.checked,
        blurMessages: blurMessages.checked,
        hideProfilePictures: hideProfilePictures.checked,
        hideLastMessages: hideLastMessages.checked,
        hideMedia: hideMedia.checked,
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
  hideProfilePictures.addEventListener("change", saveSettings);
  hideLastMessages.addEventListener("change", saveSettings);
  hideMedia.addEventListener("change", saveSettings);
});
