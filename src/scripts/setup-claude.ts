#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface ClaudeConfig {
  mcpServers: {
    [key: string]: {
      command: string;
      args: string[];
      env?: {
        [key: string]: string;
      };
    };
  };
}

function getClaudeConfigPath(): string {
  const platform = os.platform();

  if (platform === 'win32') {
    // Windows: %APPDATA%\Claude\claude_desktop_config.json
    return path.join(process.env.APPDATA || '', 'Claude', 'claude_desktop_config.json');
  } else if (platform === 'darwin') {
    // Mac: ~/Library/Application Support/Claude/claude_desktop_config.json
    return path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  } else {
    // Linux: ~/.config/claude/claude_desktop_config.json
    return path.join(os.homedir(), '.config', 'claude', 'claude_desktop_config.json');
  }
}

function getServerPath(): string {
  // Tenta encontrar o caminho do servidor instalado globalmente
  const globalPath = path.join(
    process.env.npm_config_prefix || '/usr/local',
    'lib',
    'node_modules',
    'pje-mcp-server',
    'build',
    'index.js'
  );

  if (fs.existsSync(globalPath)) {
    return globalPath;
  }

  // Se não encontrou globalmente, usa o caminho local
  return path.join(__dirname, '..', '..', 'build', 'index.js');
}

function setupClaudeDesktop(): void {
  console.log('🔧 Configurando PJE MCP Server no Claude Desktop...\n');

  const configPath = getClaudeConfigPath();
  const configDir = path.dirname(configPath);

  // Cria o diretório se não existir
  if (!fs.existsSync(configDir)) {
    console.log(`📁 Criando diretório: ${configDir}`);
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Lê ou cria a configuração
  let config: ClaudeConfig;

  if (fs.existsSync(configPath)) {
    console.log(`📖 Lendo configuração existente: ${configPath}`);
    const content = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(content);
  } else {
    console.log(`📝 Criando nova configuração: ${configPath}`);
    config = { mcpServers: {} };
  }

  // Adiciona ou atualiza a configuração do PJE MCP Server
  const serverPath = getServerPath();
  console.log(`🔍 Caminho do servidor: ${serverPath}`);

  config.mcpServers['pje'] = {
    command: 'node',
    args: [serverPath],
    env: {
      NODE_ENV: 'production'
    }
  };

  // Salva a configuração
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

  console.log('\n✅ Configuração concluída com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Configure o arquivo .env na raiz do projeto');
  console.log('2. Reinicie o Claude Desktop completamente');
  console.log('3. O servidor PJE estará disponível no Claude\n');
  console.log('💡 Para verificar se funcionou, pergunte ao Claude:');
  console.log('   "Liste os comandos PJE disponíveis"\n');
}

// Executa o setup
try {
  setupClaudeDesktop();
} catch (error) {
  console.error('❌ Erro ao configurar:', error);
  process.exit(1);
}
