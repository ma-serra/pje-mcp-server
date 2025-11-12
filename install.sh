#!/bin/bash

# Script de instalação global do PJE MCP Server para Linux/Mac

set -e

echo "🚀 Instalando PJE MCP Server globalmente..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verifica se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado!"
    echo "   Instale em: https://nodejs.org/"
    exit 1
fi

# Verifica se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado!"
    exit 1
fi

echo -e "${BLUE}📦 Instalando dependências...${NC}"
npm install

echo ""
echo -e "${BLUE}🔨 Compilando o projeto...${NC}"
npm run build

echo ""
echo -e "${BLUE}🌍 Instalando globalmente...${NC}"
npm install -g .

echo ""
echo -e "${GREEN}✅ Instalação concluída com sucesso!${NC}"
echo ""

# Pergunta se deseja configurar automaticamente
read -p "Deseja configurar automaticamente o Claude Desktop? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo -e "${BLUE}🔧 Configurando Claude Desktop...${NC}"
    npm run config:claude
fi

echo ""
read -p "Deseja configurar automaticamente o VSCode? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo -e "${BLUE}🔧 Configurando VSCode...${NC}"
    npm run config:vscode
fi

echo ""
echo -e "${GREEN}🎉 Tudo pronto!${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "1. Configure o arquivo .env com suas credenciais:"
echo "   cp .env.example .env"
echo "   nano .env"
echo ""
echo "2. Reinicie o Claude Desktop ou VSCode"
echo ""
echo "3. Teste o servidor:"
echo '   Pergunte ao Claude: "Liste os comandos PJE disponíveis"'
echo ""
echo -e "${BLUE}💡 Comandos úteis:${NC}"
echo "   npm run config:claude  - Reconfigurar Claude Desktop"
echo "   npm run config:vscode  - Reconfigurar VSCode"
echo "   npm uninstall -g pje-mcp-server  - Desinstalar"
echo ""
