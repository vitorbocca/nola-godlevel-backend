# 🚀 Guia de Instalação Completo - NOLA GodLevel Backend

## ⚠️ Pré-requisitos Obrigatórios

### 1. Instalar Node.js
**IMPORTANTE:** O Node.js não está instalado no sistema. Siga estes passos:

#### Windows:
1. Acesse: https://nodejs.org/
2. Baixe a versão LTS (recomendada)
3. Execute o instalador
4. Reinicie o terminal/PowerShell
5. Verifique a instalação:
   ```bash
   node --version
   npm --version
   ```

#### Alternativa via Chocolatey (Windows):
```bash
# Instalar Chocolatey primeiro (se não tiver)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Instalar Node.js
choco install nodejs
```

### 2. Instalar PostgreSQL
**IMPORTANTE:** Certifique-se de que o PostgreSQL está instalado e rodando.

#### Windows:
1. Baixe do site oficial: https://www.postgresql.org/download/windows/
2. Instale com as configurações padrão
3. Anote a senha do usuário postgres
4. Verifique se está rodando:
   ```bash
   # No Windows, verifique os serviços
   services.msc
   # Procure por "postgresql" e certifique-se que está "Em execução"
   ```

## 🛠️ Configuração do Projeto

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados

#### 2.1. Criar Banco e Usuário
```sql
-- Conecte-se ao PostgreSQL como superusuário
psql -U postgres

-- Crie o banco de dados
CREATE DATABASE challenge_db;

-- Crie o usuário específico
CREATE USER challenge WITH PASSWORD 'challenge_2024';
GRANT ALL PRIVILEGES ON DATABASE challenge_db TO challenge;

-- Saia do psql
\q
```

#### 2.2. Executar Script SQL
```bash
# Execute o script de criação das tabelas
psql -U challenge -d challenge_db -f database.sql
```

### 3. Configurar Variáveis de Ambiente

#### 3.1. Criar arquivo .env
```bash
# Copie o arquivo de exemplo
copy env.example .env
```

#### 3.2. Editar .env com as credenciais:
```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
POSTGRES_DB=challenge_db
POSTGRES_USER=challenge
POSTGRES_PASSWORD=challenge_2024

# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações de Segurança
JWT_SECRET=your-secret-key-here
API_RATE_LIMIT=100
```

## 🚀 Executando o Projeto

### 1. Testar Conexão
```bash
node test-connection.js
```

### 2. Iniciar Servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

### 3. Testar API
```bash
# Health check
curl http://localhost:3000/health

# Métricas do dashboard
curl http://localhost:3000/api/dashboard/metrics
```

## 🔧 Solução de Problemas

### Erro: "node não é reconhecido"
**Solução:**
1. Reinstale o Node.js
2. Reinicie o terminal
3. Verifique se está no PATH:
   ```bash
   echo $env:PATH
   ```

### Erro: "psql não é reconhecido"
**Solução:**
1. Adicione PostgreSQL ao PATH:
   ```
   C:\Program Files\PostgreSQL\15\bin
   ```
2. Ou use o caminho completo:
   ```bash
   "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres
   ```

### Erro de Conexão com Banco
**Soluções:**
1. Verifique se PostgreSQL está rodando
2. Confirme as credenciais no .env
3. Teste conexão manual:
   ```bash
   psql -U challenge -d challenge_db -h localhost
   ```

## 📋 Checklist de Instalação

- [ ] Node.js instalado e funcionando
- [ ] PostgreSQL instalado e rodando
- [ ] Banco `challenge_db` criado
- [ ] Usuário `challenge` criado
- [ ] Script `database.sql` executado
- [ ] Arquivo `.env` configurado
- [ ] Dependências instaladas (`npm install`)
- [ ] Conexão testada (`node test-connection.js`)
- [ ] Servidor iniciado (`npm run dev`)
- [ ] API testada (`curl http://localhost:3000/health`)

## 🎯 Comandos Rápidos

```bash
# Instalar tudo de uma vez (após instalar Node.js)
npm install && node test-connection.js && npm run dev

# Testar apenas a conexão
node test-connection.js

# Iniciar em modo desenvolvimento
npm run dev

# Executar testes
npm test

# Verificar linting
npm run lint
```

## 📞 Suporte

Se encontrar problemas:

1. **Node.js não instalado:** Siga o passo 1 dos pré-requisitos
2. **PostgreSQL não instalado:** Siga o passo 2 dos pré-requisitos
3. **Erro de conexão:** Verifique credenciais e status do PostgreSQL
4. **Erro de dependências:** Execute `npm install` novamente

## 📚 Documentação Adicional

- `README.md` - Visão geral do projeto
- `INSTALLATION.md` - Guia detalhado de instalação
- `API_EXAMPLES.md` - Exemplos de uso da API
- `database.sql` - Script de criação das tabelas

