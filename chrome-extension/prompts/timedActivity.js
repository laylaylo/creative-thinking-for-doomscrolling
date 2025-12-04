window.FocusPrompts = window.FocusPrompts || {};

window.FocusPrompts.TimedActivity = {
    id: "TimedActivity",
    name: "Break Time",
    icon: "⏱️",

    activities: [
        {
            prompt: "Take a 30-second break. Look away from the screen and stretch your back.",
            duration: 10 // seconds
        },
        {
            prompt: "Close your eyes for 1 minute and focus on your breathing.",
            duration: 10 // seconds
        },
        {
            prompt: "Stand up and walk around the room for 2 minutes.",
            duration: 10 // seconds
        }
    ],

    render: () => {
        const box = document.getElementById('insta-focus-box');
        const a = window.FocusPrompts.TimedActivity.activities;
        const randomActivity = a[Math.floor(Math.random() * a.length)];

        box.innerHTML = `
            <h2>Time for a Break</h2>
            <p>${randomActivity.prompt}</p>
            <p>Continuing in: <span id="breaker-timer">${randomActivity.duration}</span>s</p>
            <button id="insta-focus-btn" disabled>Continue</button>
        `;

        const timerEl = document.getElementById('breaker-timer');
        const continueBtn = document.getElementById('insta-focus-btn');
        let timeLeft = randomActivity.duration;

        const interval = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(interval);
                timerEl.textContent = '0';
                continueBtn.disabled = false;
                continueBtn.textContent = 'Done!';
                continueBtn.onclick = () => window.FocusUI.unlock();
            }
        }, 1000);
    }
};
