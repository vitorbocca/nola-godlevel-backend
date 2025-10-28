# 📚 Documentação da API - Swagger

## 🎯 Acesso à Documentação

A documentação completa da API está disponível através do Swagger UI:

**🔗 URL:** http://localhost:3000/api-docs

## 📋 O que você encontrará na documentação

### 🏷️ Tags Organizadas
- **Dashboard** - Métricas e análises do dashboard
- **Sales** - Gerenciamento de vendas
- **Products** - Gerenciamento de produtos
- **Stores** - Gerenciamento de lojas
- **Health** - Monitoramento da API

### 🔍 Endpoints Documentados

#### Dashboard Metrics
- `GET /api/dashboard/metrics` - Métricas gerais do dashboard
- `GET /api/dashboard/average-ticket` - Ticket médio
- `GET /api/dashboard/top-products` - Produtos mais vendidos
- `GET /api/dashboard/revenue-by-hour` - Faturamento por hora
- `GET /api/dashboard/revenue-by-day` - Faturamento por dia da semana
- `GET /api/dashboard/sales-by-channel` - Vendas por canal
- `GET /api/dashboard/period-comparison` - Comparação com período anterior

#### Sales Management
- `GET /api/sales` - Listar vendas com filtros
- `GET /api/sales/{id}` - Buscar venda por ID
- `POST /api/sales` - Criar nova venda
- `GET /api/sales/summary` - Resumo de vendas

#### Products Management
- `GET /api/products` - Listar produtos com filtros
- `GET /api/products/{id}` - Buscar produto por ID
- `POST /api/products` - Criar novo produto
- `PUT /api/products/{id}` - Atualizar produto
- `DELETE /api/products/{id}` - Deletar produto (soft delete)
- `GET /api/products/analytics/top-selling` - Produtos mais vendidos

#### Stores Management
- `GET /api/stores` - Listar lojas com filtros
- `GET /api/stores/{id}` - Buscar loja por ID
- `POST /api/stores` - Criar nova loja
- `PUT /api/stores/{id}` - Atualizar loja
- `DELETE /api/stores/{id}` - Deletar loja
- `GET /api/stores/brands/list` - Listar marcas
- `GET /api/stores/sub-brands/list` - Listar sub-marcas

#### Health & Info
- `GET /health` - Health check da API
- `GET /` - Informações da API

### 📊 Schemas Documentados

#### Principais Modelos
- **DashboardMetrics** - Estrutura completa das métricas
- **Sale** - Modelo de venda com todos os campos
- **Product** - Modelo de produto
- **Store** - Modelo de loja
- **Error** - Estrutura de erro padronizada
- **Success** - Estrutura de sucesso padronizada

#### Parâmetros Reutilizáveis
- **StoreId** - ID da loja
- **SubBrandId** - ID da sub-marca
- **BrandId** - ID da marca
- **DateFrom** - Data inicial
- **DateTo** - Data final
- **Limit** - Limite de resultados
- **Id** - ID do recurso

### 🧪 Teste Interativo

No Swagger UI você pode:

1. **Explorar endpoints** - Veja todos os endpoints disponíveis
2. **Testar requisições** - Execute requisições diretamente na interface
3. **Ver exemplos** - Consulte exemplos de request/response
4. **Validar dados** - Teste com diferentes parâmetros
5. **Baixar especificação** - Exporte a especificação OpenAPI

### 🔧 Como usar o Swagger

1. **Acesse** http://localhost:3000/api-docs
2. **Explore** as seções organizadas por tags
3. **Clique** em um endpoint para expandir
4. **Teste** clicando em "Try it out"
5. **Execute** a requisição com os parâmetros desejados

### 📝 Exemplos de Uso

#### Testando Métricas do Dashboard
```bash
# No Swagger UI, teste:
GET /api/dashboard/metrics
# Parâmetros opcionais:
# - store_id: 1
# - date_from: 2024-01-01
# - date_to: 2024-01-31
```

#### Testando Produtos Mais Vendidos
```bash
# No Swagger UI, teste:
GET /api/dashboard/top-products
# Parâmetros opcionais:
# - limit: 10
# - store_id: 1
```

#### Testando Health Check
```bash
# No Swagger UI, teste:
GET /health
# Sem parâmetros necessários
```

### 🎨 Interface Personalizada

A documentação Swagger foi personalizada com:
- **Título customizado:** "NOLA GodLevel API Documentation"
- **CSS personalizado:** Interface limpa sem topbar
- **Organização por tags:** Endpoints agrupados logicamente
- **Exemplos realistas:** Dados baseados no banco real

### 📱 Responsividade

A documentação é totalmente responsiva e funciona em:
- 💻 Desktop
- 📱 Mobile
- 📟 Tablet

### 🔄 Atualizações Automáticas

A documentação é gerada automaticamente a partir das anotações no código:
- **Swagger JSDoc** - Anotações nos arquivos de rota
- **Auto-reload** - Atualiza quando o código muda
- **Validação** - Schemas validados automaticamente

### 🚀 Próximos Passos

Com a documentação Swagger você pode:
1. **Integrar** com ferramentas como Postman
2. **Gerar** clientes SDK automaticamente
3. **Validar** requests/responses
4. **Compartilhar** com a equipe de frontend
5. **Testar** todos os endpoints facilmente

### 📞 Suporte

Se encontrar problemas com a documentação:
1. Verifique se o servidor está rodando
2. Acesse http://localhost:3000/api-docs
3. Consulte os logs do servidor
4. Verifique as anotações Swagger no código

---

**🎉 A documentação Swagger está completa e pronta para uso!**
