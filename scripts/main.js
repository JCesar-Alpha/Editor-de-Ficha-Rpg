// Script principal para funcionalidades comuns
document.addEventListener('DOMContentLoaded', function() {
    // Navegação para jogadores
    const playerNavLinks = document.querySelectorAll('#player-screen .nav-link');
    if (playerNavLinks && playerNavLinks.length) {
        playerNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                switchSection(this.dataset.section);
            });
        });
    }

    // Navegação para mestres
    const masterNavLinks = document.querySelectorAll('#master-screen .nav-link');
    if (masterNavLinks && masterNavLinks.length) {
        masterNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                switchSection(this.dataset.section);
            });
        });
    }

    // Função para alternar entre seções
    function switchSection(sectionId) {
        // Atualizar navegação ativa
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        event.target.classList.add('active');

        // Mostrar seção correspondente
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId + '-section').classList.add('active');
    }

    // Fechar modais ao clicar fora
    const modals = document.querySelectorAll('.modal');
    if (modals && modals.length) {
        modals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        });
    }

    // Fechar modais com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });

    // Integração Worldbear
    const connectWorldbearBtn = document.getElementById('connect-worldbear');
    if (connectWorldbearBtn) {
        connectWorldbearBtn.addEventListener('click', function() {
            connectWorldbear();
        });
    }

    // Calculadora de Dados
    const openDiceCalcBtn = document.getElementById('open-dice-calc');
    if (openDiceCalcBtn) {
        openDiceCalcBtn.addEventListener('click', function() {
            openDiceCalculator();
        });
    }

    // Gerador de NPCs
    const generateNpcBtn = document.getElementById('generate-npc');
    if (generateNpcBtn) {
        generateNpcBtn.addEventListener('click', function() {
            generateNPC();
        });
    }

    // Gerador de Encontros
    const generateEncounterBtn = document.getElementById('generate-encounter');
    if (generateEncounterBtn) {
        generateEncounterBtn.addEventListener('click', function() {
            generateEncounter();
        });
    }

    // Painel de Controle do Mestre
    const openControlPanelBtn = document.getElementById('open-control-panel');
    if (openControlPanelBtn) {
        openControlPanelBtn.addEventListener('click', function() {
            openControlPanel();
        });
    }

    // Editor de Regras
    const openRulesEditorBtn = document.getElementById('open-rules-editor');
    if (openRulesEditorBtn) {
        openRulesEditorBtn.addEventListener('click', function() {
            openRulesEditor();
        });
    }

    // Inicializar tooltips
    initializeTooltips();

    // Inicializar componentes interativos
    initializeInteractiveComponents();
});

// Inicializar tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            // Tooltip já é gerenciado pelo CSS, apenas garantir acessibilidade
            this.setAttribute('aria-describedby', 'tooltip-' + this.id);
        });
    });
}

// Inicializar componentes interativos
function initializeInteractiveComponents() {
    // Inicializar abas se existirem
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });

    // Inicializar accordions se existirem
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(header => {
        header.addEventListener('click', function() {
            toggleAccordion(this);
        });
    });
}

// Alternar entre abas
function switchTab(tabName) {
    // Atualizar aba ativa
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Mostrar conteúdo correspondente
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + '-tab').classList.add('active');
}

// Alternar accordion
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const isOpen = content.style.display === 'block';

    // Fechar todos os accordions
    document.querySelectorAll('.accordion-content').forEach(accContent => {
        accContent.style.display = 'none';
    });
    document.querySelectorAll('.accordion-header').forEach(accHeader => {
        accHeader.classList.remove('active');
    });

    // Abrir o accordion clicado se não estava aberto
    if (!isOpen) {
        content.style.display = 'block';
        header.classList.add('active');
    }
}

// Integração Worldbear
function connectWorldbear() {
    showNotification('Conectando ao Worldbear...', 'info');
    
    // Simular conexão
    setTimeout(() => {
        const success = Math.random() > 0.3; // 70% de chance de sucesso
        if (success) {
            showNotification('Conexão com Worldbear estabelecida com sucesso!', 'success');
            // Aqui implementaria a integração real com a API do Worldbear
            updateWorldbearStatus(true);
        } else {
            showNotification('Falha ao conectar com Worldbear. Tente novamente.', 'error');
            updateWorldbearStatus(false);
        }
    }, 2000);
}

function updateWorldbearStatus(connected) {
    const container = document.querySelector('.worldbear-container');
    const button = document.getElementById('connect-worldbear');
    
    if (container && button) {
        if (connected) {
            container.classList.add('worldbear-connected');
            container.classList.remove('worldbear-disconnected');
            button.textContent = 'Desconectar';
            button.onclick = disconnectWorldbear;
        } else {
            container.classList.add('worldbear-disconnected');
            container.classList.remove('worldbear-connected');
            button.textContent = 'Conectar';
            button.onclick = connectWorldbear;
        }
    }
}

function disconnectWorldbear() {
    showNotification('Desconectando do Worldbear...', 'info');
    
    setTimeout(() => {
        showNotification('Desconectado do Worldbear.', 'success');
        updateWorldbearStatus(false);
    }, 1000);
}

// Calculadora de Dados
function openDiceCalculator() {
    showNotification('Abrindo Calculadora de Dados...', 'info');
    
    // Criar modal de calculadora de dados se não existir
    if (!document.getElementById('dice-calculator-modal')) {
        createDiceCalculatorModal();
    }
    
    document.getElementById('dice-calculator-modal').classList.add('active');
}

function createDiceCalculatorModal() {
    const modal = document.createElement('div');
    modal.id = 'dice-calculator-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Calculadora de Dados</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="dice-roller">
                    <div class="dice-presets">
                        <div class="dice-preset" data-dice="d4">d4</div>
                        <div class="dice-preset" data-dice="d6">d6</div>
                        <div class="dice-preset" data-dice="d8">d8</div>
                        <div class="dice-preset" data-dice="d10">d10</div>
                        <div class="dice-preset" data-dice="d12">d12</div>
                        <div class="dice-preset" data-dice="d20">d20</div>
                        <div class="dice-preset" data-dice="d100">d100</div>
                    </div>
                    
                    <div class="dice-custom">
                        <input type="text" id="custom-dice" placeholder="Ex: 2d6+3">
                        <button class="btn-primary" id="roll-custom">Rolar</button>
                    </div>
                    
                    <div class="dice-result" id="dice-result">
                        Clique em um dado para rolar
                    </div>
                    
                    <div class="dice-history" id="dice-history">
                        <h4>Histórico</h4>
                        <div id="history-list"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Adicionar eventos
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Eventos para dados pré-definidos
    modal.querySelectorAll('.dice-preset').forEach(preset => {
        preset.addEventListener('click', function() {
            const diceType = this.dataset.dice;
            rollDice(diceType);
        });
    });
    
    // Evento para rolagem customizada
    modal.querySelector('#roll-custom').addEventListener('click', function() {
        const customInput = modal.querySelector('#custom-dice').value;
        if (customInput) {
            rollCustomDice(customInput);
        }
    });
    
    // Enter para rolagem customizada
    modal.querySelector('#custom-dice').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            modal.querySelector('#roll-custom').click();
        }
    });
}

function rollDice(diceType) {
    const diceMap = {
        'd4': 4,
        'd6': 6,
        'd8': 8,
        'd10': 10,
        'd12': 12,
        'd20': 20,
        'd100': 100
    };
    
    const sides = diceMap[diceType];
    const result = Math.floor(Math.random() * sides) + 1;
    
    displayDiceResult(`${diceType}: ${result}`, result);
    addToHistory(`${diceType}: ${result}`);
}

function rollCustomDice(input) {
    try {
        // Parse simples de expressões de dados (ex: "2d6+3")
        const match = input.match(/(\d*)d(\d+)([+-]\d+)?/);
        if (!match) {
            showNotification('Formato inválido. Use: XdY+Z', 'error');
            return;
        }
        
        const count = parseInt(match[1]) || 1;
        const sides = parseInt(match[2]);
        const modifier = parseInt(match[3]) || 0;
        
        let total = 0;
        let rolls = [];
        
        for (let i = 0; i < count; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;
        }
        
        total += modifier;
        
        const displayText = `${count}d${sides}${modifier >= 0 ? '+' : ''}${modifier !== 0 ? modifier : ''} = [${rolls.join(', ')}]${modifier !== 0 ? `${modifier >= 0 ? '+' : ''}${modifier}` : ''} = ${total}`;
        
        displayDiceResult(displayText, total);
        addToHistory(displayText);
        
    } catch (error) {
        showNotification('Erro ao processar a expressão de dados.', 'error');
    }
}

function displayDiceResult(text, result) {
    const resultElement = document.getElementById('dice-result');
    if (resultElement) {
        resultElement.textContent = text;
        resultElement.classList.add('rolling');
        
        setTimeout(() => {
            resultElement.classList.remove('rolling');
        }, 500);
    }
}

function addToHistory(roll) {
    const historyList = document.getElementById('history-list');
    if (historyList) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = roll;
        historyList.insertBefore(historyItem, historyList.firstChild);
        
        // Manter apenas os últimos 10 rolls
        if (historyList.children.length > 10) {
            historyList.removeChild(historyList.lastChild);
        }
    }
}

// Gerador simples de NPC
function generateNPC() {
    const names = {
        masculino: ['Aelar', 'Borin', 'Darian', 'Fargrim', 'Gideon', 'Kaelen', 'Lorien', 'Orin', 'Theron', 'Zephyr'],
        feminino: ['Celia', 'Elena', 'Isolde', 'Lyra', 'Morgana', 'Nyssa', 'Seraphina', 'Thalia', 'Vespera', 'Yvaine'],
        neutro: ['Avery', 'Brook', 'Dakota', 'Emery', 'Jordan', 'Kai', 'Morgan', 'Quinn', 'Riley', 'Skyler']
    };
    
    const races = ['Humano', 'Elfo', 'Anão', 'Halfling', 'Meio-Elfo', 'Tiefling', 'Gnomo', 'Meio-Orc', 'Dragonborn', 'Gnomos'];
    const classes = ['Guerreiro', 'Mago', 'Ladino', 'Clérigo', 'Ranger', 'Bardo', 'Paladino', 'Druida', 'Monge', 'Bruxo'];
    const personalities = ['Alegre', 'Sério', 'Desconfiado', 'Amigável', 'Reservado', 'Extrovertido', 'Cínico', 'Otimista', 'Pessimista', 'Neutro'];
    const occupations = ['Mercador', 'Ferreiros', 'Curandeiro', 'Ladrão', 'Nobre', 'Camponês', 'Soldado', 'Erudito', 'Artista', 'Aventureiro'];
    
    const gender = Math.random() > 0.5 ? 'masculino' : 'feminino';
    const name = names[gender][Math.floor(Math.random() * names[gender].length)];
    const race = races[Math.floor(Math.random() * races.length)];
    const cls = classes[Math.floor(Math.random() * classes.length)];
    const personality = personalities[Math.floor(Math.random() * personalities.length)];
    const occupation = occupations[Math.floor(Math.random() * occupations.length)];
    const age = Math.floor(Math.random() * 80) + 18;
    
    const npcDetails = `
        NPC Gerado:
        
        Nome: ${name}
        Gênero: ${gender}
        Idade: ${age} anos
        Raça: ${race}
        Classe: ${cls}
        Ocupação: ${occupation}
        Personalidade: ${personality}
        
        Descrição: ${name} é um${gender === 'feminino' ? 'a' : ''} ${race.toLowerCase()} ${cls.toLowerCase()} que trabalha como ${occupation.toLowerCase()}. Tem uma personalidade ${personality.toLowerCase()} e ${age} anos de idade.
    `;
    
    showNotification('NPC gerado com sucesso!', 'success');
    
    // Criar modal para mostrar detalhes do NPC
    showNPCDetails(npcDetails);
}

function showNPCDetails(details) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>NPC Gerado</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <pre style="white-space: pre-wrap; font-family: inherit;">${details}</pre>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary close-modal">Fechar</button>
                <button class="btn-primary" id="save-npc">Salvar NPC</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Eventos do modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('#save-npc').addEventListener('click', () => {
        showNotification('NPC salvo na biblioteca!', 'success');
        modal.remove();
    });
}

// Gerador simples de Encontro
function generateEncounter() {
    const difficulties = ['Fácil', 'Médio', 'Difícil', 'Mortal'];
    const environments = ['Floresta', 'Caverna', 'Ruínas', 'Cidade', 'Deserto', 'Montanha', 'Pântano', 'Litoral'];
    const enemyTypes = ['Goblins', 'Orcs', 'Bandidos', 'Zumbis', 'Animais Selvagens', 'Cultistas', 'Dragões', 'Elementais'];
    
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const environment = environments[Math.floor(Math.random() * environments.length)];
    const enemy = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const enemyCount = Math.floor(Math.random() * 8) + 2;
    const challengeRating = (Math.random() * 5).toFixed(1);
    
    const encounterDetails = `
        Encontro Gerado:
        
        Dificuldade: ${difficulty}
        Ambiente: ${environment}
        Inimigos: ${enemyCount} ${enemy}
        Nível de Desafio: ${challengeRating}
        
        Descrição: Um encontro ${difficulty.toLowerCase()} com ${enemyCount} ${enemy.toLowerCase()} em um ambiente de ${environment.toLowerCase()}. Recomendado para grupos de nível ${challengeRating}.
    `;
    
    showNotification('Encontro gerado com sucesso!', 'success');
    showEncounterDetails(encounterDetails);
}

function showEncounterDetails(details) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Encontro Gerado</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <pre style="white-space: pre-wrap; font-family: inherit;">${details}</pre>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary close-modal">Fechar</button>
                <button class="btn-primary" id="save-encounter">Salvar Encontro</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('#save-encounter').addEventListener('click', () => {
        showNotification('Encontro salvo na biblioteca!', 'success');
        modal.remove();
    });
}

// Painel de Controle do Mestre
function openControlPanel() {
    showNotification('Abrindo Painel de Controle do Mestre...', 'info');
    // Implementação do painel de controle seria mais complexa
    // Por enquanto, apenas uma notificação
    setTimeout(() => {
        showNotification('Painel de Controle carregado!', 'success');
    }, 1000);
}

// Editor de Regras
function openRulesEditor() {
    showNotification('Abrindo Editor de Regras...', 'info');
    // Implementação do editor de regras seria mais complexa
    setTimeout(() => {
        showNotification('Editor de Regras carregado!', 'success');
    }, 1000);
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remover notificações antigas
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
    
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Estilos para a notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        max-width: 500px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Evento para fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Adicionar estilos de animação para notificações
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
}

// Utilitários globais
window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copiado para a área de transferência!', 'success');
    }).catch(() => {
        showNotification('Erro ao copiar para a área de transferência.', 'error');
    });
};

window.downloadAsFile = function(content, filename, contentType = 'text/plain') {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};