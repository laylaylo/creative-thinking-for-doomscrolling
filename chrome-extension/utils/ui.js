window.FocusUI = {
    lock: () => {
        if (document.getElementById('insta-focus-overlay')) return;
        
        document.body.classList.add('insta-locked');
        
        const overlay = document.createElement('div');
        overlay.id = 'insta-focus-overlay';
        overlay.innerHTML = `<div id="insta-focus-box"></div>`;
        document.body.appendChild(overlay);

        window.FocusUI.showMenu();
    },

    unlock: () => {
        const overlay = document.getElementById('insta-focus-overlay');
        if (overlay) overlay.remove();
        document.body.classList.remove('insta-locked');
        
        // Reset Timer
        chrome.storage.local.set({ startTime: Date.now() });
    },

    showMenu: () => {
        const box = document.getElementById('insta-focus-box');
        
        let html = `
            <h2>Time's Up!</h2>
            <p>Choose a prompt to unlock:</p>
            <div class="task-menu-grid">
        `;

        // 1. Generate HTML with data attributes instead of onclick
        if (window.FocusPrompts) {
            Object.values(window.FocusPrompts).forEach(prompt => {
                html += `
                    <div class="task-menu-btn js-task-btn" data-id="${prompt.id}">
                        <span>${prompt.icon}</span>
                        <h3>${prompt.name}</h3>
                    </div>
                `;
            });
        }

        html += `</div>`;
        box.innerHTML = html;

        // 2. Attach Event Listeners safely via JavaScript
        // This runs inside the extension's isolated world, so it can see 'FocusPrompts'
        const buttons = box.querySelectorAll('.js-task-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                const promptId = this.getAttribute('data-id');
                const prompt = window.FocusPrompts[promptId];
                
                if (prompt) {
                    prompt.render();
                } else {
                    console.error("Prompt not found:", promptId);
                }
            });
        });
    }
};