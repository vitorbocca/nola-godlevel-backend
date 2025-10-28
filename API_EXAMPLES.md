# Exemplos de Uso da API

## Configuração Inicial

1. Configure o arquivo `.env` com suas credenciais do banco de dados
2. Execute o script `database.sql` no PostgreSQL
3. Inicie o servidor: `npm run dev`

## Exemplos de Requisições

### 1. Métricas Gerais do Dashboard

```bash
# Todas as métricas de uma vez
curl -X GET "http://localhost:3000/api/dashboard/metrics"

# Métricas filtradas por loja
curl -X GET "http://localhost:3000/api/dashboard/metrics?store_id=1"

# Métricas filtradas por período
curl -X GET "http://localhost:3000/api/dashboard/metrics?date_from=2024-01-01&date_to=2024-01-31"
```

### 2. Ticket Médio

```bash
# Ticket médio geral
curl -X GET "http://localhost:3000/api/dashboard/average-ticket"

# Ticket médio por loja
curl -X GET "http://localhost:3000/api/dashboard/average-ticket?store_id=1"

# Ticket médio por período
curl -X GET "http://localhost:3000/api/dashboard/average-ticket?date_from=2024-01-01&date_to=2024-01-31"
```

### 3. Produtos Mais Vendidos

```bash
# Top 10 produtos mais vendidos
curl -X GET "http://localhost:3000/api/dashboard/top-products"

# Produtos mais vendidos por loja
curl -X GET "http://localhost:3000/api/dashboard/top-products?store_id=1"

# Produtos mais vendidos por período
curl -X GET "http://localhost:3000/api/dashboard/top-products?date_from=2024-01-01&date_to=2024-01-31"
```

### 4. Faturamento por Hora

```bash
# Faturamento por hora do dia
curl -X GET "http://localhost:3000/api/dashboard/revenue-by-hour"

# Faturamento por hora filtrado por loja
curl -X GET "http://localhost:3000/api/dashboard/revenue-by-hour?store_id=1"
```

### 5. Faturamento por Dia da Semana

```bash
# Faturamento por dia da semana
curl -X GET "http://localhost:3000/api/dashboard/revenue-by-day"

# Faturamento por dia filtrado por loja
curl -X GET "http://localhost:3000/api/dashboard/revenue-by-day?store_id=1"
```

### 6. Vendas por Canal

```bash
# Comparação Presencial vs Delivery
curl -X GET "http://localhost:3000/api/dashboard/sales-by-channel"

# Vendas por canal filtradas por loja
curl -X GET "http://localhost:3000/api/dashboard/sales-by-channel?store_id=1"
```

### 7. Comparação de Períodos

```bash
# Comparação com período anterior
curl -X GET "http://localhost:3000/api/dashboard/period-comparison"

# Comparação filtrada por loja
curl -X GET "http://localhost:3000/api/dashboard/period-comparison?store_id=1"
```

### 8. Gerenciamento de Vendas

```bash
# Listar vendas
curl -X GET "http://localhost:3000/api/sales"

# Buscar venda por ID
curl -X GET "http://localhost:3000/api/sales/1"

# Criar nova venda
curl -X POST "http://localhost:3000/api/sales" \
  -H "Content-Type: application/json" \
  -d '{
    "store_id": 1,
    "channel_id": 1,
    "customer_name": "João Silva",
    "sale_status_desc": "Finalizada",
    "total_amount_items": 25.50,
    "total_amount": 25.50,
    "value_paid": 25.50
  }'

# Resumo de vendas
curl -X GET "http://localhost:3000/api/sales/summary"
```

### 9. Gerenciamento de Produtos

```bash
# Listar produtos
curl -X GET "http://localhost:3000/api/products"

# Buscar produto por ID
curl -X GET "http://localhost:3000/api/products/1"

# Criar novo produto
curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "brand_id": 1,
    "sub_brand_id": 1,
    "category_id": 1,
    "name": "Big Mac"
  }'

# Atualizar produto
curl -X PUT "http://localhost:3000/api/products/1" \
  -H "Content-Type: application/json" \
  -d '{
    "brand_id": 1,
    "sub_brand_id": 1,
    "category_id": 1,
    "name": "Big Mac Atualizado"
  }'

# Deletar produto
curl -X DELETE "http://localhost:3000/api/products/1"

# Produtos mais vendidos
curl -X GET "http://localhost:3000/api/products/analytics/top-selling"
```

### 10. Gerenciamento de Lojas

```bash
# Listar lojas
curl -X GET "http://localhost:3000/api/stores"

# Buscar loja por ID
curl -X GET "http://localhost:3000/api/stores/1"

# Criar nova loja
curl -X POST "http://localhost:3000/api/stores" \
  -H "Content-Type: application/json" \
  -d '{
    "brand_id": 1,
    "sub_brand_id": 1,
    "name": "Nova Loja",
    "city": "São Paulo",
    "state": "SP",
    "district": "Centro",
    "is_active": true
  }'

# Atualizar loja
curl -X PUT "http://localhost:3000/api/stores/1" \
  -H "Content-Type: application/json" \
  -d '{
    "brand_id": 1,
    "sub_brand_id": 1,
    "name": "Loja Atualizada",
    "city": "São Paulo",
    "state": "SP",
    "district": "Centro",
    "is_active": true
  }'

# Deletar loja
curl -X DELETE "http://localhost:3000/api/stores/1"

# Listar marcas
curl -X GET "http://localhost:3000/api/stores/brands/list"

# Listar sub-marcas
curl -X GET "http://localhost:3000/api/stores/sub-brands/list"

# Listar sub-marcas por marca
curl -X GET "http://localhost:3000/api/stores/sub-brands/list?brand_id=1"
```

### 11. Health Check

```bash
# Verificar status da API
curl -X GET "http://localhost:3000/health"
```

## Exemplos de Respostas

### Métricas do Dashboard
```json
{
  "success": true,
  "data": {
    "averageTicket": {
      "average_ticket": "25.50",
      "total_sales": 150,
      "total_revenue": "3825.00"
    },
    "topProducts": [
      {
        "id": 1,
        "product_name": "Big Mac",
        "total_quantity_sold": 50,
        "total_revenue": "1275.00",
        "total_sales_count": 45,
        "average_price": "25.50"
      }
    ],
    "revenueByHour": [
      {
        "hour": 12,
        "sales_count": 15,
        "total_revenue": "382.50",
        "average_ticket": "25.50"
      }
    ],
    "revenueByDay": [
      {
        "day_of_week": 1,
        "day_name": "Segunda",
        "sales_count": 20,
        "total_revenue": "510.00",
        "average_ticket": "25.50"
      }
    ],
    "salesByChannel": [
      {
        "channel_id": 1,
        "channel_name": "Presencial",
        "channel_type": "P",
        "sales_count": 100,
        "total_revenue": "2550.00",
        "average_ticket": "25.50",
        "total_delivery_fees": "0.00"
      }
    ]
  }
}
```

### Comparação de Períodos
```json
{
  "success": true,
  "data": {
    "current": {
      "average_ticket": "25.50",
      "total_sales": 150,
      "total_revenue": "3825.00"
    },
    "previous": {
      "average_ticket": "24.00",
      "total_sales": 120,
      "total_revenue": "2880.00"
    },
    "growth": {
      "revenue": 945.00,
      "revenue_percentage": 32.81,
      "sales_count": 30,
      "sales_percentage": 25.00,
      "average_ticket": 1.50,
      "ticket_percentage": 6.25
    }
  }
}
```

## Filtros Disponíveis

### Parâmetros de Filtro Comuns
- `store_id`: ID da loja
- `sub_brand_id`: ID da sub-marca
- `brand_id`: ID da marca
- `date_from`: Data inicial (YYYY-MM-DD)
- `date_to`: Data final (YYYY-MM-DD)
- `limit`: Limite de resultados (1-100)

### Exemplos de Combinação de Filtros
```bash
# Métricas de uma loja específica em um período
curl -X GET "http://localhost:3000/api/dashboard/metrics?store_id=1&date_from=2024-01-01&date_to=2024-01-31"

# Produtos mais vendidos de uma sub-marca
curl -X GET "http://localhost:3000/api/dashboard/top-products?sub_brand_id=1&limit=5"

# Faturamento por hora de uma loja em um período específico
curl -X GET "http://localhost:3000/api/dashboard/revenue-by-hour?store_id=1&date_from=2024-01-01&date_to=2024-01-31"
```

