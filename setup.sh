#!/bin/bash

echo "🚀 Inicializando NOLA GodLevel Backend..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm encontrados"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo "✅ Dependências instaladas com sucesso"

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.example .env
    echo "✅ Arquivo .env criado. Configure as credenciais do banco de dados."
else
    echo "✅ Arquivo .env já existe"
fi

# Testar conexão com banco
echo "🔍 Testando conexão com banco de dados..."
node test-connection.js

if [ $? -eq 0 ]; then
    echo "✅ Conexão com banco de dados OK"
else
    echo "⚠️  Problema na conexão com banco de dados"
    echo "💡 Verifique se:"
    echo "   - O PostgreSQL está rodando"
    echo "   - O banco 'challenge_db' existe"
    echo "   - As credenciais no .env estão corretas"
fi

echo ""
echo "🎉 Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o arquivo .env com suas credenciais"
echo "2. Execute o script database.sql no PostgreSQL"
echo "3. Inicie o servidor: npm run dev"
echo "4. Teste a API: curl http://localhost:3000/health"
echo ""
echo "📚 Documentação disponível em:"
echo "   - README.md"
echo "   - INSTALLATION.md"
echo "   - API_EXAMPLES.md"

