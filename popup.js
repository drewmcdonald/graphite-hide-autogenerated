/**
 * @file popup.js
 * This script handles the logic for the browser action popup.
 * It allows the user to temporarily disable the hiding of autogenerated cards
 * for the current page load.
 */

document.addEventListener("DOMContentLoaded", function () {
  const showOnceButton = document.getElementById("showOnceButton");

  if (showOnceButton) {
    showOnceButton.addEventListener("click", async function () {
      try {
        // Set a session storage flag to indicate that hiding should be disabled.
        // chrome.storage.session is cleared when the browser session ends or can be cleared by the extension.
        await chrome.storage.session.set({
          hideAutogeneratedTemporarilyDisabled: true,
        });
        console.log(
          "[Hide autogenerated files Popup] Temporary disable flag set.",
        );

        // Get the current active tab in the current window.
        const [currentTab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (currentTab && currentTab.id) {
          // Reload the current tab. The content script on that page will
          // check the flag and skip hiding for this one load.
          chrome.tabs.reload(currentTab.id, () => {
            if (chrome.runtime.lastError) {
              console.error(
                "[Hide autogenerated files Popup] Error reloading tab:",
                chrome.runtime.lastError.message,
              );
            } else {
              console.log("[Hide autogenerated files Popup] Tab reloaded.");
            }
            // Close the popup window after the action.
            window.close();
          });
        } else {
          console.error(
            "[Hide autogenerated files Popup] Could not get current tab ID.",
          );
          window.close();
        }
      } catch (error) {
        console.error(
          "[Hide autogenerated files Popup] Error setting storage or reloading tab:",
          error,
        );
        window.close();
      }
    });
  } else {
    console.error(
      '[Hide autogenerated files Popup] "showOnceButton" not found.',
    );
  }
});
