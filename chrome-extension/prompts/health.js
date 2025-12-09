window.FocusPrompts = window.FocusPrompts || {};

window.FocusPrompts.Health = {
    id: "Health",
    name: "Health Break",
    icon: "💪",

    render: () => {
        const box = document.getElementById('insta-focus-box');

        box.innerHTML = `
            <h2>Take a Health Break</h2>
            <p>Complete these activities to unlock and continue.</p>

            <div style="text-align: left; margin: 20px 0;">
                <!-- Stretch Activity with Timer -->
                <div id="stretch-container" style="padding: 10px; background: rgba(255,255,255,0.1); margin-bottom: 8px; border-radius: 8px;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="flex: 1;">
                            <span style="font-size: 18px;">Do a stretch 🧘‍♀️</span>
                            <div id="stretch-timer" style="font-size: 24px; font-weight: bold; color: #4CAF50; margin-top: 5px; display: none;">
                                5:00
                            </div>
                        </div>
                        <button id="stretch-btn" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
                            Start 5 min
                        </button>
                        <input type="checkbox" id="stretch-check" class="health-check" style="transform: scale(1.5); margin-left: 15px; display: none;" disabled>
                    </div>
                </div>

                <!-- Drink Water Activity -->
                <label style="display: flex; align-items: center; padding: 10px; background: rgba(255,255,255,0.1); margin-bottom: 8px; border-radius: 8px; cursor: pointer; transition: 0.2s;">
                    <input type="checkbox" id="drink-check" class="health-check" style="transform: scale(1.5); margin-right: 15px;">
                    <span style="font-size: 18px;">Don't forget to drink something and have a break 💧</span>
                </label>
            </div>

            <button id="insta-focus-btn" disabled style="opacity: 0.5; cursor: not-allowed;">Complete All</button>
        `;

        const stretchBtn = document.getElementById('stretch-btn');
        const stretchTimer = document.getElementById('stretch-timer');
        const stretchCheck = document.getElementById('stretch-check');
        const drinkCheck = document.getElementById('drink-check');
        const completeBtn = document.getElementById('insta-focus-btn');

        let timerInterval = null;
        let timeLeft = 300; // 5 minutes in seconds

        // Start timer when stretch button is clicked
        stretchBtn.onclick = () => {
            stretchBtn.style.display = 'none';
            stretchTimer.style.display = 'block';

            timerInterval = setInterval(() => {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                stretchTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    stretchTimer.textContent = '✓ Done!';
                    stretchTimer.style.color = '#8BC34A';
                    stretchCheck.style.display = 'inline';
                    stretchCheck.disabled = false;
                    stretchCheck.checked = true;
                    checkAllComplete();
                }
            }, 1000);
        };

        // Check if all activities are complete
        const checkAllComplete = () => {
            const allChecked = stretchCheck.checked && drinkCheck.checked;

            if (allChecked) {
                completeBtn.disabled = false;
                completeBtn.style.opacity = "1";
                completeBtn.style.cursor = "pointer";
                completeBtn.innerText = "All Done! Unlock";
            } else {
                completeBtn.disabled = true;
                completeBtn.style.opacity = "0.5";
                completeBtn.style.cursor = "not-allowed";
                completeBtn.innerText = "Complete All";
            }
        };

        drinkCheck.addEventListener('change', checkAllComplete);

        // Unlock action
        completeBtn.onclick = () => {
            if (timerInterval) clearInterval(timerInterval);
            window.FocusUI.unlock();
        };
    }
};
