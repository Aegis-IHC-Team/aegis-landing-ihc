// ========================================
// AEGIS - Profile Manager
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    // Check authentication
    if (!Utils.redirectIfNotLoggedIn()) {
        return;
    }

    loadProfileData();
    setupAvatarUpload();
});

// Load current user profile data
function loadProfileData() {
    const currentUser = StorageManager.getCurrentUser();

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Set form values
    document.getElementById('firstName').value = currentUser.name || '';
    document.getElementById('lastName').value = currentUser.lastName || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('birthDate').value = currentUser.birthDate || '';
    document.getElementById('phone').value = currentUser.phone || '';

    // Set display values
    document.getElementById('profileName').textContent =
        currentUser.name ? `${currentUser.name} ${currentUser.lastName || ''}`.trim() : 'Usuario';
    document.getElementById('profileEmail').textContent = currentUser.email;

    // Set header values
    document.getElementById('headerUserName').textContent = currentUser.name || 'Usuario';

    // Set avatars
    if (currentUser.avatar) {
        document.getElementById('profileAvatar').src = currentUser.avatar;
        document.getElementById('headerAvatar').src = currentUser.avatar;
    }
}

// Setup avatar upload
function setupAvatarUpload() {
    const avatarInput = document.getElementById('avatarInput');

    avatarInput.addEventListener('change', function (e) {
        const file = e.target.files[0];

        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                Utils.showToast('La imagen debe ser menor a 2MB', 'error');
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                Utils.showToast('Por favor selecciona una imagen válida', 'error');
                return;
            }

            // Read file as base64
            const reader = new FileReader();

            reader.onload = function (event) {
                const avatarUrl = event.target.result;

                // Update avatar preview
                document.getElementById('profileAvatar').src = avatarUrl;
                document.getElementById('headerAvatar').src = avatarUrl;

                // Save to user profile
                const currentUser = StorageManager.getCurrentUser();
                StorageManager.updateUserProfile(currentUser.id, { avatar: avatarUrl });

                Utils.showToast('Foto de perfil actualizada', 'success');
            };

            reader.readAsDataURL(file);
        }
    });
}

// Handle profile form submission
const profileForm = document.getElementById('profileForm');

if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const currentUser = StorageManager.getCurrentUser();

        if (!currentUser) {
            Utils.showToast('Error: Usuario no encontrado', 'error');
            return;
        }

        // Get form values
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const birthDate = document.getElementById('birthDate').value;
        const phone = document.getElementById('phone').value.trim();

        // Validate
        if (!firstName) {
            Utils.showFieldError(document.getElementById('firstName'), 'El nombre es requerido');
            return;
        }

        // Prepare update data
        const updateData = {
            name: firstName,
            lastName: lastName,
            birthDate: birthDate,
            phone: phone
        };

        // Check if password change is requested
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (currentPassword || newPassword || confirmPassword) {
            // Validate password change
            if (!currentPassword) {
                Utils.showFieldError(document.getElementById('currentPassword'), 'Ingresa tu contraseña actual');
                return;
            }

            if (!newPassword) {
                Utils.showFieldError(document.getElementById('newPassword'), 'Ingresa una nueva contraseña');
                return;
            }

            if (newPassword !== confirmPassword) {
                Utils.showFieldError(document.getElementById('confirmPassword'), 'Las contraseñas no coinciden');
                return;
            }

            if (!Utils.validatePassword(newPassword)) {
                Utils.showFieldError(document.getElementById('newPassword'), 'Mínimo 6 caracteres');
                return;
            }

            // Attempt password change
            const passwordResult = StorageManager.changePassword(
                currentUser.id,
                currentPassword,
                newPassword
            );

            if (!passwordResult.success) {
                Utils.showToast(passwordResult.message || 'Error al cambiar contraseña', 'error');
                return;
            }

            // Clear password fields
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';

            Utils.showToast('Contraseña actualizada exitosamente', 'success');
        }

        // Update profile
        const result = StorageManager.updateUserProfile(currentUser.id, updateData);

        if (result.success) {
            Utils.showToast('Perfil actualizado exitosamente', 'success');

            // Update display
            loadProfileData();
        } else {
            Utils.showToast(result.message || 'Error al actualizar perfil', 'error');
        }
    });
}

// Clear field errors on input
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', function () {
        Utils.clearFieldError(this);
    });
});
