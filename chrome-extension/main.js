// Wait for DOM to be ready, then start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.FocusTimer.init);
} else {
    window.FocusTimer.init();
}