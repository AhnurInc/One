// Authentication Module for Ahnur Sistema
// Using global Firebase from CDN

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.auth = null;
        this.signInWithEmailAndPassword = null;
        this.onAuthStateChanged = null;
        this.signOut = null;
        this.initializeWhenReady();
    }

    // Initialize when Firebase is ready
    async initializeWhenReady() {
        // Wait for Firebase to be available
        while (!window.firebaseAuth) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Import Firebase auth functions dynamically
        const { signInWithEmailAndPassword, onAuthStateChanged, signOut } = await import('https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js');
        
        this.auth = window.firebaseAuth;
        this.signInWithEmailAndPassword = signInWithEmailAndPassword;
        this.onAuthStateChanged = onAuthStateChanged;
        this.signOut = signOut;
        
        this.initializeAuthStateListener();
    }

    // Initialize authentication state listener
    initializeAuthStateListener() {
        this.onAuthStateChanged(this.auth, (user) => {
            this.currentUser = user;
            this.handleAuthStateChange(user);
        });
    }

    // Handle authentication state changes
    handleAuthStateChange(user) {
        const currentPage = window.location.pathname;
        
        if (user) {
            // User is signed in
            console.log('User signed in:', user.email);
            
            // Redirect to dashboard if on login page
            if (currentPage.includes('index.html') || currentPage === '/') {
                window.location.href = 'dashboard.html';
            }
        } else {
            // User is signed out
            console.log('User signed out');
            
            // Redirect to login if on dashboard page
            if (currentPage.includes('dashboard.html')) {
                window.location.href = 'index.html';
            }
        }
    }

    // Sign in with email and password
    async signIn(email, password) {
        try {
            this.showLoading(true);
            this.clearMessages();

            // Validate inputs
            if (!this.validateEmail(email)) {
                throw new Error('Por favor, insira um email válido.');
            }

            if (!password || password.length < 6) {
                throw new Error('A senha deve ter pelo menos 6 caracteres.');
            }

            const userCredential = await this.signInWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            
            this.showMessage('Login realizado com sucesso!', 'success');
            console.log('User signed in successfully:', user.email);
            
            // Redirect will be handled by auth state listener
            return user;

        } catch (error) {
            console.error('Sign in error:', error);
            this.handleAuthError(error);
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    // Sign out
    async signOutUser() {
        try {
            await this.signOut(this.auth);
            console.log('User signed out successfully');
            // Redirect will be handled by auth state listener
        } catch (error) {
            console.error('Sign out error:', error);
            this.showMessage('Erro ao fazer logout. Tente novamente.', 'error');
        }
    }

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Handle authentication errors
    handleAuthError(error) {
        let message = 'Erro desconhecido. Tente novamente.';

        switch (error.code) {
            case 'auth/user-not-found':
                message = 'Usuário não encontrado. Verifique o email.';
                break;
            case 'auth/wrong-password':
                message = 'Senha incorreta. Tente novamente.';
                break;
            case 'auth/invalid-email':
                message = 'Email inválido. Verifique o formato.';
                break;
            case 'auth/user-disabled':
                message = 'Esta conta foi desabilitada.';
                break;
            case 'auth/too-many-requests':
                message = 'Muitas tentativas. Tente novamente mais tarde.';
                break;
            case 'auth/network-request-failed':
                message = 'Erro de conexão. Verifique sua internet.';
                break;
            default:
                message = error.message || message;
        }

        this.showMessage(message, 'error');
    }

    // Show loading state
    showLoading(isLoading) {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            if (isLoading) {
                loginBtn.classList.add('loading');
                loginBtn.disabled = true;
            } else {
                loginBtn.classList.remove('loading');
                loginBtn.disabled = false;
            }
        }
    }

    // Show message to user
    showMessage(message, type = 'error') {
        const alertDiv = document.getElementById('alertMessage');
        if (alertDiv) {
            alertDiv.textContent = message;
            alertDiv.className = `alert alert-${type}`;
            alertDiv.classList.remove('hidden');

            // Auto-hide success messages after 3 seconds
            if (type === 'success') {
                setTimeout(() => {
                    this.clearMessages();
                }, 3000);
            }
        }
    }

    // Clear messages
    clearMessages() {
        const alertDiv = document.getElementById('alertMessage');
        if (alertDiv) {
            alertDiv.classList.add('hidden');
            alertDiv.textContent = '';
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }
}

// Export the auth manager instance
export const authManager = new AuthManager();