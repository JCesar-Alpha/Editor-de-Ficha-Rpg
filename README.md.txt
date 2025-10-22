
# Projeto Fich - Sistema de Gerenciamento de RPG

![Status](https://img.shields.io/badge/Status-Desenvolvimento-yellow)
![Versão](https://img.shields.io/badge/Versão-1.0.0-blue)
![Licença](https://img.shields.io/badge/Licença-MIT-green)

## 📖 Sobre o Projeto

O **Projeto Fich** é uma plataforma web completa para gerenciamento de sessões de RPG (Role-Playing Game) que oferece ferramentas especializadas tanto para jogadores quanto para mestres. O sistema permite o upload de fichas de personagem em PDF, que são convertidas em templates editáveis, além de fornecer uma suíte completa de ferramentas para melhorar a experiência do jogo.

### 🎯 Funcionalidades Principais

#### 👥 Para Jogadores
- **Upload de Fichas PDF**: Converta suas fichas de personagem em templates editáveis
- **Editor de Fichas**: Modifique e atualize suas fichas diretamente na plataforma
- **Salas de Sessão**: Participe de sessões interativas com outros jogadores e mestres
- **Ferramentas de Utilidade**:
  - Integração com Worldbear (mapas de RPG)
  - Calculadora de dados avançada
  - Gerador de NPCs
  - Sistema de rolagem de dados integrado

#### 🎭 Para Mestres
- **Upload de Livros de Regras**: Envie livros PDF para criar áreas de trabalho customizadas
- **Gerenciamento de Campanhas**: Crie e gerencie múltiplas campanhas
- **Painel de Controle**: Ferramentas em tempo real para gerenciar sessões
- **Ferramentas Exclusivas**:
  - Gerador de encontros balanceados
  - Editor de regras customizadas
  - Controle de participantes
  - Criação e gestão de salas

#### 🌐 Sistema de Salas
- **Salas Interativas**: Espaços compartilhados para sessões
- **Chat em Tempo Real**: Comunicação integrada entre participantes
- **Compartilhamento de Fichas**: Visualização coletiva de personagens
- **Ferramentas Colaborativas**: Dados, mapas e recursos compartilhados

## 🚀 Começando

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado
- Conexão com internet (para funcionalidades online)

### Instalação

1. **Clone o repositório**:
```bash
git clone https://github.com/seu-usuario/projeto-fich.git
cd projeto-fich
```

2. **Estrutura do projeto**:
```
projeto-fich/
├── index.html              # Interface principal
├── styles/
│   ├── main.css           # Estilos principais
│   └── components.css     # Estilos de componentes
├── scripts/
│   ├── auth.js           # Sistema de autenticação
│   ├── ficha.js          # Gerenciamento de fichas
│   ├── master.js         # Ferramentas do mestre
│   ├── sala.js           # Sistema de salas
│   └── main.js           # Script principal
└── assets/
    ├── icons/            # Ícones e imagens
    └── images/
```

3. **Execução**:
   - Abra o arquivo `index.html` em um navegador web
   - Ou sirva via servidor local:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

## 🎮 Como Usar

### Primeiro Acesso

1. **Registro/Login**:
   - Acesse a tela de login
   - Selecione seu tipo de usuário (Jogador ou Mestre)
   - Faça login com suas credenciais

2. **Configuração Inicial**:
   - **Jogadores**: Faça upload de sua primeira ficha PDF
   - **Mestres**: Crie sua primeira campanha e envie livros de regras

### Para Jogadores

#### 📄 Gerenciando Fichas
1. Na área do jogador, clique em "Enviar Nova Ficha"
2. Selecione o arquivo PDF e preencha as informações
3. Após o processamento, edite a ficha conforme necessário
4. Use as ferramentas de dados e cálculos integradas

#### 🎪 Participando de Sessões
1. Acesse a seção "Salas de Sessão"
2. Entre com o código fornecido pelo mestre
3. Interaja com outros participantes via chat
4. Use as ferramentas colaborativas disponíveis

### Para Mestres

#### 📚 Gerenciando Campanhas
1. Crie uma nova campanha na área do mestre
2. Configure as regras e configurações específicas
3. Adicione jogadores à campanha
4. Use o painel de controle para gerenciar sessões

#### 🏰 Trabalhando com Livros
1. Envie livros de regras em PDF
2. O sistema processará automaticamente as regras
3. Crie áreas de trabalho customizadas baseadas no livro
4. Adapte regras conforme necessário para sua campanha

#### 🎮 Criando Sessões
1. Crie uma sala de sessão
2. Compartilhe o código com os jogadores
3. Use as ferramentas do mestre durante a sessão
4. Monitore o progresso e interações em tempo real

## 🔧 Tecnologias Utilizadas

- **Frontend**:
  - HTML5 semântico
  - CSS3 com Grid e Flexbox
  - JavaScript ES6+
  - LocalStorage para persistência de dados

- **Design**:
  - Interface responsiva
  - Design system consistente
  - Experiência de usuário otimizada para RPG

## 🗂️ Estrutura de Código

### Arquivos Principais

- **index.html**: Estrutura principal da aplicação
- **styles/main.css**: Estilos gerais e layout
- **styles/components.css**: Componentes específicos e modulares
- **scripts/auth.js**: Sistema de autenticação e controle de acesso
- **scripts/ficha.js**: Gerenciamento completo de fichas
- **scripts/master.js**: Funcionalidades exclusivas para mestres
- **scripts/sala.js**: Sistema de salas e colaboração
- **scripts/main.js**: Funcionalidades comuns e utilitários

### Módulos Principais

#### Autenticação (`auth.js`)
```javascript
- Controle de login/logout
- Gerenciamento de sessões
- Diferenciação entre jogadores e mestres
```

#### Gerenciamento de Fichas (`ficha.js`)
```javascript
- Upload e processamento de PDF
- Conversão para templates editáveis
- CRUD completo de fichas
- Sistema de versionamento
```

#### Ferramentas do Mestre (`master.js`)
```javascript
- Gerenciamento de campanhas
- Processamento de livros de regras
- Ferramentas de balanceamento
- Painel de controle em tempo real
```

#### Sistema de Salas (`sala.js`)
```javascript
- Criação e gestão de salas
- Comunicação em tempo real
- Ferramentas colaborativas
- Controle de participantes
```

## 🎨 Personalização

### Temas e Cores
O sistema suporta customização de temas através das variáveis CSS. Modifique no arquivo `styles/main.css`:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
}
```

### Sistemas de RPG Suportados
- Dungeons & Dragons
- Pathfinder
- Call of Cthulhu
- Tormenta RPG
- Sistemas personalizados

## 🔄 Desenvolvimento Futuro

### Próximas Funcionalidades
- [ ] Integração com APIs de RPG
- [ ] Sistema de plugins
- [ ] Aplicativo móvel
- [ ] Exportação/importação de dados
- [ ] Modo offline
- [ ] Sistema de módulos e expansões

### Melhorias Planejadas
- [ ] Processamento mais avançado de PDF
- [ ] Reconhecimento ótico de caracteres (OCR)
- [ ] Inteligência artificial para sugestões
- [ ] Análise de balanceamento automático
- [ ] Relatórios e estatísticas de campanha

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- Siga as convenções de código existentes
- Mantenha a responsividade
- Teste em múltiplos navegadores
- Documente novas funcionalidades

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

### Problemas Conhecidos
- Processamento de PDFs muito complexos pode falhar
- Alguns recursos exigem conexão com internet
- Compatibilidade com navegadores antigos é limitada

### Solução de Problemas
1. **Ficha não carrega**: Verifique se o PDF não está corrompido
2. **Login não funciona**: Limpe o cache do navegador
3. **Sala não conecta**: Verifique a conexão com internet

### Contato
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/projeto-fich/issues)
- **Email**: suporte@projetofich.com
- **Discord**: [Servidor da Comunidade](https://discord.gg/projetofich)

## 🙏 Agradecimentos

- Comunidade RPG brasileira pelo feedback
- Contribuidores e testadores
- Desenvolvedores de ferramentas open source utilizadas

---

**Projeto Fich** - Revolucionando a maneira como jogamos RPG! 🎲✨

*Desenvolvido com ❤️ para a comunidade RPG*