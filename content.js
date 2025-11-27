const TIME_LIMIT = 30 * 1000; // 30 seconds
const CHECK_INTERVAL = 1000; // Check every second

// ============================================================================
// ACTIVITY CONFIGURATION
// ============================================================================
// Add new activity types here. Each activity should have:
// - type: unique identifier
// - name: display name
// - handler: function that creates and manages the activity UI
const ACTIVITY_TYPES = [
    {
        type: 'quiz',
        name: 'Math Quiz',
        handler: createQuizActivity
    },
    {
        type: 'drawing',
        name: 'Creative Drawing',
        handler: createDrawingActivity
    }
    // Team members can add more activity types here
];

// Drawing prompts - can be expanded by team members
const DRAWING_PROMPTS = [
    "Take a deep breath and draw something beautiful",
    "Pause for a moment and draw what brings you peace",
    "Take 30 seconds to draw something that makes you smile",
    "Draw a memory that brings you joy",
    "Create something that represents calm",
    "Draw what gratitude looks like to you",
    "Sketch a moment of serenity",
    "Draw something that inspires you"
];

// ============================================================================
// TIMER MANAGEMENT
// ============================================================================
function initTimer() {
    chrome.storage.local.get(['startTime'], (result) => {
        if (!result.startTime) {
            chrome.storage.local.set({ startTime: Date.now() });
        }
    });
}

setInterval(() => {
    chrome.storage.local.get(['startTime'], (result) => {
        if (result.startTime) {
            const timeElapsed = Date.now() - result.startTime;
            
            if (timeElapsed > TIME_LIMIT && !document.getElementById('insta-focus-overlay')) {
                lockScreen();
            }
        }
    });
}, CHECK_INTERVAL);

// ============================================================================
// SCREEN LOCKING/UNLOCKING
// ============================================================================
function lockScreen() {
    document.body.classList.add('insta-locked');
    
    // Randomly select an activity type
    const randomActivity = ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)];
    
    // Create overlay and let the activity handler build its UI
    const overlay = document.createElement('div');
    overlay.id = 'insta-focus-overlay';
    document.body.appendChild(overlay);
    
    // Call the activity's handler function
    randomActivity.handler(overlay);
}

function unlockScreen() {
    const overlay = document.getElementById('insta-focus-overlay');
    if (overlay) overlay.remove();
    
    document.body.classList.remove('insta-locked');
    chrome.storage.local.set({ startTime: Date.now() });
}

// ============================================================================
// ACTIVITY HANDLERS
// ============================================================================

// Quiz Activity Handler (original functionality)
function createQuizActivity(overlay) {
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
    
    document.getElementById('insta-focus-btn').addEventListener('click', () => {
        const answer = document.getElementById('insta-focus-input').value;
        if (answer === "22") {
            unlockScreen();
        } else {
            document.getElementById('error-msg').style.display = 'block';
        }
    });
}

// Drawing Activity Handler
function createDrawingActivity(overlay) {
    const DRAWING_TIME = 30 * 1000; // 30 seconds
    const prompt = DRAWING_PROMPTS[Math.floor(Math.random() * DRAWING_PROMPTS.length)];
    
    overlay.innerHTML = `
        <div id="insta-focus-box" class="drawing-activity">
            <h2>Creative Break!</h2>
            <p id="drawing-prompt">${prompt}</p>
            <div id="timer-display">Time remaining: <span id="timer-seconds">30</span>s</div>
            <canvas id="drawing-canvas" width="500" height="400"></canvas>
            <div class="canvas-controls">
                <button id="clear-canvas-btn">Clear</button>
            </div>
            <button id="resume-btn" style="display:none; margin-top:15px;">Resume Scrolling</button>
        </div>
    `;
    
    // Initialize drawing canvas
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // Set canvas background to white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Get canvas position relative to page
    function getCanvasCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }
    
    // Mouse/Trackpad event handlers
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const coords = getCanvasCoordinates(e);
        lastX = coords.x;
        lastY = coords.y;
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const coords = getCanvasCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
        lastX = coords.x;
        lastY = coords.y;
    });
    
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });
    
    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });
    
    // Touch support for mobile/trackpad
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const coords = getCanvasCoordinates(touch);
        isDrawing = true;
        lastX = coords.x;
        lastY = coords.y;
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const touch = e.touches[0];
        const coords = getCanvasCoordinates(touch);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
        lastX = coords.x;
        lastY = coords.y;
    });
    
    canvas.addEventListener('touchend', () => {
        isDrawing = false;
    });
    
    // Clear canvas button
    document.getElementById('clear-canvas-btn').addEventListener('click', () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    
    // Timer countdown
    let timeRemaining = DRAWING_TIME;
    const timerDisplay = document.getElementById('timer-seconds');
    const resumeBtn = document.getElementById('resume-btn');
    
    const timerInterval = setInterval(() => {
        timeRemaining -= 1000;
        const seconds = Math.ceil(timeRemaining / 1000);
        timerDisplay.textContent = seconds;
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = '0';
            document.getElementById('timer-display').textContent = 'Time\'s up!';
            resumeBtn.style.display = 'block';
        }
    }, 1000);
    
    // Resume button
    resumeBtn.addEventListener('click', unlockScreen);
}

// ============================================================================
// INITIALIZATION
// ============================================================================
initTimer();