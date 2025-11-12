@echo off
REM Script de instalação global do PJE MCP Server para Windows

echo.
echo ===================================
echo  PJE MCP Server - Instalacao Global
echo ===================================
echo.

REM Verifica se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao esta instalado!
    echo        Instale em: https://nodejs.org/
    pause
    exit /b 1
)

REM Verifica se npm está instalado
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] npm nao esta instalado!
    pause
    exit /b 1
)

echo [1/4] Instalando dependencias...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar dependencias
    pause
    exit /b 1
)

echo.
echo [2/4] Compilando o projeto...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao compilar o projeto
    pause
    exit /b 1
)

echo.
echo [3/4] Instalando globalmente...
call npm install -g .
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar globalmente
    echo        Tente executar como Administrador
    pause
    exit /b 1
)

echo.
echo [4/4] Configuracao automatica...
echo.

REM Pergunta se deseja configurar Claude Desktop
set /p CLAUDE_CONFIG="Deseja configurar automaticamente o Claude Desktop? (S/N): "
if /i "%CLAUDE_CONFIG%"=="S" (
    echo.
    echo Configurando Claude Desktop...
    call npm run config:claude
)

echo.
REM Pergunta se deseja configurar VSCode
set /p VSCODE_CONFIG="Deseja configurar automaticamente o VSCode? (S/N): "
if /i "%VSCODE_CONFIG%"=="S" (
    echo.
    echo Configurando VSCode...
    call npm run config:vscode
)

echo.
echo ===================================
echo  Instalacao concluida com sucesso!
echo ===================================
echo.
echo Proximos passos:
echo 1. Configure o arquivo .env com suas credenciais
echo 2. Reinicie o Claude Desktop ou VSCode
echo 3. Teste perguntando: "Liste os comandos PJE disponiveis"
echo.
echo Comandos uteis:
echo   npm run config:claude  - Reconfigurar Claude Desktop
echo   npm run config:vscode  - Reconfigurar VSCode
echo   npm uninstall -g pje-mcp-server  - Desinstalar
echo.
pause
