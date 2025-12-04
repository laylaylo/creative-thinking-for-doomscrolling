window.FocusPrompts = window.FocusPrompts || {};

window.FocusPrompts.Philosophy = {
    id: "Philosophy",    // <--- ADD THIS LINE
    name: "Reflect",
    icon: "🤔",

    questions: [
        "What is your main goal for today?",
        "What is your main goal for this week?",
        "What is your main goal for this year?",
        "What is your purpose of life?",
        "If you had one extra free hour today, how would you use it?",
        "What are your dinner plans for tonight?",
        "Where do you see yourself in 2 years?"
    ],

    render: () => {
        const box = document.getElementById('insta-focus-box');
        const q = window.FocusPrompts.Philosophy.questions;
        const randomQ = q[Math.floor(Math.random() * q.length)];

        box.innerHTML = `
            <h2>Reflection</h2>
            <p>${randomQ}</p>
            <textarea id="insta-focus-input" placeholder="Type your thought here..."></textarea>
            <button id="insta-focus-btn">I'm Focused</button>
        `;

        document.getElementById('insta-focus-btn').onclick = () => {
            const response = document.getElementById('insta-focus-input').value.trim();
            savePhilosophyResponse(randomQ, response);
            window.FocusUI.unlock();
        };
    }
};

// Helper function to save philosophy responses to storage for daily overview
function savePhilosophyResponse(question, response) {
    try {
        const today = new Date();
        const dateKey = today.toISOString().split('T')[0];
        
        const entry = {
            type: 'philosophy',
            question: question,
            response: response,
            timestamp: Date.now(),
            date: dateKey
        };
        
        chrome.storage.local.get(['dailyEntries'], (result) => {
            if (chrome.runtime.lastError) {
                console.error('Error saving philosophy response:', chrome.runtime.lastError);
                return;
            }
            
            const dailyEntries = result.dailyEntries || {};
            
            if (!dailyEntries[dateKey]) {
                dailyEntries[dateKey] = [];
            }
            
            dailyEntries[dateKey].push(entry);
            
            chrome.storage.local.set({ dailyEntries: dailyEntries }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error saving daily entries:', chrome.runtime.lastError);
                }
            });
        });
    } catch (error) {
        console.error('Error saving philosophy response:', error);
    }
}