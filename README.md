# NOLA GodLevel Backend

Backend API para dashboard de vendas desenvolvido com Node.js, Express e PostgreSQL.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **Joi** - Validação de dados
- **Moment.js** - Manipulação de datas
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Express Rate Limit** - Limitação de taxa

## 📋 Pré-requisitos

- **Node.js (versão 14 ou superior)** - [Download aqui](https://nodejs.org/)
- **PostgreSQL (versão 12 ou superior)** - [Download aqui](https://www.postgresql.org/download/)
- **npm** (vem com Node.js)

> ⚠️ **IMPORTANTE:** Se você receber erro "node não é reconhecido", instale o Node.js primeiro e reinicie o terminal.

## 🚀 Início Rápido

### Scripts Automatizados
```bash
# Linux/Mac
./setup.sh

# Windows
setup.bat
```

### Instalação Manual

1. Clone o repositório:
```bash
git clone <repository-url>
cd nola-godlevel-backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
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

4. Configure o banco de dados PostgreSQL:
```sql
-- Execute o script SQL fornecido para criar as tabelas
```

5. Execute o projeto:
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📁 Arquivos de Configuração

- **`.env`** - Variáveis de ambiente (criar a partir de `env.example`)
- **`database.sql`** - Script de criação das tabelas
- **`test-connection.js`** - Teste de conexão com banco
- **`setup.sh`** / **`setup.bat`** - Scripts de instalação automática
- **`QUICK_START.md`** - Guia rápido de instalação

## 📚 Documentação da API

### Swagger UI
A documentação interativa da API está disponível em:
**🔗 http://localhost:3000/api-docs**

### Documentação Completa
- **`SWAGGER_DOCS.md`** - Guia completo do Swagger
- **`API_EXAMPLES.md`** - Exemplos de uso da API
- **`README.md`** - Este arquivo

### Dashboard Metrics

#### `GET /api/dashboard/metrics`
Retorna todas as métricas do dashboard em uma única requisição.

**Query Parameters:**
- `store_id` (opcional): ID da loja
- `sub_brand_id` (opcional): ID da sub-marca
- `date_from` (opcional): Data inicial (YYYY-MM-DD)
- `date_to` (opcional): Data final (YYYY-MM-DD)

#### `GET /api/dashboard/average-ticket`
Retorna o ticket médio do período.

#### `GET /api/dashboard/top-products`
Retorna os produtos mais vendidos.

#### `GET /api/dashboard/revenue-by-hour`
Retorna o faturamento por hora do dia.

#### `GET /api/dashboard/revenue-by-day`
Retorna o faturamento por dia da semana.

#### `GET /api/dashboard/sales-by-channel`
Retorna vendas por canal (Presencial vs Delivery).

#### `GET /api/dashboard/period-comparison`
Compara métricas com o período anterior.

### Sales

#### `GET /api/sales`
Lista vendas com filtros.

#### `GET /api/sales/:id`
Busca venda por ID.

#### `POST /api/sales`
Cria nova venda.

#### `GET /api/sales/summary`
Resumo de vendas.

### Products

#### `GET /api/products`
Lista produtos com filtros.

#### `GET /api/products/:id`
Busca produto por ID.

#### `POST /api/products`
Cria novo produto.

#### `PUT /api/products/:id`
Atualiza produto.

#### `DELETE /api/products/:id`
Deleta produto (soft delete).

#### `GET /api/products/analytics/top-selling`
Produtos mais vendidos.

### Stores

#### `GET /api/stores`
Lista lojas com filtros.

#### `GET /api/stores/:id`
Busca loja por ID.

#### `POST /api/stores`
Cria nova loja.

#### `PUT /api/stores/:id`
Atualiza loja.

#### `DELETE /api/stores/:id`
Deleta loja.

#### `GET /api/stores/brands/list`
Lista marcas.

#### `GET /api/stores/sub-brands/list`
Lista sub-marcas.

## 🔧 Estrutura do Projeto

```
src/
├── config/
│   └── database.js          # Configuração do banco
├── middleware/
│   └── validation.js       # Middlewares de validação
├── models/
│   ├── Brand.js            # Modelo de marca
│   ├── SubBrand.js         # Modelo de sub-marca
│   ├── Store.js            # Modelo de loja
│   ├── Sale.js             # Modelo de venda
│   └── Product.js          # Modelo de produto
├── routes/
│   ├── dashboard.js        # Rotas do dashboard
│   ├── sales.js           # Rotas de vendas
│   ├── products.js        # Rotas de produtos
│   └── stores.js          # Rotas de lojas
├── services/
│   └── DashboardService.js # Serviços do dashboard
└── server.js               # Servidor principal
```

## 📈 Métricas Disponíveis

### Ticket Médio
- Valor médio das vendas
- Total de vendas
- Receita total

### Produtos Mais Vendidos
- Quantidade vendida
- Receita gerada
- Número de vendas
- Preço médio

### Faturamento por Hora
- Vendas por hora do dia
- Receita por hora
- Ticket médio por hora

### Faturamento por Dia da Semana
- Vendas por dia da semana
- Receita por dia
- Ticket médio por dia

### Vendas por Canal
- Comparação Presencial vs Delivery
- Receita por canal
- Taxa de entrega

### Comparação de Períodos
- Crescimento de receita
- Crescimento de vendas
- Variação do ticket médio

## 🔒 Segurança

- Rate limiting (100 requests/15min por IP)
- Validação de entrada com Joi
- Headers de segurança com Helmet
- CORS configurado
- Tratamento de erros padronizado

## 🧪 Testes

```bash
npm test
```

## 📝 Scripts Disponíveis

- `npm start` - Executa em produção
- `npm run dev` - Executa em desenvolvimento com nodemon
- `npm test` - Executa testes

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.
