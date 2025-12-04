window.FocusPrompts = window.FocusPrompts || {};

window.FocusPrompts.Nature = {
    id: "Nature",
    name: "Zen Room",
    icon: "🍃",
    
    render: () => {
        // 1. Build the correct URL
        const currentUrl = window.location.href;
        const zenPageUrl = chrome.runtime.getURL('zen.html') + `?from=${encodeURIComponent(currentUrl)}`;
        
        // 2. Send a message to background.js: "Hey VIP, please open this URL for me"
        chrome.runtime.sendMessage({ 
            action: "openZenMode", 
            url: zenPageUrl 
        });
    }
};