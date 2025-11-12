#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface ClineMCPConfig {
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

function getClineConfigPath(): string {
  const platform = os.platform();

  if (platform === 'win32') {
    // Windows: %APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json
    return path.join(
      process.env.APPDATA || '',
      'Code',
      'User',
      'globalStorage',
      'saoudrizwan.claude-dev',
      'settings',
      'cline_mcp_settings.json'
    );
  } else if (platform === 'darwin') {
    // Mac: ~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
    return path.join(
      os.homedir(),
      'Library',
      'Application Support',
      'Code',
      'User',
      'globalStorage',
      'saoudrizwan.claude-dev',
      'settings',
      'cline_mcp_settings.json'
    );
  } else {
    // Linux: ~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
    return path.join(
      os.homedir(),
      '.config',
      'Code',
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

function setupCline(): void {
  console.log('🔧 Configurando PJE MCP Server no Cline (VSCode)...\n');

  const configPath = getClineConfigPath();
  const configDir = path.dirname(configPath);

  // Verifica se o VSCode existe
  const vscodeDir = path.dirname(path.dirname(path.dirname(path.dirname(configDir))));
  if (!fs.existsSync(vscodeDir)) {
    console.log('⚠️  VSCode não encontrado!');
    console.log('   Por favor, instale o VSCode primeiro: https://code.visualstudio.com\n');
    console.log('   Ou use o Cursor: https://cursor.sh\n');
    process.exit(1);
  }

  // Cria o diretório de configuração se não existir
  if (!fs.existsSync(configDir)) {
    console.log(`📁 Criando diretório de configuração: ${configDir}`);
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Lê ou cria a configuração
  let config: ClineMCPConfig;

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
  console.log('1. Instale a extensão Cline no VSCode (se ainda não tiver):');
  console.log('   code --install-extension saoudrizwan.claude-dev');
  console.log('\n2. Configure o arquivo .env na raiz do projeto');
  console.log('3. Reinicie o VSCode');
  console.log('4. Abra a extensão Cline (ícone na barra lateral)');
  console.log('5. O servidor PJE estará disponível em MCP Servers\n');
  console.log('💡 Para verificar se funcionou, use a Cline para:');
  console.log('   "Liste os comandos PJE disponíveis"\n');
  console.log('💡 Configuração também vale para Cursor IDE!');
}

// Executa o setup
try {
  setupCline();
} catch (error) {
  console.error('❌ Erro ao configurar:', error);
  process.exit(1);
}
