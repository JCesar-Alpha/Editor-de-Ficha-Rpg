// Gerenciador de Termos de Uso e Política de Privacidade
class TermsManager {
    constructor() {
        this.termsAccepted = JSON.parse(localStorage.getItem('termsAccepted')) || {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.createTermsModal();
        this.checkTermsAcceptance();
    }

    bindEvents() {
        // Links de termos e privacidade
        const termsLink = document.getElementById('terms-link');
        const privacyLink = document.getElementById('privacy-link');
        
        if (termsLink) {
            termsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showTermsModal('terms');
            });
        }

        if (privacyLink) {
            privacyLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showTermsModal('privacy');
            });
        }

        // Aceitar termos via checkbox
        const termsCheckbox = document.getElementById('reg-terms');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', (e) => {
                this.handleTermsCheckbox(e.target.checked);
            });
        }
    }

    createTermsModal() {
        // Criar modal de termos se não existir
        if (!document.getElementById('terms-modal')) {
            const modal = document.createElement('div');
            modal.id = 'terms-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content terms-modal">
                    <div class="modal-header">
                        <h3 id="terms-modal-title">Termos de Uso</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="terms-tabs">
                            <button class="tab-terms active" data-tab="terms">Termos de Uso</button>
                            <button class="tab-terms" data-tab="privacy">Política de Privacidade</button>
                        </div>
                        
                        <div class="terms-content" id="terms-content">
                            <!-- Conteúdo será carregado dinamicamente -->
                        </div>
                        
                        <div class="terms-acceptance" id="terms-acceptance">
                            <label class="checkbox-label">
                                <input type="checkbox" id="modal-accept-terms">
                                Eu li e concordo com os <span id="current-document">Termos de Uso</span>
                            </label>
                        </div>
                        
                        <div class="modal-actions">
                            <button class="btn-primary" id="accept-terms-btn" disabled>Aceitar e Continuar</button>
                            <button class="btn-secondary close-modal">Fechar</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Adicionar eventos do modal
            this.bindModalEvents();
        }
    }

    bindModalEvents() {
        const modal = document.getElementById('terms-modal');
        if (!modal) return;

        // Fechar modal
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeTermsModal();
            });
        }

        // Alternar entre abas
        const tabs = modal.querySelectorAll('.tab-terms');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTermsTab(e.target.dataset.tab);
            });
        });

        // Aceitar termos no modal
        const modalCheckbox = modal.querySelector('#modal-accept-terms');
        if (modalCheckbox) {
            modalCheckbox.addEventListener('change', (e) => {
                this.toggleAcceptButton(e.target.checked);
            });
        }

        // Botão de aceitar
        const acceptBtn = modal.querySelector('#accept-terms-btn');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                this.acceptTerms();
            });
        }

        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeTermsModal();
            }
        });
    }

    switchTermsTab(tab) {
        const modal = document.getElementById('terms-modal');
        if (!modal) return;

        const title = modal.querySelector('#terms-modal-title');
        const tabs = modal.querySelectorAll('.tab-terms');
        const content = modal.querySelector('#terms-content');
        const documentSpan = modal.querySelector('#current-document');

        if (!title || !content || !documentSpan) return;

        // Atualizar abas ativas
        tabs.forEach(t => t.classList.remove('active'));
        const activeTab = modal.querySelector(`[data-tab="${tab}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Atualizar conteúdo
        if (tab === 'terms') {
            title.textContent = 'Termos de Uso';
            documentSpan.textContent = 'Termos de Uso';
            content.innerHTML = this.getTermsContent();
        } else {
            title.textContent = 'Política de Privacidade';
            documentSpan.textContent = 'Política de Privacidade';
            content.innerHTML = this.getPrivacyContent();
        }

        // Resetar aceitação
        this.resetModalAcceptance();
    }

    resetModalAcceptance() {
        const modal = document.getElementById('terms-modal');
        if (!modal) return;

        const checkbox = modal.querySelector('#modal-accept-terms');
        const acceptBtn = modal.querySelector('#accept-terms-btn');
        
        if (checkbox) checkbox.checked = false;
        if (acceptBtn) acceptBtn.disabled = true;
    }

    toggleAcceptButton(checked) {
        const acceptBtn = document.getElementById('accept-terms-btn');
        if (acceptBtn) {
            acceptBtn.disabled = !checked;
        }
    }

    showTermsModal(type = 'terms') {
        const modal = document.getElementById('terms-modal');
        if (!modal) return;
        
        // Mostrar a aba correta
        this.switchTermsTab(type);
        
        // Mostrar modal
        modal.classList.add('active');
        
        // Focar no conteúdo para acessibilidade
        setTimeout(() => {
            const content = modal.querySelector('.terms-content');
            if (content) content.focus();
        }, 100);
    }

    closeTermsModal() {
        const modal = document.getElementById('terms-modal');
        if (modal) {
            modal.classList.remove('active');
            this.resetModalAcceptance();
        }
    }

    acceptTerms() {
        const currentUser = window.authSystem ? window.authSystem.currentUser : null;
        const version = this.getCurrentVersion();
        
        if (currentUser) {
            this.termsAccepted[currentUser] = {
                accepted: true,
                date: new Date().toISOString(),
                version: version,
                ip: '127.0.0.1' // Em uma aplicação real, isso viria do backend
            };
        } else {
            // Para usuários não logados (durante o registro)
            this.termsAccepted.guest = {
                accepted: true,
                date: new Date().toISOString(),
                version: version
            };
        }
        
        this.saveTermsAcceptance();
        
        // Marcar checkbox do formulário de registro
        const regCheckbox = document.getElementById('reg-terms');
        if (regCheckbox) {
            regCheckbox.checked = true;
        }
        
        this.closeTermsModal();
        this.showAcceptanceMessage();
    }

    handleTermsCheckbox(checked) {
        if (checked && !this.hasUserAcceptedTerms()) {
            // Se o usuário marcou o checkbox mas ainda não aceitou os termos, mostrar modal
            this.showTermsModal('terms');
        }
    }

    hasUserAcceptedTerms() {
        const currentUser = window.authSystem ? window.authSystem.currentUser : null;
        if (currentUser) {
            return this.termsAccepted[currentUser] && this.termsAccepted[currentUser].accepted;
        }
        return this.termsAccepted.guest && this.termsAccepted.guest.accepted;
    }

    checkTermsAcceptance() {
        // Verificar se o usuário atual aceitou os termos
        const currentUser = window.authSystem ? window.authSystem.currentUser : null;
        if (currentUser && !this.hasUserAcceptedTerms()) {
            console.log('Usuário precisa aceitar os termos');
        }
    }

    getCurrentVersion() {
        return '1.0.0';
    }

    saveTermsAcceptance() {
        localStorage.setItem('termsAccepted', JSON.stringify(this.termsAccepted));
    }

    showAcceptanceMessage() {
        if (typeof window.showNotification === 'function') {
            window.showNotification('Termos aceitos com sucesso!', 'success');
        } else {
            alert('Termos aceitos com sucesso!');
        }
    }

    getTermsContent() {
        return `
            <div class="terms-section">
                <h4>1. Aceitação dos Termos</h4>
                <p>Ao acessar e usar o Projeto Fich, você concorda em cumprir estes termos de serviço.</p>
            </div>
            
            <div class="terms-section">
                <h4>2. Uso do Serviço</h4>
                <p>O Projeto Fich é uma plataforma para gerenciamento de sessões de RPG. Você concorda em usar o serviço apenas para fins legais.</p>
            </div>
            
            <div class="terms-section">
                <h4>3. Conta do Usuário</h4>
                <p>Você é responsável por manter a confidencialidade de sua conta e senha. Todas as atividades que ocorrem em sua conta são de sua responsabilidade.</p>
            </div>
            
            <div class="terms-section">
                <h4>4. Conteúdo do Usuário</h4>
                <p>Você mantém os direitos sobre o conteúdo que enviar, mas concede ao Projeto Fich uma licença para armazenar e exibir esse conteúdo.</p>
            </div>
            
            <div class="terms-section">
                <h4>5. Limitação de Responsabilidade</h4>
                <p>O Projeto Fich não se responsabiliza por danos indiretos resultantes do uso ou incapacidade de usar o serviço.</p>
            </div>
            
            <div class="terms-section">
                <h4>6. Modificações</h4>
                <p>Podemos modificar estes termos a qualquer momento. O uso continuado constitui aceitação dos novos termos.</p>
            </div>
        `;
    }

    getPrivacyContent() {
        return `
            <div class="terms-section">
                <h4>1. Coleta de Informações</h4>
                <p>Coletamos informações que você nos fornece diretamente, como nome de usuário, e-mail e conteúdo que você envia.</p>
            </div>
            
            <div class="terms-section">
                <h4>2. Uso das Informações</h4>
                <p>Utilizamos suas informações para fornecer, manter e melhorar nossos serviços.</p>
            </div>
            
            <div class="terms-section">
                <h4>3. Compartilhamento de Informações</h4>
                <p>Não vendemos suas informações pessoais. Podemos compartilhar informações em circunstâncias específicas.</p>
            </div>
            
            <div class="terms-section">
                <h4>4. Segurança</h4>
                <p>Implementamos medidas de segurança para proteger suas informações.</p>
            </div>
            
            <div class="terms-section">
                <h4>5. Seus Direitos</h4>
                <p>Você pode acessar, corrigir ou excluir suas informações pessoais a qualquer momento.</p>
            </div>
        `;
    }

    // Métodos utilitários
    getAcceptanceStats() {
        const users = window.authSystem ? window.authSystem.users : [];
        const totalUsers = Array.isArray(users) ? users.length : 0;
        const acceptedUsers = Object.keys(this.termsAccepted).filter(key => 
            key !== 'guest' && this.termsAccepted[key].accepted
        ).length;
        
        return {
            totalUsers,
            acceptedUsers,
            acceptanceRate: totalUsers > 0 ? ((acceptedUsers / totalUsers) * 100).toFixed(1) : 0
        };
    }

    // Método para verificar se o usuário atual é admin (exemplo)
    isUserAdmin() {
        const currentUser = window.authSystem ? window.authSystem.currentUser : null;
        return currentUser === 'admin'; // Exemplo simples
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.termsManager = new TermsManager();
});

// Exportar para uso em módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TermsManager;
}