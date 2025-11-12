#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface CursorMCPConfig {
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

function getCursorConfigPath(): string {
  const platform = os.platform();

  if (platform === 'win32') {
    // Windows: %APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json
    return path.join(
      process.env.APPDATA || '',
      'Cursor',
      'User',
      'globalStorage',
      'saoudrizwan.claude-dev',
      'settings',
      'cline_mcp_settings.json'
    );
  } else if (platform === 'darwin') {
    // Mac: ~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
    return path.join(
      os.homedir(),
      'Library',
      'Application Support',
      'Cursor',
      'User',
      'globalStorage',
      'saoudrizwan.claude-dev',
      'settings',
      'cline_mcp_settings.json'
    );
  } else {
    // Linux: ~/.config/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
    return path.join(
      os.homedir(),
      '.config',
      'Cursor',
      'User',
      'globalStorage',
      'saoudrizwan.claude-dev',
      'settings',
      'cline_mcp_settings.json'
    );
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

function setupCursor(): void {
  console.log('🔧 Configurando PJE MCP Server no Cursor IDE...\n');

  const configPath = getCursorConfigPath();
  const configDir = path.dirname(configPath);

  // Verifica se o diretório do Cursor existe
  const cursorDir = path.dirname(path.dirname(path.dirname(path.dirname(configDir))));
  if (!fs.existsSync(cursorDir)) {
    console.log('⚠️  Cursor IDE não encontrado!');
    console.log('   Por favor, instale o Cursor IDE primeiro: https://cursor.sh\n');
    process.exit(1);
  }

  // Cria o diretório de configuração se não existir
  if (!fs.existsSync(configDir)) {
    console.log(`📁 Criando diretório de configuração: ${configDir}`);
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Lê ou cria a configuração
  let config: CursorMCPConfig;

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
  console.log('1. Instale a extensão Cline no Cursor (se ainda não tiver):');
  console.log('   - Abra o Cursor');
  console.log('   - Vá em Extensions (Ctrl+Shift+X)');
  console.log('   - Procure por "Cline" (saoudrizwan.claude-dev)');
  console.log('   - Clique em Install');
  console.log('\n2. Configure o arquivo .env na raiz do projeto');
  console.log('3. Reinicie o Cursor completamente');
  console.log('4. Abra a extensão Cline');
  console.log('5. O servidor PJE estará disponível em MCP Servers\n');
  console.log('💡 Para verificar se funcionou, use a Cline para:');
  console.log('   "Liste os comandos PJE disponíveis"\n');
}

// Executa o setup
try {
  setupCursor();
} catch (error) {
  console.error('❌ Erro ao configurar:', error);
  process.exit(1);
}
