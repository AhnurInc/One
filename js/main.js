// Main Application Logic for Ahnur Sistema
// Using global Firebase from CDN

class AhnurApp {
    constructor() {
        this.authManager = null;
        this.init();
    }

    // Initialize the application
    async init() {
        // Wait for auth manager to be ready
        const { authManager } = await import('./auth.js');
        this.authManager = authManager;
        
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeCurrentPage();
        });
        
        // If DOM is already loaded
        if (document.readyState === 'loading') {
            // Loading hasn't finished yet
        } else {
            // DOM has already loaded
            this.initializeCurrentPage();
        }
    }

    // Initialize based on current page
    initializeCurrentPage() {
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('index.html') || currentPage === '/' || currentPage === '') {
            this.initializeLoginPage();
        } else if (currentPage.includes('dashboard.html')) {
            this.initializeDashboardPage();
        }
    }

    // Initialize login page
    initializeLoginPage() {
        console.log('Initializing login page...');
        
        const loginForm = document.getElementById('loginForm');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (loginForm) {
            // Add form submit event listener
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            
            // Add input event listeners for real-time validation
            if (emailInput) {
                emailInput.addEventListener('blur', () => this.validateEmailField());
                emailInput.addEventListener('input', () => this.clearFieldError('email'));
            }
            
            if (passwordInput) {
                passwordInput.addEventListener('input', () => this.clearFieldError('password'));
            }
            
            // Add Enter key support
            [emailInput, passwordInput].forEach(input => {
                if (input) {
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            loginForm.requestSubmit();
                        }
                    });
                }
            });
        }

        // Add fade-in animation
        document.body.classList.add('fade-in');
    }

    // Initialize dashboard page
    initializeDashboardPage() {
        console.log('Initializing dashboard page...');
        
        const logoutBtn = document.getElementById('logoutBtn');
        const userEmailSpan = document.getElementById('userEmail');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        // Display user email if available
        if (userEmailSpan && this.authManager.getCurrentUser()) {
            userEmailSpan.textContent = this.authManager.getCurrentUser().email;
        }

        // Add fade-in animation
        document.body.classList.add('fade-in');
    }

    // Handle login form submission
    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Client-side validation
        if (!this.validateLoginForm(email, password)) {
            return;
        }
        
        try {
            await this.authManager.signIn(email, password);
            // Redirect will be handled by auth state listener
        } catch (error) {
            // Error handling is done in AuthManager
            console.error('Login failed:', error);
        }
    }

    // Handle logout
    async handleLogout() {
        if (confirm('Tem certeza que deseja sair?')) {
            await this.authManager.signOutUser();
        }
    }

    // Validate login form
    validateLoginForm(email, password) {
        let isValid = true;
        
        // Validate email
        if (!email) {
            this.showFieldError('email', 'Email é obrigatório');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showFieldError('email', 'Email inválido');
            isValid = false;
        }
        
        // Validate password
        if (!password) {
            this.showFieldError('password', 'Senha é obrigatória');
            isValid = false;
        } else if (password.length < 6) {
            this.showFieldError('password', 'Senha deve ter pelo menos 6 caracteres');
            isValid = false;
        }
        
        return isValid;
    }

    // Validate email field on blur
    validateEmailField() {
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();
        
        if (email && !this.isValidEmail(email)) {
            this.showFieldError('email', 'Email inválido');
        } else {
            this.clearFieldError('email');
        }
    }

    // Check if email is valid
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show field error
    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.add('error');
            
            // Remove existing error message
            const existingError = field.parentNode.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }
            
            // Add new error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            errorDiv.style.color = '#f44336';
            errorDiv.style.fontSize = '0.75rem';
            errorDiv.style.marginTop = '0.25rem';
            
            field.parentNode.appendChild(errorDiv);
        }
    }

    // Clear field error
    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.remove('error');
            
            const errorDiv = field.parentNode.querySelector('.field-error');
            if (errorDiv) {
                errorDiv.remove();
            }
        }
    }

    // Utility method to format dates
    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    // Utility method to show notifications
    showNotification(message, type = 'info', duration = 3000) {
        // This could be expanded to show toast notifications
        console.log(`Notification (${type}):`, message);
    }
}

// Initialize the application
const app = new AhnurApp();

// Export for potential external use
export default app;