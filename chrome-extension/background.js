// background.js - The VIP Handler

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 1. Listen for the "Open Zen Mode" command
    if (request.action === "openZenMode") {
        
        // 2. Update the current tab to show the Zen page
        // (sender.tab.id is the ID of the Instagram/LinkedIn tab)
        chrome.tabs.update(sender.tab.id, { url: request.url });
    }
});