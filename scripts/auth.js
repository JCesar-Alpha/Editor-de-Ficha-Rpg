// Sistema de autenticação
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.userType = null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkExistingSession();
        this.createPasswordStrengthIndicator();
        this.createPasswordMatchIndicator();
    }

    bindEvents() {
        // Login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Registro
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Links entre login e registro
        const registerLink = document.getElementById('register-link');
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterScreen();
            });
        }

        const loginLink = document.getElementById('login-link');
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginScreen();
            });
        }

        // Logout
        const playerLogout = document.getElementById('player-logout');
        if (playerLogout) {
            playerLogout.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        const masterLogout = document.getElementById('master-logout');
        if (masterLogout) {
            masterLogout.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Validação de senha em tempo real
        const regPassword = document.getElementById('reg-password');
        if (regPassword) {
            regPassword.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }

        const regConfirm = document.getElementById('reg-confirm-password');
        if (regConfirm) {
            regConfirm.addEventListener('input', (e) => {
                this.checkPasswordMatch();
            });
        }

        // Validação de username em tempo real
        const regUsername = document.getElementById('reg-username');
        if (regUsername) {
            regUsername.addEventListener('input', (e) => {
                this.validateUsername(e.target.value);
            });
        }

        // Validação de email em tempo real
        const regEmail = document.getElementById('reg-email');
        if (regEmail) {
            regEmail.addEventListener('input', (e) => {
                this.validateEmail(e.target.value);
            });
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const userType = document.getElementById('user-type').value;

        // Validar campos
        if (!username || !password || !userType) {
            this.showMessage('Por favor, preencha todos os campos.', 'error');
            return;
        }

        // Buscar usuário
        const user = this.users.find(u => 
            u.username === username && 
            u.password === this.hashPassword(password) &&
            u.userType === userType
        );

        if (user) {
            this.currentUser = username;
            this.userType = userType;
            
            // Salvar sessão
            localStorage.setItem('currentUser', username);
            localStorage.setItem('userType', userType);
            
            this.showUserScreen();
            this.showMessage(`Bem-vindo de volta, ${username}!`, 'success');
        } else {
            this.showMessage('Usuário, senha ou tipo de conta incorretos.', 'error');
        }
    }

    handleRegister() {
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        const userType = document.getElementById('reg-user-type').value;
        const terms = document.getElementById('reg-terms').checked;

        // Validar campos
        if (!this.validateRegisterForm(username, email, password, confirmPassword, userType, terms)) {
            return;
        }

        // Verificar se usuário já existe
        if (this.users.find(u => u.username === username)) {
            this.showMessage('Nome de usuário já está em uso.', 'error');
            return;
        }

        if (this.users.find(u => u.email === email)) {
            this.showMessage('E-mail já está cadastrado.', 'error');
            return;
        }

        // Criar novo usuário
        const newUser = {
            id: Date.now(),
            username: username,
            email: email,
            password: this.hashPassword(password),
            userType: userType,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            profile: {
                avatar: null,
                bio: '',
                favoriteSystems: [],
                experience: 0,
                level: 1
            },
            preferences: {
                theme: 'light',
                notifications: true,
                language: 'pt-BR'
            },
            stats: {
                sessionsPlayed: 0,
                sessionsMastered: 0,
                charactersCreated: 0,
                campaignsCreated: 0
            }
        };

        this.users.push(newUser);
        this.saveUsers();

        // Limpar formulário
        document.getElementById('register-form').reset();

        // Mostrar mensagem de sucesso e voltar para login
        this.showMessage('Conta criada com sucesso! Faça login para continuar.', 'success');
        setTimeout(() => {
            this.showLoginScreen();
        }, 2000);
    }

    validateRegisterForm(username, email, password, confirmPassword, userType, terms) {
        // Validar username
        if (username.length < 3) {
            this.showMessage('Nome de usuário deve ter pelo menos 3 caracteres.', 'error');
            return false;
        }

        if (username.length > 20) {
            this.showMessage('Nome de usuário deve ter no máximo 20 caracteres.', 'error');
            return false;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            this.showMessage('Nome de usuário só pode conter letras, números e underline.', 'error');
            return false;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showMessage('Por favor, insira um e-mail válido.', 'error');
            return false;
        }

        // Validar senha
        if (password.length < 6) {
            this.showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
            return false;
        }

        if (password !== confirmPassword) {
            this.showMessage('As senhas não coincidem.', 'error');
            return false;
        }

        // Validar tipo de usuário
        if (!userType) {
            this.showMessage('Por favor, selecione um tipo de usuário.', 'error');
            return false;
        }

        // Validar termos
        if (!terms) {
            this.showMessage('Você deve aceitar os termos de uso.', 'error');
            return false;
        }

        return true;
    }

    validateUsername(username) {
        const messageElement = document.getElementById('username-validation-message');
        
        if (!messageElement) {
            this.createUsernameValidationIndicator();
            return;
        }

        if (username.length === 0) {
            messageElement.style.display = 'none';
            return;
        }

        messageElement.style.display = 'block';

        if (username.length < 3) {
            messageElement.textContent = 'Muito curto (mín. 3 caracteres)';
            messageElement.className = 'validation-message validation-error';
        } else if (username.length > 20) {
            messageElement.textContent = 'Muito longo (máx. 20 caracteres)';
            messageElement.className = 'validation-message validation-error';
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            messageElement.textContent = 'Use apenas letras, números e _';
            messageElement.className = 'validation-message validation-error';
        } else if (this.users.find(u => u.username === username)) {
            messageElement.textContent = 'Nome de usuário indisponível';
            messageElement.className = 'validation-message validation-error';
        } else {
            messageElement.textContent = 'Nome de usuário disponível';
            messageElement.className = 'validation-message validation-success';
        }
    }

    validateEmail(email) {
        const messageElement = document.getElementById('email-validation-message');
        
        if (!messageElement) {
            this.createEmailValidationIndicator();
            return;
        }

        if (email.length === 0) {
            messageElement.style.display = 'none';
            return;
        }

        messageElement.style.display = 'block';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            messageElement.textContent = 'Formato de e-mail inválido';
            messageElement.className = 'validation-message validation-error';
        } else if (this.users.find(u => u.email === email)) {
            messageElement.textContent = 'E-mail já cadastrado';
            messageElement.className = 'validation-message validation-error';
        } else {
            messageElement.textContent = 'E-mail válido';
            messageElement.className = 'validation-message validation-success';
        }
    }

    createUsernameValidationIndicator() {
        const usernameField = document.getElementById('reg-username');
        const formGroup = usernameField.parentElement;

        const messageElement = document.createElement('div');
        messageElement.id = 'username-validation-message';
        messageElement.className = 'validation-message';
        messageElement.style.display = 'none';

        formGroup.appendChild(messageElement);
    }

    createEmailValidationIndicator() {
        const emailField = document.getElementById('reg-email');
        const formGroup = emailField.parentElement;

        const messageElement = document.createElement('div');
        messageElement.id = 'email-validation-message';
        messageElement.className = 'validation-message';
        messageElement.style.display = 'none';

        formGroup.appendChild(messageElement);
    }

    checkPasswordStrength(password) {
        const strengthBar = document.getElementById('password-strength-bar');
        const strengthText = document.getElementById('password-feedback');

        if (!strengthBar) {
            this.createPasswordStrengthIndicator();
            return;
        }

        let strength = 0;
        let feedback = '';

        // Critérios de força
        if (password.length >= 6) strength += 1;
        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        // Atualizar barra de força
        strengthBar.className = 'password-strength';
        if (password.length === 0) {
            strengthBar.style.display = 'none';
            strengthText.textContent = '';
        } else {
            strengthBar.style.display = 'block';
            if (strength <= 2) {
                strengthBar.classList.add('strength-weak');
                feedback = 'Senha fraca';
            } else if (strength <= 3) {
                strengthBar.classList.add('strength-medium');
                feedback = 'Senha média';
            } else if (strength <= 4) {
                strengthBar.classList.add('strength-strong');
                feedback = 'Senha forte';
            } else {
                strengthBar.classList.add('strength-very-strong');
                feedback = 'Senha muito forte';
            }
            strengthText.textContent = feedback;
        }
    }

    createPasswordStrengthIndicator() {
        const passwordField = document.getElementById('reg-password');
        const formGroup = passwordField.parentElement;

        // Criar elementos de feedback
        const strengthBar = document.createElement('div');
        strengthBar.id = 'password-strength-bar';
        strengthBar.className = 'password-strength';
        strengthBar.style.display = 'none';

        const strengthText = document.createElement('div');
        strengthText.id = 'password-feedback';
        strengthText.className = 'password-feedback';

        formGroup.appendChild(strengthBar);
        formGroup.appendChild(strengthText);
    }

    checkPasswordMatch() {
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        const messageElement = document.getElementById('password-match-message');

        if (!messageElement) {
            this.createPasswordMatchIndicator();
            return;
        }

        if (confirmPassword.length === 0) {
            messageElement.style.display = 'none';
            return;
        }

        messageElement.style.display = 'block';
        if (password === confirmPassword) {
            messageElement.textContent = 'Senhas coincidem';
            messageElement.className = 'validation-message validation-success';
        } else {
            messageElement.textContent = 'Senhas não coincidem';
            messageElement.className = 'validation-message validation-error';
        }
    }

    createPasswordMatchIndicator() {
        const confirmField = document.getElementById('reg-confirm-password');
        const formGroup = confirmField.parentElement;

        const messageElement = document.createElement('div');
        messageElement.id = 'password-match-message';
        messageElement.className = 'validation-message';
        messageElement.style.display = 'none';

        formGroup.appendChild(messageElement);
    }

    hashPassword(password) {
        // Em uma aplicação real, isso seria feito no backend com bcrypt
        // Aqui é apenas uma simulação básica para demonstração
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }

    showMessage(message, type) {
        // Remover mensagens anteriores
        const existingMessages = document.querySelectorAll('.auth-message');
        existingMessages.forEach(msg => msg.remove());

        // Criar nova mensagem
        const messageElement = document.createElement('div');
        messageElement.className = `auth-message alert alert-${type}`;
        messageElement.textContent = message;

        // Adicionar ao formulário atual
        const currentScreen = document.querySelector('.screen.active');
        if (currentScreen) {
            const form = currentScreen.querySelector('form');
            if (form) {
                form.insertBefore(messageElement, form.firstChild);
            } else {
                // fallback: adicionar ao container da tela
                currentScreen.insertBefore(messageElement, currentScreen.firstChild);
            }
        } else {
            // fallback geral: anexar ao body
            document.body.insertBefore(messageElement, document.body.firstChild);
        }

        // Auto-remover após 5 segundos para mensagens de sucesso
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }
    }

    showRegisterScreen() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        const regScreen = document.getElementById('register-screen');
        if (regScreen) {
            regScreen.classList.add('active');
        } else {
            console.warn('register-screen element not found');
        }
        
        // Limpar mensagens
        this.clearValidationMessages();
    }

    showLoginScreen() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        const loginScreen = document.getElementById('login-screen');
        if (loginScreen) {
            loginScreen.classList.add('active');
        } else {
            console.warn('login-screen element not found');
        }
        
        // Limpar mensagens
        this.clearValidationMessages();
    }

    clearValidationMessages() {
        const validationMessages = document.querySelectorAll('.validation-message');
        validationMessages.forEach(msg => {
            msg.style.display = 'none';
        });
        
        const strengthBar = document.getElementById('password-strength-bar');
        if (strengthBar) {
            strengthBar.style.display = 'none';
        }
        
        const feedback = document.getElementById('password-feedback');
        if (feedback) {
            feedback.textContent = '';
        }
    }

    handleLogout() {
        // Atualizar último login antes de sair
        if (this.currentUser) {
            const user = this.users.find(u => u.username === this.currentUser);
            if (user) {
                user.lastLogin = new Date().toISOString();
                this.saveUsers();
            }
        }

        this.currentUser = null;
        this.userType = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userType');
        
        this.showLoginScreen();
        this.showMessage('Logout realizado com sucesso.', 'success');
    }

    checkExistingSession() {
        const savedUser = localStorage.getItem('currentUser');
        const savedType = localStorage.getItem('userType');
        
        if (savedUser && savedType) {
            this.currentUser = savedUser;
            this.userType = savedType;
            
            // Atualizar último login
            const user = this.users.find(u => u.username === savedUser);
            if (user) {
                user.lastLogin = new Date().toISOString();
                this.saveUsers();
            }
            
            this.showUserScreen();
        }
    }

    showUserScreen() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        if (this.userType === 'player') {
            const playerScreen = document.getElementById('player-screen');
            if (playerScreen) playerScreen.classList.add('active');

            const playerUsername = document.getElementById('player-username');
            if (playerUsername) playerUsername.textContent = this.currentUser;
            
            // Atualizar estatísticas
            this.updateUserStats();
        } else if (this.userType === 'master') {
            const masterScreen = document.getElementById('master-screen');
            if (masterScreen) masterScreen.classList.add('active');

            const masterUsername = document.getElementById('master-username');
            if (masterUsername) masterUsername.textContent = this.currentUser;
            
            // Atualizar estatísticas
            this.updateUserStats();
        }
    }

    updateUserStats() {
        const user = this.getCurrentUser();
        if (user) {
            // Aqui você pode atualizar estatísticas na interface
            // Por exemplo: número de sessões, personagens, etc.
            console.log('Estatísticas do usuário:', user.stats);
        }
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    // Métodos adicionais para gerenciamento de usuários
    getCurrentUser() {
        return this.users.find(u => u.username === this.currentUser);
    }

    getUserProfile(username) {
        const user = this.users.find(u => u.username === username);
        return user ? user.profile : null;
    }

    updateUserProfile(username, updates) {
        const user = this.users.find(u => u.username === username);
        if (user) {
            user.profile = { ...user.profile, ...updates };
            this.saveUsers();
            return true;
        }
        return false;
    }

    updateUserPreferences(username, updates) {
        const user = this.users.find(u => u.username === username);
        if (user) {
            user.preferences = { ...user.preferences, ...updates };
            this.saveUsers();
            return true;
        }
        return false;
    }

    updateUserStats(username, updates) {
        const user = this.users.find(u => u.username === username);
        if (user) {
            user.stats = { ...user.stats, ...updates };
            this.saveUsers();
            return true;
        }
        return false;
    }

    changePassword(username, currentPassword, newPassword) {
        const user = this.users.find(u => u.username === username);
        if (user && user.password === this.hashPassword(currentPassword)) {
            user.password = this.hashPassword(newPassword);
            this.saveUsers();
            return true;
        }
        return false;
    }

    deleteAccount(username, password) {
        const user = this.users.find(u => u.username === username);
        if (user && user.password === this.hashPassword(password)) {
            this.users = this.users.filter(u => u.username !== username);
            this.saveUsers();
            
            if (this.currentUser === username) {
                this.handleLogout();
            }
            
            return true;
        }
        return false;
    }

    // Métodos para busca e filtro de usuários
    searchUsers(query) {
        return this.users.filter(user => 
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
    }

    getUsersByType(userType) {
        return this.users.filter(user => user.userType === userType);
    }

    getRecentUsers(limit = 10) {
        return this.users
            .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))
            .slice(0, limit);
    }

    // Métodos para estatísticas do sistema
    getSystemStats() {
        const totalUsers = this.users.length;
        const players = this.getUsersByType('player').length;
        const masters = this.getUsersByType('master').length;
        
        return {
            totalUsers,
            players,
            masters,
            playerMasterRatio: masters > 0 ? (players / masters).toFixed(2) : 'N/A'
        };
    }
}

// Inicializar sistema de autenticação
const authSystem = new AuthSystem();

// Exportar para uso global (se necessário)
window.authSystem = authSystem;