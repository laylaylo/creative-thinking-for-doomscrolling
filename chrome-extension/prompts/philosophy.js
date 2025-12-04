window.FocusPrompts = window.FocusPrompts || {};

window.FocusPrompts.Philosophy = {
    id: "Philosophy",    // <--- ADD THIS LINE
    name: "Reflect",
    icon: "🤔",
    
    questions: [
        "What is your main goal for today?",
        "Are you doing what you intended to do right now?"
    ],

    render: () => {
        // ... keep your existing render code ...
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
            window.FocusUI.unlock();
        };
    }
};