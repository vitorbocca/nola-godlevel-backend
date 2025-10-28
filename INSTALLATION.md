# 🚀 Guia de Instalação e Execução

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 14 ou superior) - [Download aqui](https://nodejs.org/)
- **PostgreSQL** (versão 12 ou superior) - [Download aqui](https://www.postgresql.org/download/)
- **npm** ou **yarn** (vem com Node.js)

## 🛠️ Instalação Passo a Passo

### 1. Clone o Repositório
```bash
git clone <repository-url>
cd nola-godlevel-backend
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure o Banco de Dados PostgreSQL

#### 3.1. Crie o Banco de Dados
```sql
-- Conecte-se ao PostgreSQL como superusuário
psql -U postgres

-- Crie o banco de dados
CREATE DATABASE challenge_db;

-- Crie o usuário específico
CREATE USER challenge WITH PASSWORD 'challenge_2024';
GRANT ALL PRIVILEGES ON DATABASE challenge_db TO challenge;
```

#### 3.2. Execute o Script SQL
```bash
# Execute o script de criação das tabelas
psql -U challenge -d challenge_db -f database.sql
```

### 4. Configure as Variáveis de Ambiente

#### 4.1. Copie o arquivo de exemplo
```bash
cp env.example .env
```

#### 4.2. Edite o arquivo `.env` com suas configurações:
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
JWT_SECRET=sua-chave-secreta-aqui
API_RATE_LIMIT=100
```

## 🚀 Executando o Projeto

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

### Testes
```bash
npm test
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## 🔍 Verificando se Está Funcionando

### 1. Teste de Conexão com Banco
```bash
# Execute o script de teste de conexão
node test-connection.js
```

### 2. Health Check
```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "success": true,
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

### 2. Informações da API
```bash
curl http://localhost:3000/
```

### 3. Teste das Métricas do Dashboard
```bash
curl http://localhost:3000/api/dashboard/metrics
```

## 🐛 Solução de Problemas

### Erro de Conexão com Banco de Dados
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Soluções:**
1. Verifique se o PostgreSQL está rodando:
   ```bash
   # Windows
   net start postgresql
   
   # Linux/Mac
   sudo systemctl start postgresql
   ```

2. Verifique as configurações no arquivo `.env`
3. Teste a conexão manualmente:
   ```bash
   psql -U postgres -h localhost -p 5432
   ```

### Erro de Porta em Uso
```
Error: listen EADDRINUSE :::3000
```

**Soluções:**
1. Mude a porta no arquivo `.env`:
   ```env
   PORT=3001
   ```

2. Ou mate o processo que está usando a porta:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:3000 | xargs kill -9
   ```

### Erro de Dependências
```
npm ERR! peer dep missing
```

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📊 Testando a API

### Usando cURL
```bash
# Métricas gerais
curl http://localhost:3000/api/dashboard/metrics

# Ticket médio
curl http://localhost:3000/api/dashboard/average-ticket

# Produtos mais vendidos
curl http://localhost:3000/api/dashboard/top-products
```

### Usando Postman
1. Importe a coleção de testes (se disponível)
2. Configure a URL base: `http://localhost:3000`
3. Teste os endpoints principais

### Usando Insomnia
1. Crie um novo projeto
2. Configure a URL base: `http://localhost:3000`
3. Teste os endpoints

## 🔧 Configurações Avançadas

### Variáveis de Ambiente para Produção
```env
NODE_ENV=production
PORT=3000
DB_HOST=seu-host-producao
DB_PORT=5432
DB_NAME=nola_godlevel_prod
DB_USER=usuario_producao
DB_PASSWORD=senha_segura_producao
JWT_SECRET=chave-super-secreta-producao
API_RATE_LIMIT=1000
```

### Configuração de Proxy Reverso (Nginx)
```nginx
server {
    listen 80;
    server_name api.seudominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📈 Monitoramento

### Logs
Os logs são exibidos no console. Para produção, considere usar:
- **Winston** para logging estruturado
- **Morgan** para logs de HTTP
- **PM2** para gerenciamento de processos

### Métricas
- Health check: `GET /health`
- Rate limiting: Configurado para 100 req/15min por IP
- CORS: Habilitado para todas as origens (configure para produção)

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do console
2. Teste a conexão com o banco de dados
3. Verifique as variáveis de ambiente
4. Consulte a documentação da API
5. Abra uma issue no repositório

## 📚 Próximos Passos

Após a instalação bem-sucedida:

1. Leia o `README.md` para entender a API
2. Consulte `API_EXAMPLES.md` para exemplos de uso
3. Execute os testes: `npm test`
4. Explore os endpoints disponíveis
5. Configure seu frontend para consumir a API
