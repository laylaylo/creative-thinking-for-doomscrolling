window.FocusPrompts = window.FocusPrompts || {};

window.FocusPrompts.Math = {
    id: "Math",          // <--- ADD THIS LINE
    name: "Arithmetic",
    icon: "🧠",          // Ensure this is here too if you want the emoji
    
    render: () => {
        // ... keep your existing code ...
        const box = document.getElementById('insta-focus-box');
        const num1 = Math.floor(Math.random() * 12) + 3;
        const num2 = Math.floor(Math.random() * 9) + 2;
        const answer = num1 * num2;

        box.innerHTML = `
            <h2>Quick Math</h2>
            <p><strong>${num1} × ${num2} = ?</strong></p>
            <input type="number" id="insta-focus-input" placeholder="?" autocomplete="off">
            <button id="insta-focus-btn">Unlock</button>
            <p id="error-msg" style="display:none;">Wrong answer!</p>
        `;

        document.getElementById('insta-focus-btn').onclick = () => {
            const val = document.getElementById('insta-focus-input').value;
            if (parseInt(val) === answer) {
                window.FocusUI.unlock();
            } else {
                const err = document.getElementById('error-msg');
                err.style.display = 'block';
            }
        };
    }
};