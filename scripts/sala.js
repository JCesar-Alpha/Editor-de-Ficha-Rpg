// Sistema de salas de sessão
class SalaSystem {
    constructor() {
        this.salas = JSON.parse(localStorage.getItem('salas')) || [];
        this.currentRoom = null;
        this.chatMessages = [];
        this.diceHistory = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSalas();
        this.initializeRoomTemplates();
    }

    bindEvents() {
        // Player - Entrar em sala
        const joinRoomBtn = document.getElementById('join-room');
        if (joinRoomBtn) {
            joinRoomBtn.addEventListener('click', () => {
                this.joinRoom();
            });
        }

        // Mestre - Criar sala
        const createRoomBtn = document.getElementById('create-room');
        if (createRoomBtn) {
            createRoomBtn.addEventListener('click', () => {
                this.createRoom();
            });
        }

        // Ferramentas da sala
        const openDiceBtn = document.getElementById('open-dice-roller');
        if (openDiceBtn) {
            openDiceBtn.addEventListener('click', () => {
                this.openDiceRoller();
            });
        }

        const openMapBtn = document.getElementById('open-map');
        if (openMapBtn) {
            openMapBtn.addEventListener('click', () => {
                this.openMap();
            });
        }

        const openChatBtn = document.getElementById('open-chat');
        if (openChatBtn) {
            openChatBtn.addEventListener('click', () => {
                this.openChat();
            });
        }

        // Eventos de teclado para sala
        document.addEventListener('keydown', (e) => {
            if (this.currentRoom && e.key === 'Escape') {
                this.leaveRoom();
            }
        });
    }

    // Para jogadores - Entrar em sala
    joinRoom() {
        const roomCode = prompt('Digite o código da sala:');
        if (roomCode) {
            const room = this.salas.find(s => 
                s.code.toLowerCase() === roomCode.toLowerCase() && 
                s.isActive
            );
            
            if (room) {
                if (room.isPrivate && !this.isPlayerInvited(room)) {
                    alert('Você não tem permissão para entrar nesta sala.');
                    return;
                }

                // Adicionar jogador à sala
                if (!room.players.includes(authSystem.currentUser)) {
                    room.players.push(authSystem.currentUser);
                    this.saveSalas();
                }

                this.enterRoom(room);
                this.showNotification(`Entrou na sala: ${room.name}`, 'success');
            } else {
                alert('Sala não encontrada ou inativa!');
            }
        }
    }

    // Verificar se jogador foi convidado para sala privada
    isPlayerInvited(room) {
        return room.invitedPlayers && room.invitedPlayers.includes(authSystem.currentUser);
    }

    // Para mestres - Criar sala
    createRoom() {
        // Criar modal de criação de sala se não existir
        if (!document.getElementById('create-room-modal')) {
            this.createRoomCreationModal();
        }
        
        document.getElementById('create-room-modal').classList.add('active');
    }

    createRoomCreationModal() {
        const modal = document.createElement('div');
        modal.id = 'create-room-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Criar Nova Sala</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="create-room-form">
                        <div class="form-group">
                            <label for="room-name">Nome da Sala</label>
                            <input type="text" id="room-name" required placeholder="Ex: Aventura na Floresta">
                        </div>
                        
                        <div class="form-group">
                            <label for="room-description">Descrição</label>
                            <textarea id="room-description" placeholder="Descreva a sessão..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="room-system">Sistema de RPG</label>
                            <select id="room-system">
                                <option value="custom">Personalizado</option>
                                <option value="dnd">Dungeons & Dragons</option>
                                <option value="pathfinder">Pathfinder</option>
                                <option value="callofcthulhu">Call of Cthulhu</option>
                                <option value="tormenta">Tormenta RPG</option>
                                <option value="shadowrun">Shadowrun</option>
                                <option value="starfinder">Starfinder</option>
                            </select>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="room-private">
                                    Sala Privada
                                </label>
                            </div>
                            
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="room-password">
                                    Proteger com Senha
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-group" id="password-field" style="display: none;">
                            <label for="room-password-value">Senha da Sala</label>
                            <input type="password" id="room-password-value" placeholder="Digite uma senha">
                        </div>
                        
                        <div class="form-group">
                            <label for="room-template">Template da Sala</label>
                            <select id="room-template">
                                <option value="standard">Padrão</option>
                                <option value="combat">Foco em Combate</option>
                                <option value="social">Foco em Roleplay</option>
                                <option value="exploration">Foco em Exploração</option>
                                <option value="custom">Personalizado</option>
                            </select>
                        </div>
                        
                        <div class="modal-actions">
                            <button type="button" class="btn-secondary close-modal">Cancelar</button>
                            <button type="submit" class="btn-primary">Criar Sala</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Eventos do modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        // Mostrar/ocultar campo de senha
        modal.querySelector('#room-password').addEventListener('change', function() {
            const passwordField = modal.querySelector('#password-field');
            passwordField.style.display = this.checked ? 'block' : 'none';
        });
        
        // Submissão do formulário
        modal.querySelector('#create-room-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRoomCreation();
        });
    }

    handleRoomCreation() {
        const modal = document.getElementById('create-room-modal');
        const name = document.getElementById('room-name').value;
        const description = document.getElementById('room-description').value;
        const system = document.getElementById('room-system').value;
        const isPrivate = document.getElementById('room-private').checked;
        const hasPassword = document.getElementById('room-password').checked;
        const password = hasPassword ? document.getElementById('room-password-value').value : null;
        const template = document.getElementById('room-template').value;

        if (!name) {
            this.showNotification('Por favor, digite um nome para a sala.', 'error');
            return;
        }

        const room = {
            id: Date.now(),
            name: name,
            description: description,
            code: this.generateRoomCode(),
            system: system,
            master: authSystem.currentUser,
            players: [],
            invitedPlayers: [],
            created: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            isActive: true,
            isPrivate: isPrivate,
            hasPassword: hasPassword,
            password: password,
            template: template,
            settings: this.getRoomTemplateSettings(template),
            state: {
                currentScene: 'introduction',
                music: null,
                ambiance: null,
                lighting: 'normal'
            },
            resources: {
                maps: [],
                handouts: [],
                music: [],
                images: []
            },
            chat: [],
            diceRolls: []
        };

        this.salas.push(room);
        this.saveSalas();
        this.loadSalas();
        
        modal.classList.remove('active');
        modal.querySelector('#create-room-form').reset();
        
        this.showNotification(`Sala "${name}" criada! Código: ${room.code}`, 'success');
    }

    generateRoomCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    }

    getRoomTemplateSettings(template) {
        const templates = {
            standard: {
                features: ['chat', 'dice', 'maps', 'handouts'],
                layout: 'balanced',
                theme: 'default'
            },
            combat: {
                features: ['initiative', 'combat-tracker', 'dice', 'maps'],
                layout: 'combat-focused',
                theme: 'combat'
            },
            social: {
                features: ['chat', 'notes', 'character-journal', 'handouts'],
                layout: 'social-focused',
                theme: 'social'
            },
            exploration: {
                features: ['maps', 'notes', 'journal', 'handouts'],
                layout: 'exploration-focused',
                theme: 'exploration'
            },
            custom: {
                features: ['chat', 'dice', 'maps'],
                layout: 'balanced',
                theme: 'default'
            }
        };
        
        return templates[template] || templates.standard;
    }

    initializeRoomTemplates() {
        // Inicializar templates padrão se não existirem
        if (!localStorage.getItem('roomTemplates')) {
            const defaultTemplates = {
                standard: {
                    name: 'Sala Padrão',
                    description: 'Sala balanceada para todos os tipos de sessão',
                    features: ['chat', 'dice', 'maps', 'handouts', 'music']
                },
                combat: {
                    name: 'Combate',
                    description: 'Otimizada para encontros de combate',
                    features: ['initiative', 'combat-tracker', 'dice', 'maps', 'hp-tracker']
                },
                social: {
                    name: 'Roleplay Social',
                    description: 'Focada em interações e diálogos',
                    features: ['chat', 'notes', 'character-journal', 'handouts']
                },
                exploration: {
                    name: 'Exploração',
                    description: 'Ideal para sessões de descoberta e aventura',
                    features: ['maps', 'notes', 'journal', 'handouts', 'fog-of-war']
                }
            };
            
            localStorage.setItem('roomTemplates', JSON.stringify(defaultTemplates));
        }
    }

    enterRoom(room) {
        this.currentRoom = room;
        this.showRoomModal(room);
        this.joinRoomChat(room);
        this.updateRoomActivity(room.id);
    }

    showRoomModal(room) {
        document.getElementById('room-name').textContent = room.name;
        this.updateParticipants(room);
        this.updateRoomInfo(room);
        this.initializeRoomTools(room);
        document.getElementById('room-modal').classList.add('active');
    }

    updateParticipants(room) {
        const container = document.getElementById('room-participants');
        container.innerHTML = '';
        
        // Adicionar mestre
        const masterItem = document.createElement('li');
        masterItem.className = 'participant master';
        masterItem.innerHTML = `
            <div class="participant-info">
                <div class="user-avatar small">${room.master.charAt(0).toUpperCase()}</div>
                <span class="participant-name"><strong>${room.master}</strong></span>
            </div>
            <span class="badge badge-primary">Mestre</span>
        `;
        container.appendChild(masterItem);
        
        // Adicionar jogadores
        room.players.forEach(player => {
            const playerItem = document.createElement('li');
            playerItem.className = 'participant player';
            playerItem.innerHTML = `
                <div class="participant-info">
                    <div class="user-avatar small">${player.charAt(0).toUpperCase()}</div>
                    <span class="participant-name">${player}</span>
                </div>
                <span class="badge badge-success">Jogador</span>
            `;
            container.appendChild(playerItem);
        });

        // Contador de participantes
        const counter = document.createElement('li');
        counter.className = 'participant-counter';
        counter.innerHTML = `<em>Total: ${room.players.length + 1} participantes</em>`;
        container.appendChild(counter);
    }

    updateRoomInfo(room) {
        const roomContent = document.getElementById('room-content');
        if (roomContent) {
            roomContent.innerHTML = `
                <div class="room-welcome">
                    <h3>Bem-vindo à "${room.name}"</h3>
                    <p>${room.description || 'Sessão de RPG em andamento...'}</p>
                    <div class="room-meta">
                        <span class="badge badge-primary">${this.getSystemName(room.system)}</span>
                        <span class="badge ${room.isPrivate ? 'badge-warning' : 'badge-success'}">
                            ${room.isPrivate ? 'Privada' : 'Pública'}
                        </span>
                        <span class="badge badge-info">${room.template}</span>
                    </div>
                </div>
            `;
        }
    }

    initializeRoomTools(room) {
        // Inicializar ferramentas baseadas no template da sala
        const settings = room.settings;
        
        // Aqui você pode inicializar ferramentas específicas
        // baseadas nas features do template
        if (settings.features.includes('combat-tracker')) {
            this.initializeCombatTracker();
        }
        
        if (settings.features.includes('initiative')) {
            this.initializeInitiativeTracker();
        }
    }

    initializeCombatTracker() {
        // Implementar rastreador de combate
        console.log('Inicializando rastreador de combate...');
    }

    initializeInitiativeTracker() {
        // Implementar rastreador de iniciativa
        console.log('Inicializando rastreador de iniciativa...');
    }

    joinRoomChat(room) {
        // Simular entrada no chat da sala
        this.addSystemMessage(`${authSystem.currentUser} entrou na sala.`);
        
        // Carregar histórico do chat se existir
        if (room.chat && room.chat.length > 0) {
            this.chatMessages = room.chat;
            this.updateChatDisplay();
        }
    }

    addSystemMessage(message) {
        this.chatMessages.push({
            type: 'system',
            message: message,
            timestamp: new Date().toISOString()
        });
        
        this.updateChatDisplay();
        this.saveRoomChat();
    }

    updateChatDisplay() {
        const chatContainer = document.querySelector('.chat-messages');
        if (!chatContainer) return;

        chatContainer.innerHTML = '';
        
        this.chatMessages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.className = `chat-message ${msg.type}`;
            
            if (msg.type === 'system') {
                messageElement.innerHTML = `
                    <div class="message-content">
                        <em>${msg.message}</em>
                    </div>
                    <div class="message-time">${this.formatTime(msg.timestamp)}</div>
                `;
            } else {
                messageElement.innerHTML = `
                    <div class="message-sender">${msg.sender}</div>
                    <div class="message-content">${msg.message}</div>
                    <div class="message-time">${this.formatTime(msg.timestamp)}</div>
                `;
            }
            
            chatContainer.appendChild(messageElement);
        });
        
        // Rolagem automática para a última mensagem
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    saveRoomChat() {
        if (this.currentRoom) {
            this.currentRoom.chat = this.chatMessages;
            this.updateRoomInList(this.currentRoom);
        }
    }

    updateRoomInList(updatedRoom) {
        const index = this.salas.findIndex(room => room.id === updatedRoom.id);
        if (index !== -1) {
            this.salas[index] = updatedRoom;
            this.saveSalas();
        }
    }

    updateRoomActivity(roomId) {
        const room = this.salas.find(s => s.id === roomId);
        if (room) {
            room.lastActivity = new Date().toISOString();
            this.saveSalas();
        }
    }

    leaveRoom() {
        if (this.currentRoom) {
            this.addSystemMessage(`${authSystem.currentUser} saiu da sala.`);
            this.showNotification(`Saiu da sala: ${this.currentRoom.name}`, 'info');
        }
        
        this.currentRoom = null;
        this.chatMessages = [];
        document.getElementById('room-modal').classList.remove('active');
    }

    // Ferramentas da sala
    openDiceRoller() {
        if (typeof window.openDiceCalculator === 'function') {
            window.openDiceCalculator();
        } else {
            this.showNotification('Calculadora de dados não disponível.', 'error');
        }
    }

    openMap() {
        this.showNotification('Abrindo Mapa...', 'info');
        // Integração com sistema de mapas seria implementada aqui
    }

    openChat() {
        this.showNotification('Chat aberto.', 'info');
        // Foco no input do chat seria implementado aqui
    }

    // Gerenciamento de salas
    manageRoom(id) {
        const room = this.salas.find(s => s.id === id);
        if (room) {
            this.enterRoom(room);
        }
    }

    toggleRoom(id) {
        const room = this.salas.find(s => s.id === id);
        if (room) {
            room.isActive = !room.isActive;
            this.saveSalas();
            this.loadSalas();
            
            const action = room.isActive ? 'ativada' : 'desativada';
            this.showNotification(`Sala "${room.name}" ${action}.`, 'success');
        }
    }

    deleteRoom(id) {
        const room = this.salas.find(s => s.id === id);
        if (room && confirm(`Tem certeza que deseja excluir a sala "${room.name}"?`)) {
            this.salas = this.salas.filter(s => s.id !== id);
            this.saveSalas();
            this.loadSalas();
            this.showNotification(`Sala "${room.name}" excluída.`, 'success');
        }
    }

    inviteToRoom(roomId, username) {
        const room = this.salas.find(s => s.id === roomId);
        if (room && room.master === authSystem.currentUser) {
            if (!room.invitedPlayers) {
                room.invitedPlayers = [];
            }
            
            if (!room.invitedPlayers.includes(username)) {
                room.invitedPlayers.push(username);
                this.saveSalas();
                this.showNotification(`${username} convidado para a sala.`, 'success');
                return true;
            }
        }
        return false;
    }

    // Salvamento e carregamento
    saveSalas() {
        localStorage.setItem('salas', JSON.stringify(this.salas));
    }

    loadSalas() {
        // Para jogadores - carregar salas disponíveis
        const playerContainer = document.getElementById('rooms-container');
        if (playerContainer) {
            playerContainer.innerHTML = '';
            
            const availableRooms = this.salas.filter(room => 
                room.isActive && 
                (!room.isPrivate || this.isPlayerInvited(room))
            );
            
            if (availableRooms.length === 0) {
                playerContainer.innerHTML = `
                    <div class="empty-state">
                        <h4>Nenhuma sala disponível</h4>
                        <p>Não há salas ativas no momento.</p>
                    </div>
                `;
                return;
            }
            
            availableRooms.forEach(room => {
                const roomElement = this.createRoomElement(room);
                playerContainer.appendChild(roomElement);
            });
        }

        // Para mestres - carregar gerenciamento de salas
        const masterContainer = document.getElementById('rooms-management-container');
        if (masterContainer) {
            masterContainer.innerHTML = '';
            
            const myRooms = this.salas.filter(room => room.master === authSystem.currentUser);
            
            if (myRooms.length === 0) {
                masterContainer.innerHTML = `
                    <div class="empty-state">
                        <h4>Nenhuma sala criada</h4>
                        <p>Você ainda não criou nenhuma sala.</p>
                    </div>
                `;
                return;
            }
            
            myRooms.forEach(room => {
                const roomMgmt = this.createRoomManagement(room);
                masterContainer.appendChild(roomMgmt);
            });
        }
    }

    createRoomElement(room) {
        const element = document.createElement('div');
        element.className = 'room-item';
        element.innerHTML = `
            <div class="room-header">
                <h4>${room.name}</h4>
                <span class="badge ${room.isPrivate ? 'badge-warning' : 'badge-success'}">
                    ${room.isPrivate ? 'Privada' : 'Pública'}
                </span>
            </div>
            <p class="room-description">${room.description || 'Sem descrição'}</p>
            <div class="room-meta">
                <span><strong>Mestre:</strong> ${room.master}</span>
                <span><strong>Sistema:</strong> ${this.getSystemName(room.system)}</span>
                <span><strong>Jogadores:</strong> ${room.players.length}</span>
            </div>
            <div class="room-actions">
                <button class="btn-primary" onclick="salaSystem.enterRoom(${JSON.stringify(room).replace(/"/g, '&quot;')})">
                    Entrar
                </button>
            </div>
        `;
        return element;
    }

    createRoomManagement(room) {
        const element = document.createElement('div');
        element.className = 'room-management-item';
        element.innerHTML = `
            <div class="room-header">
                <h4>${room.name}</h4>
                <div class="room-status">
                    <span class="badge ${room.isActive ? 'badge-success' : 'badge-error'}">
                        ${room.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                    <span class="badge ${room.isPrivate ? 'badge-warning' : 'badge-info'}">
                        ${room.isPrivate ? 'Privada' : 'Pública'}
                    </span>
                </div>
            </div>
            
            <p class="room-description">${room.description || 'Sem descrição'}</p>
            
            <div class="room-details">
                <div class="detail-item">
                    <strong>Código:</strong> ${room.code}
                </div>
                <div class="detail-item">
                    <strong>Sistema:</strong> ${this.getSystemName(room.system)}
                </div>
                <div class="detail-item">
                    <strong>Jogadores:</strong> ${room.players.length}
                </div>
                <div class="detail-item">
                    <strong>Criada em:</strong> ${new Date(room.created).toLocaleDateString('pt-BR')}
                </div>
            </div>
            
            <div class="card-actions">
                <button class="btn-primary" onclick="salaSystem.manageRoom(${room.id})">
                    Gerenciar
                </button>
                <button class="btn-secondary" onclick="salaSystem.toggleRoom(${room.id})">
                    ${room.isActive ? 'Desativar' : 'Ativar'}
                </button>
                <button class="btn-secondary" onclick="salaSystem.deleteRoom(${room.id})" style="background: #e74c3c;">
                    Excluir
                </button>
            </div>
        `;
        return element;
    }

    getSystemName(system) {
        const systems = {
            'custom': 'Personalizado',
            'dnd': 'Dungeons & Dragons',
            'pathfinder': 'Pathfinder',
            'callofcthulhu': 'Call of Cthulhu',
            'tormenta': 'Tormenta RPG',
            'shadowrun': 'Shadowrun',
            'starfinder': 'Starfinder'
        };
        return systems[system] || system;
    }

    showNotification(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    // Métodos para estatísticas
    getRoomStats() {
        const totalRooms = this.salas.length;
        const activeRooms = this.salas.filter(room => room.isActive).length;
        const publicRooms = this.salas.filter(room => !room.isPrivate).length;
        const privateRooms = this.salas.filter(room => room.isPrivate).length;
        
        return {
            totalRooms,
            activeRooms,
            publicRooms,
            privateRooms,
            activePercentage: totalRooms > 0 ? ((activeRooms / totalRooms) * 100).toFixed(1) : 0
        };
    }

    getUserRoomStats(username) {
        const createdRooms = this.salas.filter(room => room.master === username).length;
        const joinedRooms = this.salas.filter(room => room.players.includes(username)).length;
        const activeRooms = this.salas.filter(room => 
            room.isActive && (room.master === username || room.players.includes(username))
        ).length;
        
        return {
            createdRooms,
            joinedRooms,
            activeRooms
        };
    }
}

// Inicializar sistema de salas
const salaSystem = new SalaSystem();

// Exportar para uso global
window.salaSystem = salaSystem;