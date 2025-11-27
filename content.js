const TIME_LIMIT = 30 * 1000; // 30 seconds
const CHECK_INTERVAL = 1000; // Check every second

// 1. Initialize or Retrieve Timer
function initTimer() {
    chrome.storage.local.get(['startTime'], (result) => {
        if (!result.startTime) {
            // No time saved? Set it to NOW.
            chrome.storage.local.set({ startTime: Date.now() });
        }
    });
}

// 2. The Loop: Check time every second
setInterval(() => {
    chrome.storage.local.get(['startTime'], (result) => {
        if (result.startTime) {
            const timeElapsed = Date.now() - result.startTime;
            
            // If time is up AND the block isn't already there
            if (timeElapsed > TIME_LIMIT && !document.getElementById('insta-focus-overlay')) {
                lockScreen();
            }
        }
    });
}, CHECK_INTERVAL);

// 3. Lock the Screen
function lockScreen() {
    // A. Stop Scrolling
    document.body.classList.add('insta-locked');

    // B. Inject the HTML Overlay
    const overlay = document.createElement('div');
    overlay.id = 'insta-focus-overlay';
    overlay.innerHTML = `
        <div id="insta-focus-box">
            <h2>Time's Up!</h2>
            <p>To continue scrolling, answer this:</p>
            <p><strong>What is 15 + 7?</strong></p>
            <input type="number" id="insta-focus-input" placeholder="Answer..." autocomplete="off">
            <button id="insta-focus-btn">Unlock</button>
            <p id="error-msg" style="color:red; display:none; margin-top:10px;">Wrong answer!</p>
        </div>
    `;
    document.body.appendChild(overlay);

    // C. Add Click Listener to Button
    document.getElementById('insta-focus-btn').addEventListener('click', checkAnswer);
}

// 4. Check Answer
function checkAnswer() {
    const answer = document.getElementById('insta-focus-input').value;
    
    // Simple validation (15 + 7 = 22)
    if (answer === "22") {
        unlockScreen();
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
}

// 5. Unlock and Reset
function unlockScreen() {
    // Remove the overlay
    const overlay = document.getElementById('insta-focus-overlay');
    if (overlay) overlay.remove();

    // Restore scrolling
    document.body.classList.remove('insta-locked');

    // Reset the timer in storage to NOW
    chrome.storage.local.set({ startTime: Date.now() });
}

// Start the script
initTimer();