// 1. Load existing rules when page opens
document.addEventListener('DOMContentLoaded', restoreOptions);

// 2. Add new rule when button clicked
document.getElementById('add-btn').addEventListener('click', addRule);

function addRule() {
    const site = document.getElementById('site').value.trim();
    const time = document.getElementById('minutes').value;

    if (!site || !time) {
        alert("Please enter both a website and time.");
        return;
    }

    chrome.storage.local.get({ rules: [] }, (result) => {
        const rules = result.rules;
        rules.push({ site: site, time: parseInt(time) });
        
        chrome.storage.local.set({ rules: rules }, () => {
            restoreOptions(); // Refresh list
            document.getElementById('site').value = '';
            document.getElementById('minutes').value = '';
        });
    });
}

function restoreOptions() {
    chrome.storage.local.get({ rules: [] }, (result) => {
        const list = document.getElementById('rules-list');
        list.innerHTML = ''; // Clear current list
        
        result.rules.forEach((rule, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="site-name">${rule.site}</span> 
                <span>${rule.time} mins</span>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            list.appendChild(li);
        });

        // Add delete functionality
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                deleteRule(e.target.dataset.index);
            });
        });
    });
}

function deleteRule(index) {
    chrome.storage.local.get({ rules: [] }, (result) => {
        const rules = result.rules;
        rules.splice(index, 1); // Remove item at index
        chrome.storage.local.set({ rules: rules }, restoreOptions);
    });
}