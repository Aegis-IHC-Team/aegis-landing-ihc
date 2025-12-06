// ==========  AEGIS - Utility Functions ==========

const Utils = {
    // ========== Validation Functions ==========

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },

    validatePassword(password) {
        return password && password.length >= 6;
    },

    validatePhone(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return phone.length >= 7 && re.test(phone);
    },

    validateRequired(value) {
        return value && value.trim().length > 0;
    },

    // ========== Form Validation ==========

    validateForm(formElement) {
        const inputs = formElement.querySelectorAll('[required]');
        let isValid = true;
        const errors = [];

        inputs.forEach(input => {
            const value = input.value.trim();
            const name = input.name || input.id;

            this.clearFieldError(input);

            if (!this.validateRequired(value)) {
                this.showFieldError(input, 'Este campo es requerido');
                isValid = false;
                errors.push({ field: name, message: 'Required' });
                return;
            }

            if (input.type === 'email') {
                if (!this.validateEmail(value)) {
                    this.showFieldError(input, 'Email inválido');
                    isValid = false;
                    errors.push({ field: name, message: 'Invalid email' });
                }
            }

            if (input.type === 'password') {
                if (!this.validatePassword(value)) {
                    this.showFieldError(input, 'Mínimo 6 caracteres');
                    isValid = false;
                    errors.push({ field: name, message: 'Password too short' });
                }
            }

            if (input.type === 'tel') {
                if (!this.validatePhone(value)) {
                    this.showFieldError(input, 'Teléfono inválido');
                    isValid = false;
                    errors.push({ field: name, message: 'Invalid phone' });
                }
            }
        });

        return { isValid, errors };
    },

    showFieldError(input, message) {
        input.classList.add('error');
        input.style.borderColor = '#E53935';

        const existingError = input.parentElement.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        input.parentElement.appendChild(errorElement);
    },

    clearFieldError(input) {
        input.classList.remove('error');
        input.style.borderColor = '';

        const errorElement = input.parentElement.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    },

    // ========== Toast Notifications ==========

    showToast(message, type = 'info', duration = 3000) {
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fade-in`;

        const icon = this.getToastIcon(type);

        toast.innerHTML = `
      <i class="${icon}"></i>
      <span>${message}</span>
    `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    getToastIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        };
        return icons[type] || icons.info;
    },

    // ========== Date & Time Formatting ==========

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatTime(seconds) {
        if (!seconds || seconds < 0) return '0:00';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },

    formatDateTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    getRelativeTime(dateString) {
        if (!dateString) return '';

        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Justo ahora';
        if (diffMins < 60) return `Hace ${diffMins} minutos`;
        if (diffHours < 24) return `Hace ${diffHours} horas`;
        if (diffDays < 7) return `Hace ${diffDays} días`;

        return this.formatDate(dateString);
    },

    // ========== Page Navigation ==========

    navigateTo(path) {
        if (path.startsWith('http')) {
            window.location.href = path;
        } else {
            window.location.href = path;
        }
    },

    redirectIfNotLoggedIn() {
        if (!StorageManager.isLoggedIn()) {
            this.navigateTo('login.html');
            return false;
        }
        return true;
    },

    redirectIfLoggedIn() {
        if (StorageManager.isLoggedIn()) {
            this.navigateTo('home.html');
            return false;
        }
        return true;
    },

    // ========== Data Formatting ==========

    formatPercentage(value, total) {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    },

    truncateText(text, maxLength = 100) {
        if (!text || text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    },

    capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // ========== DOM Utilities ==========

    createElement(tag, className, innerHTML) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },

    showElement(element) {
        if (element) element.style.display = 'block';
    },

    hideElement(element) {
        if (element) element.style.display = 'none';
    },

    toggleElement(element) {
        if (!element) return;
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    },

    // ========== Loading States ==========

    showLoading(button) {
        if (!button) return;

        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<div class="spinner"></div>';
    },

    hideLoading(button) {
        if (!button) return;

        button.disabled = false;
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
        }
    },

    // ========== Random Data Generators ==========

    getRandomColor() {
        const colors = ['#102441', '#2371D7', '#1BC467', '#1CB9B9'];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    getRandomAvatar() {
        const avatars = [
            'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
            'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
            'https://api.dicebear.com/7.x/avataaars/svg?seed=3'
        ];
        return avatars[Math.floor(Math.random() * avatars.length)];
    },

    // ========== Local Storage Helpers ==========

    saveToLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },

    getFromLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },

    // ========== Debounce Function ==========

    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // ========== Animation Helpers ==========

    animateNumber(element, start, end, duration = 1000) {
        if (!element) return;

        const range = end - start;
        const startTime = Date.now();

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (range * progress));

            element.textContent = current;

            if (progress === 1) {
                clearInterval(timer);
            }
        }, 16);
    },

    animateProgress(element, end, duration = 1000) {
        if (!element) return;

        const startTime = Date.now();

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(end * progress);

            element.style.width = current + '%';

            if (progress === 1) {
                clearInterval(timer);
            }
        }, 16);
    }
};

window.Utils = Utils;
