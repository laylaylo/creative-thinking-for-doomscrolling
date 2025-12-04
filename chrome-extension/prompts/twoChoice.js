window.FocusPrompts = window.FocusPrompts || {};

window.FocusPrompts.TwoChoice = {
    id: "TwoChoice",
    name: "Quick Question",
    icon: "❓",

    // A list of questions that can be picked from
    questions: [
        {
            prompt: 'Are you being productive right now?',
            choices: ['Yes, I am', 'No, I\'m slacking'],
        },
        {
            prompt: 'Is this task important for your long-term goals?',
            choices: ['Absolutely', 'Not really'],
        },
        {
            prompt: 'Could this wait until tomorrow?',
            choices: ['Yes, it can', 'No, deadline is today'],
        }
    ],

    render: () => {
        const box = document.getElementById('insta-focus-box');
        const q = window.FocusPrompts.TwoChoice.questions;
        const randomQ = q[Math.floor(Math.random() * q.length)];

        box.innerHTML = `
            <h2>A Quick Question</h2>
            <p>${randomQ.prompt}</p>
            <div class="choices">
                <button id="insta-focus-btn" class="choice-btn">${randomQ.choices[0]}</button>
                <button id="insta-focus-btn" class="choice-btn">${randomQ.choices[1]}</button>
            </div>
        `;

        // Both buttons will unlock the screen
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.onclick = () => window.FocusUI.unlock();
        });
    }
};
