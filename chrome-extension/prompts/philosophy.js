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