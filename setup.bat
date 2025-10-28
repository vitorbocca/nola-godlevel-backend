@echo off
echo 🚀 Inicializando NOLA GodLevel Backend...

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não está instalado. Por favor, instale o Node.js primeiro.
    pause
    exit /b 1
)

REM Verificar se npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm não está instalado. Por favor, instale o npm primeiro.
    pause
    exit /b 1
)

echo ✅ Node.js e npm encontrados

REM Instalar dependências
echo 📦 Instalando dependências...
npm install

if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)

echo ✅ Dependências instaladas com sucesso

REM Criar arquivo .env se não existir
if not exist .env (
    echo 📝 Criando arquivo .env...
    copy env.example .env
    echo ✅ Arquivo .env criado. Configure as credenciais do banco de dados.
) else (
    echo ✅ Arquivo .env já existe
)

REM Testar conexão com banco
echo 🔍 Testando conexão com banco de dados...
node test-connection.js

if %errorlevel% equ 0 (
    echo ✅ Conexão com banco de dados OK
) else (
    echo ⚠️  Problema na conexão com banco de dados
    echo 💡 Verifique se:
    echo    - O PostgreSQL está rodando
    echo    - O banco 'challenge_db' existe
    echo    - As credenciais no .env estão corretas
)

echo.
echo 🎉 Setup concluído!
echo.
echo 📋 Próximos passos:
echo 1. Configure o arquivo .env com suas credenciais
echo 2. Execute o script database.sql no PostgreSQL
echo 3. Inicie o servidor: npm run dev
echo 4. Teste a API: curl http://localhost:3000/health
echo.
echo 📚 Documentação disponível em:
echo    - README.md
echo    - INSTALLATION.md
echo    - API_EXAMPLES.md

pause

