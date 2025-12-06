// ========================================
// AEGIS - Navigation Logic
// ========================================

// This file contains shared navigation functions used across pages

// Check if user is logged in on protected pages
function checkAuth() {
    const publicPages = ['login.html', 'register.html', 'password-recovery.html', 'index.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (!publicPages.includes(currentPage)) {
        if (!StorageManager.isLoggedIn()) {
            window.location.href = '/login.html';
            return false;
        }
    }

    return true;
}

// Update user header with profile info
function updateUserHeader() {
    const currentUser = StorageManager.getCurrentUser();
    if (!currentUser) return;

    // Update avatar
    const avatarElement = document.getElementById('headerAvatar');
    if (avatarElement && currentUser.avatar) {
        avatarElement.src = currentUser.avatar;
    }

    // Update username
    const userNameElement = document.getElementById('headerUserName');
    if (userNameElement && currentUser.username) {
        userNameElement.textContent = currentUser.username;
    }
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', function () {
    checkAuth();
    updateActiveNavLink();
    updateUserHeader();
});

// Update active nav link based on current page
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Set up event listeners
window.addEventListener('load', function () {
    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        const nav = document.getElementById('headerNav');
        const toggle = document.querySelector('.menu-toggle');

        if (nav && toggle && !nav.contains(e.target) && !toggle.contains(e.target)) {
            nav.classList.remove('show');
        }
    });
});
