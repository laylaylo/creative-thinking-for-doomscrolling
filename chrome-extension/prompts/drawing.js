window.FocusPrompts = window.FocusPrompts || {};

// Helper function to save drawings to storage for daily overview
function saveDrawing(canvas, prompt) {
    try {
        // Convert canvas to base64 image
        const imageData = canvas.toDataURL('image/png');
        
        // Get current date in YYYY-MM-DD format
        const today = new Date();
        const dateKey = today.toISOString().split('T')[0];
        
        // Create entry object
        const entry = {
            type: 'drawing',
            prompt: prompt,
            image: imageData,
            timestamp: Date.now(),
            date: dateKey
        };
        
        // Get existing daily entries
        chrome.storage.local.get(['dailyEntries'], (result) => {
            if (chrome.runtime.lastError) {
                console.error('Error saving drawing:', chrome.runtime.lastError);
                return;
            }
            
            const dailyEntries = result.dailyEntries || {};
            
            // Initialize array for today if it doesn't exist
            if (!dailyEntries[dateKey]) {
                dailyEntries[dateKey] = [];
            }
            
            // Add the new entry
            dailyEntries[dateKey].push(entry);
            
            // Save back to storage
            chrome.storage.local.set({ dailyEntries: dailyEntries }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error saving daily entries:', chrome.runtime.lastError);
                }
            });
        });
    } catch (error) {
        console.error('Error saving drawing:', error);
    }
}

window.FocusPrompts.Drawing = {
    id: "Drawing",
    name: "Creative Drawing",
    icon: "🎨",
    
    prompts: [
        "Take a deep breath and draw something beautiful",
        "Pause for a moment and draw what brings you peace",
        "Take 30 seconds to draw something that makes you smile",
        "Draw a memory that brings you joy",
        "Create something that represents calm",
        "Draw what gratitude looks like to you",
        "Sketch a moment of serenity",
        "Draw something that inspires you",
        "Draw what hope feels like",
        "Create something that represents growth",
        "Draw a place where you feel safe",
        "Sketch what kindness looks like to you"
    ],
    
    render: () => {
        const box = document.getElementById('insta-focus-box');
        const DRAWING_TIME = 30 * 1000; // 30 seconds
        const prompt = window.FocusPrompts.Drawing.prompts[
            Math.floor(Math.random() * window.FocusPrompts.Drawing.prompts.length)
        ];
        
        box.className = 'drawing-activity';
        box.innerHTML = `
            <h2>Creative Break!</h2>
            <p id="drawing-prompt">${prompt}</p>
            <div id="timer-display">Time remaining: <span id="timer-seconds">30</span>s</div>
            <div class="drawing-tools">
                <div class="color-palette">
                    <div class="color-option active" data-color="#000000" style="background-color: #000000;" title="Black"></div>
                    <div class="color-option" data-color="#FF6B6B" style="background-color: #FF6B6B;" title="Red"></div>
                    <div class="color-option" data-color="#4ECDC4" style="background-color: #4ECDC4;" title="Teal"></div>
                    <div class="color-option" data-color="#45B7D1" style="background-color: #45B7D1;" title="Blue"></div>
                    <div class="color-option" data-color="#FFA07A" style="background-color: #FFA07A;" title="Coral"></div>
                    <div class="color-option" data-color="#98D8C8" style="background-color: #98D8C8;" title="Mint"></div>
                    <div class="color-option" data-color="#F7DC6F" style="background-color: #F7DC6F;" title="Yellow"></div>
                    <div class="color-option" data-color="#BB8FCE" style="background-color: #BB8FCE;" title="Purple"></div>
                </div>
                <div class="brush-sizes">
                    <button class="brush-size active" data-size="2" title="Small">●</button>
                    <button class="brush-size" data-size="4" title="Medium">●</button>
                    <button class="brush-size" data-size="6" title="Large">●</button>
                    <button class="brush-size" data-size="10" title="Extra Large">●</button>
                </div>
            </div>
            <canvas id="drawing-canvas" width="500" height="400" style="max-width: 100%; height: auto;"></canvas>
            <div class="canvas-controls">
                <button id="clear-canvas-btn">Clear</button>
            </div>
            <button id="resume-btn" style="display:none; margin-top:15px;">Resume Scrolling</button>
        `;
        
        // Initialize drawing canvas
        const canvas = document.getElementById('drawing-canvas');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        
        // Current drawing settings
        let currentColor = '#000000';
        let currentBrushSize = 2;
        
        // Set canvas background to white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentBrushSize;
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
        
        // Color palette event handlers
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                currentColor = option.dataset.color;
                ctx.strokeStyle = currentColor;
            });
        });
        
        // Brush size event handlers
        document.querySelectorAll('.brush-size').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.brush-size').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentBrushSize = parseInt(btn.dataset.size);
                ctx.lineWidth = currentBrushSize;
            });
        });
        
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
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentBrushSize;
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
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentBrushSize;
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
        
        // Resume button - save drawing before unlocking
        resumeBtn.addEventListener('click', () => {
            // Save the drawing to storage
            saveDrawing(canvas, prompt);
            window.FocusUI.unlock();
        });
    }
};

