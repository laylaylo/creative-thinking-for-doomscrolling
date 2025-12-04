window.FocusDiary = {
    isDiaryMode: false,
    
    init: () => {
        // Add toggle button to the overlay when it's created
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.id === 'insta-focus-overlay') {
                        window.FocusDiary.addToggleButton();
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true });
    },
    
    addToggleButton: () => {
        const overlay = document.getElementById('insta-focus-overlay');
        if (!overlay || document.getElementById('diary-toggle-btn')) return;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'diary-toggle-btn';
        toggleBtn.className = 'diary-toggle';
        toggleBtn.innerHTML = '📔';
        toggleBtn.title = 'View Diary';
        toggleBtn.addEventListener('click', () => {
            window.FocusDiary.toggle();
        });
        overlay.appendChild(toggleBtn);
    },
    
    toggle: () => {
        window.FocusDiary.isDiaryMode = !window.FocusDiary.isDiaryMode;
        
        const box = document.getElementById('insta-focus-box');
        if (box) {
            box.className = '';
        }
        
        if (window.FocusDiary.isDiaryMode) {
            window.FocusDiary.showDiary();
        } else {
            window.FocusUI.showMenu();
        }
    },
    
    showDiary: () => {
        const box = document.getElementById('insta-focus-box');
        box.className = 'diary-mode';
        box.innerHTML = `
            <div class="diary-header">
                <h2>Your Daily Reflections</h2>
                <button id="diary-close-btn" class="diary-close">✕</button>
            </div>
            <div id="diary-container" class="diary-container">
                <div class="diary-loading">Loading your entries...</div>
            </div>
        `;
        
        document.getElementById('diary-close-btn').addEventListener('click', () => {
            window.FocusDiary.toggle();
        });
        
        window.FocusDiary.loadEntries();
    },
    
    loadEntries: () => {
        chrome.storage.local.get(['dailyEntries'], (result) => {
            if (chrome.runtime.lastError) {
                document.getElementById('diary-container').innerHTML = 
                    '<div class="diary-empty">Error loading entries.</div>';
                return;
            }
            
            const dailyEntries = result.dailyEntries || {};
            const allEntries = [];
            
            // Flatten all entries from all dates, sorted by timestamp
            Object.keys(dailyEntries).forEach(date => {
                dailyEntries[date].forEach(entry => {
                    allEntries.push(entry);
                });
            });
            
            // Sort by timestamp (newest first)
            allEntries.sort((a, b) => b.timestamp - a.timestamp);
            
            if (allEntries.length === 0) {
                document.getElementById('diary-container').innerHTML = 
                    '<div class="diary-empty">No entries yet. Complete some prompts to see them here!</div>';
                return;
            }
            
            window.FocusDiary.renderEntries(allEntries);
        });
    },
    
    renderEntries: (entries) => {
        const container = document.getElementById('diary-container');
        container.innerHTML = '<div class="diary-scroll-wrapper"><div class="diary-entries"></div></div>';
        const entriesContainer = container.querySelector('.diary-entries');
        
        entries.forEach(entry => {
            const entryCard = window.FocusDiary.createEntryCard(entry);
            entriesContainer.appendChild(entryCard);
        });
    },
    
    createEntryCard: (entry) => {
        const card = document.createElement('div');
        card.className = 'diary-entry-card';
        
        const date = new Date(entry.timestamp);
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        
        if (entry.type === 'drawing') {
            card.innerHTML = `
                <div class="diary-entry-header">
                    <span class="diary-entry-icon">🎨</span>
                    <div class="diary-entry-meta">
                        <span class="diary-entry-date">${dateString}</span>
                        <span class="diary-entry-time">${timeString}</span>
                    </div>
                </div>
                <div class="diary-entry-prompt">${entry.prompt}</div>
                <div class="diary-entry-content">
                    <img src="${entry.image}" alt="Drawing" class="diary-drawing-image">
                </div>
            `;
        } else if (entry.type === 'philosophy') {
            card.innerHTML = `
                <div class="diary-entry-header">
                    <span class="diary-entry-icon">🤔</span>
                    <div class="diary-entry-meta">
                        <span class="diary-entry-date">${dateString}</span>
                        <span class="diary-entry-time">${timeString}</span>
                    </div>
                </div>
                <div class="diary-entry-prompt">${entry.question}</div>
                <div class="diary-entry-content diary-text-response">
                    ${entry.response || 'No response'}
                </div>
            `;
        } else if (entry.type === 'math') {
            card.innerHTML = `
                <div class="diary-entry-header">
                    <span class="diary-entry-icon">🧠</span>
                    <div class="diary-entry-meta">
                        <span class="diary-entry-date">${dateString}</span>
                        <span class="diary-entry-time">${timeString}</span>
                    </div>
                </div>
                <div class="diary-entry-prompt">${entry.question}</div>
                <div class="diary-entry-content diary-text-response">
                    Answer: ${entry.answer}
                </div>
            `;
        } else {
            // Generic entry
            card.innerHTML = `
                <div class="diary-entry-header">
                    <span class="diary-entry-icon">📝</span>
                    <div class="diary-entry-meta">
                        <span class="diary-entry-date">${dateString}</span>
                        <span class="diary-entry-time">${timeString}</span>
                    </div>
                </div>
                <div class="diary-entry-content">${JSON.stringify(entry)}</div>
            `;
        }
        
        return card;
    }
};

// Initialize diary when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.FocusDiary.init);
} else {
    window.FocusDiary.init();
}

