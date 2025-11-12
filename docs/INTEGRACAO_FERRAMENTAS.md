# 🔌 Integração com Múltiplas Ferramentas

Este guia mostra como integrar o PJE MCP Server com diferentes ferramentas de IA e editores.

## 📋 Índice

- [Ferramentas com Suporte MCP](#ferramentas-com-suporte-mcp)
  - [Claude Desktop](#claude-desktop)
  - [VSCode](#vscode)
  - [Cursor IDE](#cursor-ide)
  - [Cline (Claude Dev)](#cline-claude-dev)
- [Ferramentas via API HTTP](#ferramentas-via-api-http)
  - [ChatGPT (Custom GPT)](#chatgpt-custom-gpt)
  - [Google Gemini](#google-gemini)
  - [Perplexity](#perplexity)
- [Outras Ferramentas](#outras-ferramentas)

---

## 🎯 Ferramentas com Suporte MCP

Estas ferramentas suportam nativamente o Model Context Protocol.

### Claude Desktop

**Configuração Automática:**
```bash
npm run config:claude
```

**Configuração Manual:**

- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux:** `~/.config/claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "pje": {
      "command": "node",
      "args": ["/caminho/instalacao/global/pje-mcp-server/build/index.js"]
    }
  }
}
```

**Teste:**
```
"Liste os comandos PJE disponíveis"
"Configure o PJE do TJCE"
```

📖 [Exemplo completo](../examples/claude_desktop_config_linux.json)

---

### VSCode

**Instalação:**
```bash
# 1. Instale a extensão MCP
code --install-extension anthropics.mcp

# 2. Configure automaticamente
npm run config:vscode
```

**Localização do settings.json:**
- **Windows:** `%APPDATA%\Code\User\settings.json`
- **Mac:** `~/Library/Application Support/Code/User/settings.json`
- **Linux:** `~/.config/Code/User/settings.json`

**Configuração:**
```json
{
  "mcp.servers": {
    "pje": {
      "command": "node",
      "args": ["/caminho/pje-mcp-server/build/index.js"]
    }
  }
}
```

📖 [Exemplo completo](../examples/vscode_settings.json)

---

### Cursor IDE

**Sobre:** Cursor é um fork do VSCode com IA integrada e suporte a MCP via extensão Cline.

**Instalação:**
```bash
# Configure automaticamente
npm run config:cursor
```

**Passos Manuais:**
1. Instale o Cursor: https://cursor.sh
2. Instale a extensão Cline no Cursor
3. Configure via interface da Cline ou arquivo de configuração

**Localização:**
- **Windows:** `%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
- **Mac:** `~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- **Linux:** `~/.config/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

**Configuração:**
```json
{
  "mcpServers": {
    "pje": {
      "command": "node",
      "args": ["/caminho/pje-mcp-server/build/index.js"]
    }
  }
}
```

**Teste:**
1. Abra o Cursor
2. Abra a extensão Cline (barra lateral)
3. Vá em "MCP Servers"
4. O servidor PJE deve aparecer
5. Use: "Liste os comandos PJE disponíveis"

📖 [Exemplo completo](../examples/cursor_mcp_config.json)

---

### Cline (Claude Dev)

**Sobre:** Extensão para VSCode/Cursor que traz o Claude para dentro do editor.

**Instalação:**
```bash
# Para VSCode
code --install-extension saoudrizwan.claude-dev

# Configure automaticamente
npm run config:cline
```

**Configuração:** Mesma do Cursor (acima)

**Teste:**
1. Abra o VSCode/Cursor
2. Clique no ícone da Cline na barra lateral
3. Abra "MCP Servers" nas configurações
4. O servidor PJE estará disponível

📖 [Exemplo completo](../examples/cline_mcp_settings.json)

---

## 🌐 Ferramentas via API HTTP

Para ferramentas que não suportam MCP, use a API HTTP REST.

### Iniciando o Servidor HTTP

```bash
# Inicie o servidor web
npm run start:web

# Por padrão em: http://localhost:3000
```

**Configurar porta no .env:**
```env
WEB_SERVER_PORT=3000
```

---

### ChatGPT (Custom GPT)

**Como configurar:**

1. Acesse: https://chat.openai.com/gpts/editor
2. Crie um novo GPT
3. Vá em "Configure" → "Actions"
4. Importe o schema OpenAPI:

**Opção 1 - Upload do arquivo:**
- Faça upload de `docs/openapi.yaml`

**Opção 2 - Cole o schema:**
```yaml
# Copie o conteúdo de docs/openapi.yaml
```

**Configuração de autenticação:**
- **Tipo:** API Key
- **Header:** `X-API-Key`
- **Valor:** Configure no .env: `API_KEY=sua-chave-secreta`

**Instruções do GPT:**
```
Você é um assistente para consulta de processos judiciais do PJE.

Use as seguintes funções:
- getStatus: Verificar configuração
- listarProcessos: Buscar processos com filtros
- buscarProcesso: Detalhes de um processo específico
- listarOrgaosJulgadores: Listar órgãos julgadores
- listarClasses: Listar classes processuais

Sempre forneça informações de forma clara e organizada.
```

**Teste:**
```
"Liste meus processos do CPF 12345678900"
"Busque o processo 1234567-89.2024.8.06.0001"
"Mostre os órgãos julgadores disponíveis"
```

📖 [Especificação OpenAPI completa](openapi.yaml)

---

### Google Gemini

**Sobre:** Gemini suporta Function Calling para integração com APIs externas.

**Como configurar (Google AI Studio):**

1. Acesse: https://aistudio.google.com
2. Crie um novo chat
3. Adicione "Tools" → "Function calling"

**Configurar função para listar processos:**

```json
{
  "name": "listar_processos_pje",
  "description": "Lista processos judiciais do PJE com filtros",
  "parameters": {
    "type": "object",
    "properties": {
      "cpf": {
        "type": "string",
        "description": "CPF do interessado"
      },
      "dataInicio": {
        "type": "string",
        "description": "Data inicial no formato YYYY-MM-DD"
      },
      "dataFim": {
        "type": "string",
        "description": "Data final no formato YYYY-MM-DD"
      }
    }
  },
  "api_endpoint": "http://localhost:3000/api/processos"
}
```

**Configurar função para buscar processo:**

```json
{
  "name": "buscar_processo_pje",
  "description": "Busca um processo específico pelo número",
  "parameters": {
    "type": "object",
    "properties": {
      "numero": {
        "type": "string",
        "description": "Número do processo"
      }
    },
    "required": ["numero"]
  },
  "api_endpoint": "http://localhost:3000/api/processo/{numero}"
}
```

**Usando via Gemini API (Python):**

```python
import google.generativeai as genai
import requests

genai.configure(api_key='sua-api-key')

# Define a função
def listar_processos_pje(cpf=None, dataInicio=None, dataFim=None):
    params = {}
    if cpf:
        params['cpf'] = cpf
    if dataInicio:
        params['dataInicio'] = dataInicio
    if dataFim:
        params['dataFim'] = dataFim

    response = requests.get(
        'http://localhost:3000/api/processos',
        params=params
    )
    return response.json()

# Registra a função
tools = [{
    'function_declarations': [{
        'name': 'listar_processos_pje',
        'description': 'Lista processos judiciais do PJE',
        'parameters': {
            'type': 'object',
            'properties': {
                'cpf': {'type': 'string'},
                'dataInicio': {'type': 'string'},
                'dataFim': {'type': 'string'}
            }
        }
    }]
}]

model = genai.GenerativeModel('gemini-pro', tools=tools)
chat = model.start_chat()

response = chat.send_message(
    "Liste os processos do CPF 12345678900 de 2024"
)
print(response.text)
```

**Teste:**
```
"Liste processos do CPF 12345678900"
"Busque informações do processo 1234567-89.2024.8.06.0001"
```

---

### Perplexity

**Limitação:** Perplexity não suporta integração direta com APIs customizadas.

**Alternativas:**

1. **Via Zapier/Make:**
   - Configure webhook no Zapier
   - Conecte ao servidor PJE
   - Use comandos via Perplexity

2. **Servidor público:**
   - Exponha o servidor em URL pública
   - Use com ferramentas que Perplexity acessa

3. **Descrição para Perplexity:**
```
Para consultar processos PJE, use a API em http://localhost:3000:

- GET /api/processos?cpf=X - Lista processos
- GET /api/processo/{numero} - Busca processo específico
- GET /api/orgaos-julgadores - Lista órgãos

Exemplos de uso com curl:
curl "http://localhost:3000/api/processos?cpf=12345678900"
```

---

## 🔧 Outras Ferramentas

### Continue.dev

Similar ao Cline, mas com configuração própria.

**Localização:**
`~/.continue/config.json`

**Configuração:**
```json
{
  "mcpServers": {
    "pje": {
      "command": "node",
      "args": ["/caminho/pje-mcp-server/build/index.js"]
    }
  }
}
```

### Zed Editor

Suporte MCP em desenvolvimento.

**Quando disponível:**
```json
{
  "mcp_servers": {
    "pje": {
      "command": "node",
      "args": ["/caminho/pje-mcp-server/build/index.js"]
    }
  }
}
```

### Qualquer IDE com Terminal

Use o servidor HTTP:

```bash
# Terminal 1 - Inicie o servidor
npm run start:web

# Terminal 2 - Use curl/httpie
curl "http://localhost:3000/api/status"
curl "http://localhost:3000/api/processos?cpf=12345678900"
```

---

## 📊 Comparação de Ferramentas

| Ferramenta | Suporte MCP | API HTTP | Configuração | Facilidade |
|------------|-------------|----------|--------------|-----------|
| Claude Desktop | ✅ Nativo | ✅ | Automática | ⭐⭐⭐⭐⭐ |
| VSCode | ✅ Via extensão | ✅ | Automática | ⭐⭐⭐⭐⭐ |
| Cursor | ✅ Via Cline | ✅ | Automática | ⭐⭐⭐⭐⭐ |
| Cline | ✅ Nativo | ✅ | Automática | ⭐⭐⭐⭐⭐ |
| ChatGPT | ❌ | ✅ | Manual | ⭐⭐⭐⭐ |
| Gemini | ❌ | ✅ | Manual | ⭐⭐⭐ |
| Perplexity | ❌ | ⚠️ Limitado | Manual | ⭐⭐ |

---

## 🚀 Configuração Rápida

**Para ferramentas MCP (recomendado):**
```bash
# Claude Desktop
npm run config:claude

# VSCode
npm run config:vscode

# Cursor
npm run config:cursor

# Cline
npm run config:cline
```

**Para ferramentas HTTP:**
```bash
# 1. Inicie o servidor
npm run start:web

# 2. Configure sua ferramenta usando:
# - Arquivo OpenAPI: docs/openapi.yaml
# - Base URL: http://localhost:3000
```

---

## 🔐 Segurança

### Servidor Local (Desenvolvimento)

Por padrão, sem autenticação:
```env
# .env
WEB_SERVER_PORT=3000
```

### Servidor Público (Produção)

**Configure autenticação:**
```env
# .env
API_KEY=sua-chave-super-secreta-aqui
CORS_ORIGIN=https://seu-dominio.com
WEB_SERVER_PORT=3000
```

**Teste com API Key:**
```bash
curl -H "X-API-Key: sua-chave-secreta" \
  "http://localhost:3000/api/status"
```

---

## 📝 Exemplos de Uso

### ChatGPT
```
"Liste meus processos do CPF 12345678900 de 2024"
"Busque detalhes do processo 1234567-89.2024.8.06.0001"
"Quais são os órgãos julgadores disponíveis?"
```

### Gemini
```
"Consulte processos PJE do CPF 12345678900"
"Mostre informações do processo número 1234567-89.2024.8.06.0001"
```

### Cursor/Cline
```
"Liste os comandos PJE disponíveis"
"Configure o PJE para o TJCE"
"Busque meus processos"
```

---

## 🐛 Solução de Problemas

### Ferramentas MCP não reconhecem o servidor

1. **Verifique o caminho:**
   ```bash
   npm root -g
   # O servidor está em: [npm root -g]/pje-mcp-server/build/index.js
   ```

2. **Reconfigure:**
   ```bash
   npm run config:claude  # ou vscode, cursor, cline
   ```

3. **Reinicie a ferramenta completamente**

### API HTTP não responde

1. **Verifique se o servidor está rodando:**
   ```bash
   npm run start:web
   ```

2. **Teste a conexão:**
   ```bash
   curl http://localhost:3000/api/status
   ```

3. **Verifique a porta no .env**

### ChatGPT não consegue acessar a API

**Problema:** ChatGPT só acessa URLs públicas

**Solução:**
1. Use ngrok para expor localhost:
   ```bash
   ngrok http 3000
   ```

2. Use a URL pública do ngrok na configuração do GPT

**Ou:**
1. Hospede o servidor em um serviço cloud
2. Configure o domínio público

---

## 📚 Links Úteis

- [OpenAPI Specification](openapi.yaml)
- [Guia de Instalação Global](INSTALACAO_GLOBAL.md)
- [Exemplos de Configuração](../examples/)
- [Documentação MCP](https://modelcontextprotocol.io)

---

## 💡 Dicas

1. **Use MCP quando possível** - Melhor integração e performance
2. **API HTTP para ferramentas web** - Gemini, ChatGPT, etc
3. **Configure API Key em produção** - Nunca exponha sem autenticação
4. **Use HTTPS em produção** - Segurança é fundamental
5. **Monitore os logs** - Veja o que está acontecendo

---

Desenvolvido com ❤️ para integração universal
