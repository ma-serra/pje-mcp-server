# 🌍 Instalação Global do PJE MCP Server

Este guia explica como instalar e configurar o PJE MCP Server de forma global, permitindo acesso de todas as ferramentas que suportam MCP (Claude Desktop, VSCode, etc).

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação Automática](#instalação-automática)
- [Instalação Manual](#instalação-manual)
- [Configuração por Ferramenta](#configuração-por-ferramenta)
- [Solução de Problemas](#solução-de-problemas)

## 🔧 Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Claude Desktop** ou **VSCode** com extensão MCP

## 🚀 Instalação Automática

### Windows

1. Clone o repositório:
```cmd
git clone https://github.com/seu-usuario/pje-mcp-server.git
cd pje-mcp-server
```

2. Execute o instalador (como Administrador):
```cmd
install.bat
```

3. Siga as instruções na tela

### Linux/Mac

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/pje-mcp-server.git
cd pje-mcp-server
```

2. Dê permissão de execução e execute:
```bash
chmod +x install.sh
./install.sh
```

3. Siga as instruções na tela

## 🔨 Instalação Manual

### 1. Instalar globalmente via NPM

```bash
# Compile o projeto
npm install
npm run build

# Instale globalmente
npm install -g .

# Ou instale direto do repositório
npm install -g git+https://github.com/seu-usuario/pje-mcp-server.git
```

### 2. Verificar instalação

```bash
# Deve mostrar o caminho do pacote instalado
npm list -g pje-mcp-server
```

## ⚙️ Configuração por Ferramenta

### Claude Desktop

#### Configuração Automática

```bash
npm run config:claude
```

#### Configuração Manual

**Windows:**

1. Localize o arquivo: `%APPDATA%\Claude\claude_desktop_config.json`
2. Adicione a configuração:

```json
{
  "mcpServers": {
    "pje": {
      "command": "node",
      "args": ["C:\\Users\\SEU_USUARIO\\AppData\\Roaming\\npm\\node_modules\\pje-mcp-server\\build\\index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**Mac:**

1. Localize o arquivo: `~/Library/Application Support/Claude/claude_desktop_config.json`
2. Adicione a configuração:

```json
{
  "mcpServers": {
    "pje": {
      "command": "node",
      "args": ["/usr/local/lib/node_modules/pje-mcp-server/build/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**Linux:**

1. Localize o arquivo: `~/.config/claude/claude_desktop_config.json`
2. Adicione a configuração:

```json
{
  "mcpServers": {
    "pje": {
      "command": "node",
      "args": ["/home/SEU_USUARIO/.npm-global/lib/node_modules/pje-mcp-server/build/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### VSCode

#### Configuração Automática

```bash
npm run config:vscode
```

#### Configuração Manual

**Todas as plataformas:**

1. Instale a extensão MCP:
```bash
code --install-extension anthropics.mcp
```

2. Abra as configurações do VSCode (`Ctrl+,` ou `Cmd+,`)
3. Procure por "mcp.servers"
4. Ou edite diretamente o `settings.json`:

**Windows:** `%APPDATA%\Code\User\settings.json`
**Mac:** `~/Library/Application Support/Code/User/settings.json`
**Linux:** `~/.config/Code/User/settings.json`

```json
{
  "mcp.servers": {
    "pje": {
      "command": "node",
      "args": ["CAMINHO_DO_PACOTE_GLOBAL/build/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Outras Ferramentas MCP

Qualquer ferramenta que suporte o Model Context Protocol pode usar o servidor. A configuração básica é:

```json
{
  "command": "node",
  "args": ["CAMINHO_DO_PACOTE/build/index.js"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## 📁 Localização dos Arquivos Globais

### Descobrir o caminho de instalação

```bash
# Linux/Mac
npm root -g

# Windows (CMD)
npm root -g

# Exemplo de saída:
# Linux: /home/usuario/.npm-global/lib/node_modules
# Mac: /usr/local/lib/node_modules
# Windows: C:\Users\usuario\AppData\Roaming\npm\node_modules
```

O servidor estará em: `[npm root -g]/pje-mcp-server/build/index.js`

## 🔐 Configuração de Certificados

Após a instalação global, você precisa configurar o arquivo `.env`:

### Opção 1: Arquivo local no diretório do usuário

Crie `.env` em `~/.pje-mcp-server/.env`:

```bash
# Linux/Mac
mkdir -p ~/.pje-mcp-server
nano ~/.pje-mcp-server/.env
```

```cmd
REM Windows
mkdir %USERPROFILE%\.pje-mcp-server
notepad %USERPROFILE%\.pje-mcp-server\.env
```

### Opção 2: Variáveis de ambiente do sistema

Configure diretamente no sistema:

**Linux/Mac:**
```bash
# ~/.bashrc ou ~/.zshrc
export PJE_BASE_URL=https://pje.tjce.jus.br
export PJE_APP_NAME=pje-tjce-1g
export PJE_CERTIFICATE_PFX_PATH=/caminho/certificado.pfx
export PJE_CERTIFICATE_PFX_PASSWORD=senha123
```

**Windows:**
```cmd
setx PJE_BASE_URL "https://pje.tjce.jus.br"
setx PJE_APP_NAME "pje-tjce-1g"
setx PJE_CERTIFICATE_PFX_PATH "C:\certificado.pfx"
setx PJE_CERTIFICATE_PFX_PASSWORD "senha123"
```

### Exemplo de .env

```env
# URL do seu tribunal
PJE_BASE_URL=https://pje.tjce.jus.br
PJE_APP_NAME=pje-tjce-1g

# Certificado Digital (escolha uma opção)
# Opção 1: Arquivo PFX/P12
PJE_CERTIFICATE_PFX_PATH=/home/usuario/certificado.pfx
PJE_CERTIFICATE_PFX_PASSWORD=senha123

# Opção 2: Windows Store (Windows apenas)
PJE_CERTIFICATE_THUMBPRINT=abc123def456...
```

## ✅ Teste a Instalação

### 1. Reinicie a ferramenta
- **Claude Desktop:** Feche completamente e reabra
- **VSCode:** Recarregue a janela (Ctrl+Shift+P → "Reload Window")

### 2. Teste os comandos

No Claude Desktop:
```
"Liste os comandos PJE disponíveis"
"Configure o PJE do TJCE"
"Qual é o status da configuração PJE?"
```

## 🔧 Comandos Úteis

```bash
# Reconfigurar Claude Desktop
npm run config:claude

# Reconfigurar VSCode
npm run config:vscode

# Verificar versão instalada
npm list -g pje-mcp-server

# Atualizar para a versão mais recente
npm update -g pje-mcp-server

# Desinstalar
npm uninstall -g pje-mcp-server
```

## 🐛 Solução de Problemas

### Erro: "Cannot find module"

**Causa:** Caminho incorreto na configuração

**Solução:**
```bash
# Descubra o caminho correto
npm root -g

# Use o caminho completo:
# [npm root -g]/pje-mcp-server/build/index.js
```

### Erro: "Permission denied" (Linux/Mac)

**Causa:** Sem permissão para instalar globalmente

**Solução 1 - Configurar npm prefix (recomendado):**
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**Solução 2 - Usar sudo (não recomendado):**
```bash
sudo npm install -g pje-mcp-server
```

### Erro: "Certificado não encontrado"

**Causa:** Arquivo .env não encontrado ou configurado incorretamente

**Solução:**
1. Verifique se o .env existe em `~/.pje-mcp-server/.env`
2. Ou configure variáveis de ambiente do sistema
3. Ou use configuração por comando no Claude

### Claude Desktop não reconhece o servidor

**Solução:**
1. Verifique o caminho no `claude_desktop_config.json`
2. Reinicie o Claude Desktop COMPLETAMENTE
3. Verifique os logs:
   - Windows: `%APPDATA%\Claude\logs\`
   - Mac: `~/Library/Logs/Claude/`
   - Linux: `~/.config/claude/logs/`

### VSCode não reconhece o servidor

**Solução:**
1. Verifique se a extensão MCP está instalada
2. Recarregue a janela do VSCode
3. Verifique o caminho em `settings.json`
4. Veja os logs: `View → Output → MCP`

## 📚 Exemplos de Configuração

Todos os exemplos estão disponíveis no diretório `examples/`:

- `claude_desktop_config_windows.json` - Claude Desktop (Windows)
- `claude_desktop_config_mac.json` - Claude Desktop (Mac)
- `claude_desktop_config_linux.json` - Claude Desktop (Linux)
- `vscode_settings.json` - VSCode (todas plataformas)

## 🔄 Atualizações

Para atualizar o servidor:

```bash
# Se instalado via npm
npm update -g pje-mcp-server

# Se instalado via repositório local
cd pje-mcp-server
git pull
npm run build
npm install -g .
```

## 🤝 Suporte

- **Issues:** [GitHub Issues](https://github.com/seu-usuario/pje-mcp-server/issues)
- **Discussões:** [GitHub Discussions](https://github.com/seu-usuario/pje-mcp-server/discussions)

## 📖 Links Relacionados

- [README Principal](../README.md)
- [Documentação da API](API.md)
- [Guia de Certificados](CERTIFICADOS.md)
- [Documentação MCP](https://modelcontextprotocol.io)
