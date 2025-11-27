// Check logic every second
setInterval(checkTime, 1000);

function checkTime() {
    // 1. Get the list of rules from storage
    chrome.storage.local.get(['rules', 'startTime', 'activeSite'], (data) => {
        const rules = data.rules || [];
        const currentUrl = window.location.hostname; // e.g., "www.reddit.com"

        // 2. Find if the current site matches any rule
        // We use 'includes' so "reddit" matches "old.reddit.com" and "www.reddit.com"
        const activeRule = rules.find(rule => currentUrl.includes(rule.site));

        if (activeRule) {
            // We found a rule for this site!
            handleTimer(activeRule, data);
        }
    });
}

function handleTimer(rule, data) {
    const now = Date.now();
    const timeLimitMs = rule.time * 60 * 1000;

    // Check if we just switched to this site or if it's a new session
    // We store 'activeSite' to track if user switched tabs
    if (data.activeSite !== rule.site) {
        chrome.storage.local.set({ 
            startTime: now,
            activeSite: rule.site 
        });
        return; 
    }

    if (data.startTime) {
        const elapsed = now - data.startTime;
        
        // If time is up AND overlay isn't there yet
        if (elapsed > timeLimitMs && !document.getElementById('insta-focus-overlay')) {
            lockScreen();
        }
    }
}

// --- STANDARD LOCK SCREEN CODE BELOW (SAME AS BEFORE) ---

function lockScreen() {
    document.body.classList.add('insta-locked');
    const overlay = document.createElement('div');
    overlay.id = 'insta-focus-overlay';
    overlay.innerHTML = `
        <div id="insta-focus-box">
            <h2>Time's Up!</h2>
            <p>Answer to unlock:</p>
            <p><strong>What is 5 x 8?</strong></p>
            <input type="number" id="insta-focus-input" autocomplete="off">
            <button id="insta-focus-btn">Unlock</button>
            <p id="error-msg" style="color:red; display:none; margin-top:10px;">Wrong!</p>
        </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('insta-focus-btn').addEventListener('click', checkAnswer);
}

function checkAnswer() {
    const answer = document.getElementById('insta-focus-input').value;
    if (answer === "40") {
        document.getElementById('insta-focus-overlay').remove();
        document.body.classList.remove('insta-locked');
        // Reset timer
        chrome.storage.local.set({ startTime: Date.now() });
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
}