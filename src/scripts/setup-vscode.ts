#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface VSCodeSettings {
  'mcp.servers'?: {
    [key: string]: {
      command: string;
      args: string[];
      env?: {
        [key: string]: string;
      };
    };
  };
  [key: string]: any;
}

function getVSCodeSettingsPath(): string {
  const platform = os.platform();

  if (platform === 'win32') {
    // Windows: %APPDATA%\Code\User\settings.json
    return path.join(process.env.APPDATA || '', 'Code', 'User', 'settings.json');
  } else if (platform === 'darwin') {
    // Mac: ~/Library/Application Support/Code/User/settings.json
    return path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'User', 'settings.json');
  } else {
    // Linux: ~/.config/Code/User/settings.json
    return path.join(os.homedir(), '.config', 'Code', 'User', 'settings.json');
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

function setupVSCode(): void {
  console.log('🔧 Configurando PJE MCP Server no VSCode...\n');

  const settingsPath = getVSCodeSettingsPath();
  const settingsDir = path.dirname(settingsPath);

  // Cria o diretório se não existir
  if (!fs.existsSync(settingsDir)) {
    console.log(`📁 Criando diretório: ${settingsDir}`);
    fs.mkdirSync(settingsDir, { recursive: true });
  }

  // Lê ou cria a configuração
  let settings: VSCodeSettings;

  if (fs.existsSync(settingsPath)) {
    console.log(`📖 Lendo configuração existente: ${settingsPath}`);
    const content = fs.readFileSync(settingsPath, 'utf8');
    settings = JSON.parse(content);
  } else {
    console.log(`📝 Criando nova configuração: ${settingsPath}`);
    settings = {};
  }

  // Inicializa mcp.servers se não existir
  if (!settings['mcp.servers']) {
    settings['mcp.servers'] = {};
  }

  // Adiciona ou atualiza a configuração do PJE MCP Server
  const serverPath = getServerPath();
  console.log(`🔍 Caminho do servidor: ${serverPath}`);

  settings['mcp.servers']['pje'] = {
    command: 'node',
    args: [serverPath],
    env: {
      NODE_ENV: 'production'
    }
  };

  // Salva a configuração
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');

  console.log('\n✅ Configuração concluída com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Instale a extensão MCP no VSCode (se ainda não tiver)');
  console.log('2. Configure o arquivo .env na raiz do projeto');
  console.log('3. Reinicie o VSCode');
  console.log('4. O servidor PJE estará disponível\n');
  console.log('💡 Para instalar a extensão MCP:');
  console.log('   code --install-extension anthropics.mcp\n');
}

// Executa o setup
try {
  setupVSCode();
} catch (error) {
  console.error('❌ Erro ao configurar:', error);
  process.exit(1);
}
