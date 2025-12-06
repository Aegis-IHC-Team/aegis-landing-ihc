// ========================================
// AEGIS - Splash Screen Logic
// ========================================

// Auto-redirect after 3 seconds
setTimeout(() => {
    // Check if user is logged in
    if (StorageManager.isLoggedIn()) {
        window.location.href = 'home.html';
    } else {
        window.location.href = 'login.html';
    }
}, 3000);

// Preload next page for smoother transition
window.addEventListener('load', () => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = StorageManager.isLoggedIn() ? 'home.html' : 'login.html';
    document.head.appendChild(link);
});
