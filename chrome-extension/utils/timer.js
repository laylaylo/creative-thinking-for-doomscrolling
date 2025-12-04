window.FocusTimer = {
    init: () => {
        setInterval(window.FocusTimer.check, 1000);
    },

    check: () => {
        chrome.storage.local.get(['rules', 'startTime', 'activeSite'], (data) => {
            const rules = data.rules || [];
            const currentUrl = window.location.hostname;
            const activeRule = rules.find(rule => currentUrl.includes(rule.site));

            if (!activeRule) return;

            // If user switched tabs/sites, reset the tracker
            if (data.activeSite !== activeRule.site) {
                chrome.storage.local.set({ startTime: Date.now(), activeSite: activeRule.site });
                return;
            }

            if (data.startTime) {
                const elapsed = Date.now() - data.startTime;
                // Convert minutes to milliseconds
                if (elapsed > (activeRule.time * 60 * 1000)) {
                    // Call the UI manager to lock screen
                    window.FocusUI.lock();
                }
            }
        });
    }
};