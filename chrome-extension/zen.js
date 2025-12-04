// 1. Configuration: Scenes (Images + Audio)
const scenes = [
    {
        name: "Forest Rain",
        bg: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&w=1600&q=80",
        audio: "https://cdn.pixabay.com/download/audio/2022/02/16/audio_d0c6ff1bc9.mp3"
    },
    {
        name: "Ocean Sunset",
        bg: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&w=1600&q=80",
        audio: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_03d6990a36.mp3"
    },
    {
        name: "Campfire",
        bg: "https://images.unsplash.com/photo-1527259216948-b0c66d6fc31f?ixlib=rb-4.0.3&w=1600&q=80",
        audio: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_8db1f115a3.mp3"
    }
];

// 2. Setup Page on Load
document.addEventListener('DOMContentLoaded', () => {
    // Pick random scene
    const scene = scenes[Math.floor(Math.random() * scenes.length)];
    
    // Set Background
    document.body.style.backgroundImage = `url('${scene.bg}')`;
    
    // Create Audio
    const audio = new Audio(scene.audio);
    audio.loop = true;
    audio.volume = 0.6;
    audio.play().catch(e => console.log("Click page to play audio"));

    // 3. Timer Logic
    let timeLeft = 30;
    const timerDisplay = document.getElementById('timer');
    const btn = document.getElementById('return-btn');
    const status = document.getElementById('status');

    const interval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Relax for ${timeLeft} seconds`;
        
        if (timeLeft <= 0) {
            clearInterval(interval);
            timerDisplay.innerText = "You may return now.";
            status.innerText = "Complete";
            btn.disabled = false;
            btn.innerText = "Return to " + getReturnDomain();
        }
    }, 1000);

    // 4. Return Button Logic
    btn.addEventListener('click', () => {
        // Stop audio
        audio.pause();
        
        // Reset the timer in storage so they aren't blocked immediately
        chrome.storage.local.set({ startTime: Date.now() }, () => {
            // Get the URL they came from
            const params = new URLSearchParams(window.location.search);
            const returnUrl = params.get('from');
            
            if (returnUrl) {
                window.location.href = returnUrl;
            } else {
                window.close(); // Fallback
            }
        });
    });
});

// Helper to show "Return to Instagram" nicely
function getReturnDomain() {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('from');
    if (!url) return "Work";
    try {
        return new URL(url).hostname;
    } catch (e) { return "Work"; }
}