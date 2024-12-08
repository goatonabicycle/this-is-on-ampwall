chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "AMPWALL_SEARCH") {
    (async () => {
      try {
        const response = await fetch(
          `https://ampwall.com/api/search?query=${encodeURIComponent(message.artistName)}`,

          // This will turn into the following endpoint once it's available.
          // `https://ampwall.com/api/distro/${encodeURIComponent(message.artistName)}/check`,
          { signal: AbortSignal.timeout(5000) },
        );
        const data = await response.json();
        sendResponse({ success: true, data });
      } catch (error) {
        sendResponse({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    })();
    return true;
  }
});
