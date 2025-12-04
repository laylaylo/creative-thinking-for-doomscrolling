window.FocusPrompts = window.FocusPrompts || {};

window.FocusPrompts.Reminders = {
    id: "Reminders",
    name: "Daily Goals",
    icon: "📝", // Emoji icon

    // You can edit these reminders here
    items: [
        "Drink a glass of water 💧",
        "Fix your posture (sit up straight!) 🪑",
        "Take 3 deep breaths 🧘",
        "Review your main goal for the day 🎯"
    ],

    render: () => {
        const box = document.getElementById('insta-focus-box');
        const items = window.FocusPrompts.Reminders.items;

        // Generate HTML for checkboxes
        let listHtml = `<div style="text-align: left; margin: 20px 0;">`;
        items.forEach((item, index) => {
            listHtml += `
                <label style="display: flex; align-items: center; padding: 10px; background: rgba(255,255,255,0.1); margin-bottom: 8px; border-radius: 8px; cursor: pointer; transition: 0.2s;">
                    <input type="checkbox" class="focus-check" style="transform: scale(1.5); margin-right: 15px;">
                    <span style="font-size: 18px;">${item}</span>
                </label>
            `;
        });
        listHtml += `</div>`;

        box.innerHTML = `
            <h2>Daily Check</h2>
            <p>Complete your habits to unlock.</p>
            
            ${listHtml}

            <button id="insta-focus-btn" disabled style="opacity: 0.5; cursor: not-allowed;">Complete All</button>
        `;

        // Logic: Enable button only when ALL boxes are checked
        const checkboxes = box.querySelectorAll('.focus-check');
        const btn = document.getElementById('insta-focus-btn');

        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                // Check if ALL are checked
                const allChecked = Array.from(checkboxes).every(c => c.checked);
                
                if (allChecked) {
                    btn.disabled = false;
                    btn.style.opacity = "1";
                    btn.style.cursor = "pointer";
                    // Add a nice visual flair to the button
                    btn.innerText = "All Done! Unlock";
                } else {
                    btn.disabled = true;
                    btn.style.opacity = "0.5";
                    btn.style.cursor = "not-allowed";
                    btn.innerText = "Complete All";
                }
            });
        });

        // Unlock action
        btn.onclick = () => {
            window.FocusUI.unlock();
        };
    }
};