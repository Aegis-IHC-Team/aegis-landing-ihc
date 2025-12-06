// ========================================
// AEGIS - Local Storage Manager
// ========================================

const StorageManager = {
    // Keys
    KEYS: {
        CURRENT_USER: 'aegis_current_user',
        USERS: 'aegis_users',
        SIMULATIONS: 'aegis_simulations',
        RESULTS: 'aegis_results'
    },

    // ========================================
    // User Management
    // ========================================

    // Save user registration
    registerUser(userData) {
        const users = this.getUsers();

        // Check if email already exists
        if (users.some(u => u.email === userData.email)) {
            return { success: false, message: 'El correo ya está registrado' };
        }

        const newUser = {
            id: this.generateId(),
            name: userData.name || '',
            lastName: userData.lastName || '',
            email: userData.email,
            password: userData.password, // In production, this should be hashed
            phone: userData.phone || '',
            birthDate: userData.birthDate || '',
            createdAt: new Date().toISOString(),
            avatar: userData.avatar || null
        };

        users.push(newUser);
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));

        return { success: true, user: newUser };
    },

    // Login user
    loginUser(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Save current session
            localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
            return { success: true, user };
        }

        return { success: false, message: 'Credenciales incorrectas' };
    },

    // Get current logged in user
    getCurrentUser() {
        const userStr = localStorage.getItem(this.KEYS.CURRENT_USER);
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is logged in
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    },

    // Logout user
    logout() {
        localStorage.removeItem(this.KEYS.CURRENT_USER);
    },

    // Get all users
    getUsers() {
        const usersStr = localStorage.getItem(this.KEYS.USERS);
        return usersStr ? JSON.parse(usersStr) : [];
    },

    // Update user profile
    updateUserProfile(userId, updates) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return { success: false, message: 'Usuario no encontrado' };
        }

        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));

        // Update current user session if it's the same user
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(users[userIndex]));
        }

        return { success: true, user: users[userIndex] };
    },

    // Change password
    changePassword(userId, oldPassword, newPassword) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return { success: false, message: 'Usuario no encontrado' };
        }

        if (user.password !== oldPassword) {
            return { success: false, message: 'Contraseña actual incorrecta' };
        }

        return this.updateUserProfile(userId, { password: newPassword });
    },

    // ========================================
    // Simulation Management
    // ========================================

    // Create new simulation
    createSimulation(simulationData) {
        const simulations = this.getSimulations();
        const currentUser = this.getCurrentUser();

        if (!currentUser) {
            return { success: false, message: 'Usuario no autenticado' };
        }

        const newSimulation = {
            id: this.generateId(),
            userId: currentUser.id,
            name: simulationData.name,
            template: simulationData.template,
            difficulty: simulationData.difficulty || 'medium',
            description: simulationData.description || '',
            participants: simulationData.participants || [],
            startDate: simulationData.startDate,
            startTime: simulationData.startTime,
            endDate: simulationData.endDate,
            endTime: simulationData.endTime,
            autoSendEmail: simulationData.autoSendEmail || false,
            status: 'scheduled', // scheduled, in-progress, completed
            progress: 0,
            createdAt: new Date().toISOString()
        };

        simulations.push(newSimulation);
        localStorage.setItem(this.KEYS.SIMULATIONS, JSON.stringify(simulations));

        return { success: true, simulation: newSimulation };
    },

    // Get all simulations for current user
    getSimulations(userId = null) {
        const simulationsStr = localStorage.getItem(this.KEYS.SIMULATIONS);
        const allSimulations = simulationsStr ? JSON.parse(simulationsStr) : [];

        if (userId) {
            return allSimulations.filter(s => s.userId === userId);
        }

        const currentUser = this.getCurrentUser();
        if (currentUser) {
            return allSimulations.filter(s => s.userId === currentUser.id);
        }

        return allSimulations;
    },

    // Get simulation by ID
    getSimulation(id) {
        const simulations = this.getSimulations();
        return simulations.find(s => s.id === id);
    },

    // Update simulation
    updateSimulation(id, updates) {
        const simulationsStr = localStorage.getItem(this.KEYS.SIMULATIONS);
        const simulations = simulationsStr ? JSON.parse(simulationsStr) : [];
        const index = simulations.findIndex(s => s.id === id);

        if (index === -1) {
            return { success: false, message: 'Simulación no encontrada' };
        }

        simulations[index] = { ...simulations[index], ...updates };
        localStorage.setItem(this.KEYS.SIMULATIONS, JSON.stringify(simulations));

        return { success: true, simulation: simulations[index] };
    },

    // Delete simulation
    deleteSimulation(id) {
        const simulationsStr = localStorage.getItem(this.KEYS.SIMULATIONS);
        const simulations = simulationsStr ? JSON.parse(simulationsStr) : [];
        const filtered = simulations.filter(s => s.id !== id);

        localStorage.setItem(this.KEYS.SIMULATIONS, JSON.stringify(filtered));

        return { success: true };
    },

    // ========================================
    // Results Management
    // ========================================

    // Save simulation result
    saveResult(resultData) {
        const results = this.getResults();
        const currentUser = this.getCurrentUser();

        if (!currentUser) {
            return { success: false, message: 'Usuario no autenticado' };
        }

        const newResult = {
            id: this.generateId(),
            userId: currentUser.id,
            simulationId: resultData.simulationId,
            correctAnswers: resultData.correctAnswers || 0,
            incorrectAnswers: resultData.incorrectAnswers || 0,
            totalQuestions: resultData.totalQuestions || 0,
            precision: resultData.precision || 0,
            totalTime: resultData.totalTime || 0,
            timePerQuestion: resultData.timePerQuestion || 0,
            points: resultData.points || 0,
            categories: resultData.categories || {},
            detectedSignals: resultData.detectedSignals || {},
            answers: resultData.answers || [],
            completedAt: new Date().toISOString()
        };

        results.push(newResult);
        localStorage.setItem(this.KEYS.RESULTS, JSON.stringify(results));

        // Update simulation progress
        this.updateSimulation(resultData.simulationId, {
            status: 'completed',
            progress: 100
        });

        return { success: true, result: newResult };
    },

    // Get all results for current user
    getResults(userId = null) {
        const resultsStr = localStorage.getItem(this.KEYS.RESULTS);
        const allResults = resultsStr ? JSON.parse(resultsStr) : [];

        if (userId) {
            return allResults.filter(r => r.userId === userId);
        }

        const currentUser = this.getCurrentUser();
        if (currentUser) {
            return allResults.filter(r => r.userId === currentUser.id);
        }

        return allResults;
    },

    // Get result by ID
    getResult(id) {
        const results = this.getResults();
        return results.find(r => r.id === id);
    },

    // Get results for a specific simulation
    getResultsBySimulation(simulationId) {
        const results = this.getResults();
        return results.filter(r => r.simulationId === simulationId);
    },

    // ========================================
    // Utility Functions
    // ========================================

    // Generate unique ID
    generateId() {
        return 'aegis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Clear all data (for testing)
    clearAll() {
        localStorage.removeItem(this.KEYS.CURRENT_USER);
        localStorage.removeItem(this.KEYS.USERS);
        localStorage.removeItem(this.KEYS.SIMULATIONS);
        localStorage.removeItem(this.KEYS.RESULTS);
    },

    // Export data
    exportData() {
        return {
            users: this.getUsers(),
            simulations: this.getSimulations(),
            results: this.getResults()
        };
    },

    // Get statistics for dashboard
    getStatistics() {
        const simulations = this.getSimulations();
        const results = this.getResults();

        const totalSimulations = simulations.length;
        const completedSimulations = simulations.filter(s => s.status === 'completed').length;
        const inProgressSimulations = simulations.filter(s => s.status === 'in-progress').length;

        let totalTime = 0;
        let totalPrecision = 0;
        let totalPoints = 0;

        results.forEach(r => {
            totalTime += r.totalTime || 0;
            totalPrecision += r.precision || 0;
            totalPoints += r.points || 0;
        });

        const avgPrecision = results.length > 0 ? Math.round(totalPrecision / results.length) : 0;
        const avgPoints = results.length > 0 ? Math.round(totalPoints / results.length) : 0;

        return {
            totalSimulations,
            completedSimulations,
            inProgressSimulations,
            totalTime,
            avgPrecision,
            avgPoints,
            totalResults: results.length
        };
    }
};

// Make it globally available
window.StorageManager = StorageManager;
