// ========================================
// AEGIS - Authentication Logic
// ========================================

// Redirect if already logged in (for login/register pages)
if (window.location.pathname.includes('login.html') ||
    window.location.pathname.includes('register.html')) {
    if (StorageManager.isLoggedIn()) {
        window.location.href = 'home.html';
    }
}

// ========================================
// Login Form Handler
// ========================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validate form
        const validation = Utils.validateForm(loginForm);
        if (!validation.isValid) {
            Utils.showToast('Por favor corrige los errores en el formulario', 'error');
            return;
        }

        // Attempt login
        const result = StorageManager.loginUser(email, password);

        if (result.success) {
            // Save remember me preference
            if (rememberMe) {
                localStorage.setItem('aegis_remember_email', email);
            } else {
                localStorage.removeItem('aegis_remember_email');
            }

            Utils.showToast('¡Bienvenido a AEGIS!', 'success');

            // Redirect to home
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            Utils.showToast(result.message || 'Credenciales incorrectas', 'error');
        }
    });

    // Load remembered email
    const rememberedEmail = localStorage.getItem('aegis_remember_email');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }
}

// ========================================
// Register Form Handler
// ========================================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const termsAccepted = document.getElementById('terms').checked;

        // Check if terms are accepted
        if (!termsAccepted) {
            Utils.showToast('Debes aceptar los términos y condiciones', 'warning');
            return;
        }

        // Validate form
        const validation = Utils.validateForm(registerForm);
        if (!validation.isValid) {
            Utils.showToast('Por favor corrige los errores en el formulario', 'error');
            return;
        }

        // Register user
        const result = StorageManager.registerUser({
            name: name,
            email: email,
            password: password
        });

        if (result.success) {
            Utils.showToast('¡Cuenta creada exitosamente!', 'success');

            // Auto-login after registration
            StorageManager.loginUser(email, password);

            // Redirect to home
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            Utils.showToast(result.message || 'Error al crear la cuenta', 'error');
        }
    });
}

// ========================================
// Password Recovery Form Handler
// ========================================
const recoveryForm = document.getElementById('recoveryForm');
if (recoveryForm) {
    recoveryForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();

        // Validate email
        if (!Utils.validateEmail(email)) {
            Utils.showFieldError(document.getElementById('email'), 'Email inválido');
            return;
        }

        // Check if user exists
        const users = StorageManager.getUsers();
        const userExists = users.some(u => u.email === email);

        if (userExists) {
            Utils.showToast('Correo de recuperación enviado. Revisa tu bandeja de entrada.', 'success', 5000);

            // Redirect back to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            Utils.showToast('No existe una cuenta con ese correo electrónico', 'error');
        }
    });
}

// ========================================
// Input validation on keyup
// ========================================
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', function () {
        Utils.clearFieldError(this);
    });
});
