import moment from 'moment';
import pool from '../config/database.js';

// --- Mapeamentos de Configuração (Constantes de Domínio) ---

const DIMENSION_MAP = {
    'store_id': 's.store_id',
    'channel_id': 's.channel_id',
    'day_of_week': "EXTRACT(DOW FROM s.created_at)", 
    'hour_of_day': "EXTRACT(HOUR FROM s.created_at)",
    'product_id': 'p.id',
    'product_name': 'p.name',
    'registration_origin': 'c.registration_origin',
    'courier_type': 'ds.courier_type', 
    'category_id': 'c.id',
    'discount_reason': 's.discount_reason'
};

const metricAggregates = {
    'total_revenue': 'COALESCE(SUM(s.total_amount), 0)',
    'total_sales': 'COUNT(*)',
    'average_ticket': 'CASE WHEN COUNT(*) > 0 THEN COALESCE(AVG(s.total_amount), 0) ELSE 0 END',
    'total_discounts': 'COALESCE(SUM(s.total_discount), 0)',
    'delivery_fees': 'COALESCE(SUM(s.delivery_fee), 0)',
    'people_quantity': 'COALESCE(SUM(s.people_quantity), 0)',
    'production_time_avg': 'COALESCE(AVG(s.production_seconds), 0)',
    'delivery_time_avg': 'COALESCE(AVG(s.delivery_seconds), 0)'
};

// --- 2. Classe Principal do Serviço ---

class DashboardService {

    static retrieveUniqueMetricOptions() {
        return [
            { id: 'average_ticket', description: 'Ticket médio' },
            { id: 'total_sales', description: 'Quantidade total de vendas' },
            { id: 'total_revenue', description: 'Faturamento total' },
            { id: 'top_selling_products', description: 'Rentabilidade e Margem Bruta' },
            { id: 'delivery_performance', description: 'Tempo Médio por Entregador' }, 
            { id: 'delivery_profitability', description: 'Margem Líquida de Delivery (MLD)' },
            { id: 'customer_origin', description: 'Vendas por Origem de Cadastro' },
            { id: 'discount_effectiveness', description: 'Efetividade dos Descontos (ROI)' },
            { id: 'churn_risk_customers', description: 'Clientes em risco de Churn' }, 
            { id: 'revenue_by_hour', description: 'Faturamento por hora' },
            { id: 'revenue_by_day', description: 'Faturamento por dia da semana' },
            { id: 'sales_by_channel', description: 'Vendas por canal' },
            { id: 'revenue_by_payment', description: 'Distribuição de faturamento por meio de pagamento' },
            { id: 'geographic_sales', description: 'Vendas por localização geográfica (Cidade)' },
            { id: 'period_comparison', description: 'Comparação com período anterior' },
            { id: 'production_time_avg', description: 'Tempo médio de produção (s)' },
            { id: 'delivery_time_avg', description: 'Tempo médio de entrega (s)' }
        ];
    }

    // --- buildCommonWhere (MOTOR DE FILTRAGEM CORRIGIDO) ---
    static buildCommonWhere(filters = {}, prefix = 's') {
        const conditions = [];
        const params = [];
        let i = 0;

        // Garantir que os filtros são arrays válidos e não vazios
        const storeFilter = (filters.store_ids && filters.store_ids.length > 0) 
            ? filters.store_ids.filter(id => id != null && id !== '') 
            : null;
        const subBrandFilter = (filters.sub_brand_ids && filters.sub_brand_ids.length > 0) 
            ? filters.sub_brand_ids.filter(id => id != null && id !== '') 
            : null;
        
        // Debug: log dos filtros recebidos (comentado para reduzir logs)
        // if (storeFilter || subBrandFilter) {
        //     console.log('🔍 Backend - Filtros recebidos:', {
        //         store_ids: storeFilter,
        //         sub_brand_ids: subBrandFilter
        //     });
        // }
        
        // LÓGICA DE FILTROS: Se ambos lojas e submarcas estão selecionados, fazer interseção
        // Se apenas lojas estão selecionadas, filtrar apenas por lojas
        // Se apenas submarcas estão selecionadas, filtrar por submarcas (incluindo todas as lojas delas)
        // Se ambos estão selecionados, filtrar por lojas que pertencem às submarcas selecionadas
        
        if (storeFilter && storeFilter.length > 0 && subBrandFilter && subBrandFilter.length > 0) {
            // AMBOS SELECIONADOS: Filtrar apenas lojas selecionadas que TAMBÉM pertencem às submarcas selecionadas
            // Isso garante que apenas lojas que estão na lista E pertencem às submarcas sejam retornadas
            i++;
            const storeParam = i;
            params.push(storeFilter);
            
            i++;
            const subBrandParam = i;
            params.push(subBrandFilter);
            
            // Interseção: loja deve estar na lista E pertencer à submarca
            conditions.push(`${prefix}.store_id = ANY($${storeParam}) AND ${prefix}.store_id IN (SELECT id FROM stores WHERE sub_brand_id = ANY($${subBrandParam}))`);
        } else if (storeFilter && storeFilter.length > 0) {
            // APENAS LOJAS SELECIONADAS: Filtrar apenas pelas lojas específicas
            i++;
            conditions.push(`${prefix}.store_id = ANY($${i})`);
            params.push(storeFilter);
        } else if (subBrandFilter && subBrandFilter.length > 0) {
            // APENAS SUBMARCAS SELECIONADAS: Filtra por sub_brand_id direto OU lojas que pertencem à submarca
            i++;
            const subBrandParam = i;
            params.push(subBrandFilter);
            conditions.push(`(${prefix}.sub_brand_id = ANY($${subBrandParam}) OR ${prefix}.store_id IN (SELECT id FROM stores WHERE sub_brand_id = ANY($${subBrandParam})))`);
        }
        
        const channelFilter = filters.channel_ids || (filters.channel_id ? [filters.channel_id] : null);
        if (channelFilter && channelFilter.length > 0) {
            i++;
            conditions.push(`${prefix}.channel_id = ANY($${i})`);
            params.push(channelFilter);
        }

        // Filtros de Data (usando TO_TIMESTAMP para robustez)
        if (filters.date_from) {
            i++;
            conditions.push(`${prefix}.created_at >= TO_TIMESTAMP($${i}, 'YYYY-MM-DD')`);
            params.push(filters.date_from);
        }
        if (filters.date_to) {
            i++;
            conditions.push(`${prefix}.created_at <= TO_TIMESTAMP($${i} || ' 23:59:59', 'YYYY-MM-DD HH24:MI:SS')`);
            params.push(filters.date_to);
        }
        
        // FILTRO ESSENCIAL: STATUS DE SUCESSO (COMPLETED)
        i++;
        conditions.push(`UPPER(${prefix}.sale_status_desc) = $${i}`);
        params.push('COMPLETED'); 
        
        // Retorna a string WHERE.
        const whereSql = conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';
        return { whereSql, params }; 
    }

    // --- getAggregates (Agregados Simples de Topo) ---
    static async getAggregates(filters = {}) {
        const base = `
            SELECT 
                COUNT(*)::bigint as total_sales,
                COALESCE(SUM(s.total_amount), 0)::numeric as total_revenue,
                COALESCE(AVG(s.total_amount), 0)::numeric as average_ticket,
                COALESCE(SUM(s.total_discount), 0)::numeric as total_discounts,
                COALESCE(SUM(s.delivery_fee), 0)::numeric as delivery_fees,
                COALESCE(SUM(s.people_quantity), 0)::bigint as people_quantity,
                COALESCE(AVG(s.production_seconds), 0)::numeric as production_time_avg,
                COALESCE(AVG(s.delivery_seconds), 0)::numeric as delivery_time_avg
            FROM sales s
        `;
        const { whereSql, params } = DashboardService.buildCommonWhere(filters); 
        
        try {
            const result = await pool.query(base + whereSql, params);
            return result.rows[0];
        } catch (error) {
            console.error("ERRO CRÍTICO NO GETAGGREGATES:", base + whereSql, error.stack);
            return {};
        }
    }

    // --- queryByMetricOptionId (Motor Dinâmico Corrigido) ---
    static async queryByMetricOptionId(ids = [], stores = [], channels = [], sub_brands = [], period = {}, group_by_dimension = null) {
        const filters = {
            store_ids: stores.map(Number).filter(Boolean),
            channel_ids: channels.map(Number).filter(Boolean),
            sub_brand_ids: sub_brands.map(Number).filter(Boolean),
            date_from: period.date_from,
            date_to: period.date_to,
        };
        
        let groupBySelect = '';
        let groupByClause = '';
        let joins = '';
        let dimensionAlias = group_by_dimension;

        if (group_by_dimension && DIMENSION_MAP[group_by_dimension]) {
            const dimensionExpression = DIMENSION_MAP[group_by_dimension];
            // Para expressões complexas (EXTRACT), usar alias; para campos simples, usar diretamente
            const needsAlias = dimensionExpression.includes('EXTRACT') || dimensionExpression.includes('(');
            groupBySelect = needsAlias 
                ? `, ${dimensionExpression} AS ${dimensionAlias}` 
                : `, ${dimensionExpression} AS ${dimensionAlias}`;
            
            // No GROUP BY, sempre usar a expressão completa (não o alias)
            groupByClause = `GROUP BY ${dimensionExpression}`;
            
            if (group_by_dimension.includes('product') || group_by_dimension.includes('category')) {
                joins += ' JOIN product_sales ps ON s.id = ps.sale_id JOIN products p ON ps.product_id = p.id';
                if (group_by_dimension.includes('category')) {
                    joins += ' JOIN categories c ON p.category_id = c.id'; 
                }
            }
            if (group_by_dimension.includes('registration_origin')) {
                joins += ' JOIN customers c ON s.customer_id = c.id';
            }
            if (group_by_dimension.includes('courier_type')) {
                joins += ' JOIN delivery_sales ds ON s.id = ds.sale_id';
            }
        }

        const selectedAggregates = ids.map(id => {
            return metricAggregates[id] ? `${metricAggregates[id]}::numeric AS ${id}` : null;
        }).filter(Boolean);

        let aggregatedResult = {};
        
        if (selectedAggregates.length > 0) {
            const { whereSql, params } = DashboardService.buildCommonWhere(filters); 
            
            // Determina a ordenação baseada na dimensão
            let orderByClause = '';
            if (group_by_dimension && dimensionAlias) {
                if (group_by_dimension === 'hour_of_day') {
                    // Para hora do dia, ordenar numericamente de 0-23 (crescente)
                    orderByClause = `ORDER BY ${dimensionAlias} ASC`;
                } else if (group_by_dimension === 'day_of_week') {
                    // Para dia da semana, ordenar de 0-6 (Domingo-Sábado)
                    orderByClause = `ORDER BY ${dimensionAlias} ASC`;
                } else {
                    // Para outras dimensões, ordenar pela métrica principal (decrescente)
                    const primaryMetric = ids.find(id => metricAggregates[id]) || ids[0];
                    if (primaryMetric) {
                        orderByClause = `ORDER BY ${primaryMetric} DESC`;
                    }
                }
            }
            
            const finalQuery = `
                SELECT 
                    ${selectedAggregates.join(', ')} 
                    ${groupBySelect}
                FROM sales s
                ${joins}
                ${whereSql}
                ${groupByClause}
                ${orderByClause}
            `;
            
            try {
                // Debug: log da query quando há agrupamento (comentado para reduzir logs)
                // if (group_by_dimension) {
                //     console.log('🔍 Query com agrupamento:', {
                //         dimension: group_by_dimension,
                //         query: finalQuery,
                //         params: params
                //     });
                // }
                
                const result = await pool.query(finalQuery, params);
                aggregatedResult = { 
                    result_type: group_by_dimension ? 'grouped' : 'total',
                    data: result.rows,
                    dimension: dimensionAlias 
                };
            } catch (error) {
                console.error('Erro na query dinâmica:', finalQuery);
                console.error('Parâmetros:', params);
                console.error('Erro completo:', error.message, error.stack);
                aggregatedResult = { 
                    result_type: 'error',
                    data: [],
                    dimension: dimensionAlias,
                    error: 'Falha na query de Agregação Dinâmica: ' + error.message
                };
            }
        }
        
        const complexResults = {};
        
        await Promise.all(ids.map(async (id) => {
            switch (id) {
                case 'top_selling_products': 
                    complexResults[id] = { items: await DashboardService.getTopSellingProducts(filters) };
                    break;
                case 'delivery_performance': 
                    complexResults[id] = { items: await DashboardService.getDeliveryPerformance(filters) };
                    break;
                case 'delivery_profitability': 
                    complexResults[id] = { items: await DashboardService.getDeliveryProfitability(filters) };
                    break;
                case 'customer_origin': 
                    complexResults[id] = { items: await DashboardService.getCustomerRegistrationOrigin(filters) };
                    break;
                case 'discount_effectiveness': 
                    complexResults[id] = { items: await DashboardService.getSalesByDiscountReason(filters) };
                    break;
                case 'churn_risk_customers': 
                    complexResults[id] = { items: await DashboardService.getChurnRiskCustomers(filters) };
                    break;
                case 'revenue_by_hour': 
                    complexResults[id] = { items: await DashboardService.getRevenueByHour(filters) };
                    break;
                case 'revenue_by_day': 
                    complexResults[id] = { items: await DashboardService.getRevenueByDayOfWeek(filters) };
                    break;
                case 'sales_by_channel': 
                    complexResults[id] = { items: await DashboardService.getSalesByChannel(filters) };
                    break;
                case 'period_comparison':
                    const comparison = await DashboardService.getPeriodComparison(filters);
                    complexResults[id] = comparison;
                    break;
                case 'geographic_sales':
                    complexResults[id] = { items: await DashboardService.getGeographicSales(filters) };
                    break;
                case 'revenue_by_payment':
                    complexResults[id] = { items: await DashboardService.getRevenueByPaymentMethod(filters) };
                    break;
            }
        }));

        return { ...aggregatedResult, ...complexResults };
    }
    
    // --- Funções de Insight Avançado e Fixo (AJUSTADAS) ---

    // 1. Margem Bruta (Rentabilidade)
    static async getTopSellingProducts(filters = {}) {
        const { whereSql, params } = DashboardService.buildCommonWhere(filters); 
        const CMV_PERCENTAGE = 0.30; 
        
        let query = `
            SELECT 
                p.id,
                p.name as product_name,
                COALESCE(SUM(ps.quantity), 0)::numeric as total_quantity_sold,
                COALESCE(SUM(ps.total_price), 0)::numeric as total_revenue,
                (SUM(ps.total_price) - SUM(ps.base_price * ps.quantity * ${CMV_PERCENTAGE})) AS estimated_gross_profit,
                (SUM(ps.total_price) - SUM(ps.base_price * ps.quantity * ${CMV_PERCENTAGE})) / NULLIF(SUM(ps.total_price), 0) AS estimated_gross_margin_rate
            FROM sales s
            JOIN product_sales ps ON s.id = ps.sale_id
            JOIN products p ON ps.product_id = p.id
            ${whereSql}
            GROUP BY p.id, p.name
            ORDER BY total_quantity_sold DESC
            LIMIT 10
        `;
        const result = await pool.query(query, params);
        return result.rows;
    }

    // 2. Margem Líquida de Delivery (Logística - Custo)
    static async getDeliveryProfitability(filters = {}) {
        const { whereSql, params } = DashboardService.buildCommonWhere(filters); 

        let query = `
            SELECT 
                ds.courier_type,
                COUNT(s.id) AS total_deliveries,
                COALESCE(SUM(ds.delivery_fee), 0) AS total_delivery_fees_collected,
                COALESCE(SUM(ds.courier_fee), 0) AS total_courier_costs,
                (COALESCE(SUM(ds.delivery_fee), 0) - COALESCE(SUM(ds.courier_fee), 0)) AS net_delivery_profit,
                ((COALESCE(SUM(ds.delivery_fee), 0) - COALESCE(SUM(ds.courier_fee), 0)) / NULLIF(SUM(ds.delivery_fee), 0)) AS net_delivery_margin_rate
            FROM sales s
            JOIN delivery_sales ds ON s.id = ds.sale_id
            ${whereSql}
            AND ds.courier_type IS NOT NULL 
            GROUP BY ds.courier_type
            ORDER BY net_delivery_profit DESC
        `;
        const result = await pool.query(query, params);
        return result.rows;
    }

    // 3. Performance de Entrega (Logística - Tempo)
    static async getDeliveryPerformance(filters = {}) {
        const { whereSql, params } = DashboardService.buildCommonWhere(filters); 

        let adjustedWhere = whereSql + ' AND s.delivery_seconds IS NOT NULL AND ds.courier_type IS NOT NULL ';

        let query = `
            SELECT 
                ds.courier_type,
                COUNT(s.id) AS total_deliveries,
                COALESCE(AVG(s.delivery_seconds), 0) AS avg_delivery_time_seconds
            FROM sales s
            JOIN delivery_sales ds ON s.id = ds.sale_id
            ${adjustedWhere}
            GROUP BY ds.courier_type
            ORDER BY avg_delivery_time_seconds DESC
        `;
        const result = await pool.query(query, params);
        return result.rows;
    }

    // 4. Origem de Clientes (Marketing - Captação)
    static async getCustomerRegistrationOrigin(filters = {}) {
        const { whereSql, params } = DashboardService.buildCommonWhere(filters); 

        let query = `
            SELECT 
                c.registration_origin AS origin_name,
                COUNT(s.id) AS total_sales,
                COALESCE(AVG(s.total_amount), 0) AS average_ticket,
                COALESCE(SUM(s.total_amount), 0) AS total_revenue
            FROM sales s
            JOIN customers c ON s.customer_id = c.id
            ${whereSql}
            AND c.registration_origin IS NOT NULL AND c.registration_origin != ''
            GROUP BY c.registration_origin
            ORDER BY total_revenue DESC
        `;
        const result = await pool.query(query, params);
        return result.rows;
    }
    
    // 5. Efetividade dos Descontos (Marketing - ROI)
    static async getSalesByDiscountReason(filters = {}) {
        const { whereSql, params } = DashboardService.buildCommonWhere(filters); 

        let query = `
            SELECT 
                s.discount_reason AS reason,
                COUNT(s.id) AS total_sales,
                COALESCE(SUM(s.total_discount), 0) AS total_discount_given,
                COALESCE(SUM(s.total_amount), 0) AS total_revenue_after_discount
            FROM sales s
            ${whereSql}
            AND s.total_discount > 0 AND s.discount_reason IS NOT NULL AND s.discount_reason != ''
            GROUP BY s.discount_reason
            ORDER BY total_revenue_after_discount DESC
        `;
        const result = await pool.query(query, params);
        return result.rows;
    }
    
    // 6. Faturamento por Método de Pagamento (Financeiro - Pagamentos)
    static async getRevenueByPaymentMethod(filters = {}) {
        // Usamos o whereSql do sales (s) para filtrar por data/loja
        const { whereSql, params } = DashboardService.buildCommonWhere(filters); 
    
        let query = `
            SELECT 
                pt.description AS payment_method,
                COUNT(p.sale_id) AS total_transactions,
                COALESCE(SUM(p.value), 0) AS total_value_paid
            FROM sales s
            JOIN payments p ON s.id = p.sale_id
            JOIN payment_types pt ON p.payment_type_id = pt.id
            ${whereSql}
            GROUP BY pt.description
            ORDER BY total_value_paid DESC
        `;
        
        // NOTA: Se você não tiver a tabela 'payment_types', 
        // precisaremos modificar a query para usar a coluna 'p.description' da tabela 'payments' 
        // (mas o modelo acima é o mais correto).
    
        try {
            const result = await pool.query(query, params);
            return result.rows;
        } catch (error) {
            console.error("ERRO ao buscar Pagamentos:", error.stack);
            return [];
        }
    }
    
    // --- FUNÇÃO ADICIONAL: Distribuição Geográfica de Vendas ---

    static async getGeographicSales(filters = {}) {
        const { whereSql, params } = DashboardService.buildCommonWhere(filters, 's'); 

        let query = `
            SELECT
                st.city,
                COUNT(s.id) AS total_sales,
                COALESCE(AVG(s.total_amount), 0) AS average_ticket,
                COALESCE(SUM(s.total_amount), 0) AS total_revenue
            FROM sales s
            JOIN stores st ON s.store_id = st.id
            ${whereSql}
            GROUP BY st.city
            ORDER BY total_sales DESC
            LIMIT 10
        `;
        
        try {
            const result = await pool.query(query, params);
            return result.rows;
        } catch (error) {
            console.error('ERRO ao buscar Vendas Geográficas:', query, error.stack);
            return [];
        }
    }
    
    // Funções de compatibilidade (mantidas e ajustadas)
    static async getRevenueByHour(filters = {}) {
        const { whereSql, params } = DashboardService.buildCommonWhere(filters);
        let query = `SELECT EXTRACT(HOUR FROM s.created_at) as hour, COUNT(*) as sales_count, SUM(s.total_amount) as total_revenue, AVG(s.total_amount) as average_ticket FROM sales s ${whereSql} GROUP BY EXTRACT(HOUR FROM s.created_at) ORDER BY hour`;
        const result = await pool.query(query, params);
        return result.rows;
    }
    static async getRevenueByDayOfWeek(filters = {}) {
        const { whereSql, params } = DashboardService.buildCommonWhere(filters);
        let query = `SELECT EXTRACT(DOW FROM s.created_at) as day_of_week, CASE EXTRACT(DOW FROM s.created_at) WHEN 0 THEN 'Domingo' WHEN 1 THEN 'Segunda' WHEN 2 THEN 'Terça' WHEN 3 THEN 'Quarta' WHEN 4 THEN 'Quinta' WHEN 5 THEN 'Sexta' WHEN 6 THEN 'Sábado' END as day_name, COUNT(*) as sales_count, SUM(s.total_amount) as total_revenue, AVG(s.total_amount) as average_ticket FROM sales s ${whereSql} GROUP BY EXTRACT(DOW FROM s.created_at) ORDER BY day_of_week`;
        const result = await pool.query(query, params);
        return result.rows;
    }
    static async getSalesByChannel(filters = {}) {
        const { whereSql, params } = DashboardService.buildCommonWhere(filters);
        let query = `SELECT ch.id as channel_id, ch.name as channel_name, ch.type as channel_type, COUNT(*) as sales_count, SUM(s.total_amount) as total_revenue, AVG(s.total_amount) as average_ticket, SUM(s.delivery_fee) as total_delivery_fees FROM sales s JOIN channels ch ON s.channel_id = ch.id ${whereSql} GROUP BY ch.id, ch.name, ch.type ORDER BY total_revenue DESC`;
        const result = await pool.query(query, params);
        return result.rows;
    }
    static async getChurnRiskCustomers(filters = {}) {
        const { whereSql, params } = DashboardService.buildCommonWhere(filters);
        const days_since_last_purchase_threshold = 30; const min_purchases = 3;
        let query = `WITH customer_metrics AS ( SELECT s.customer_id, c.customer_name, COUNT(s.id) AS total_sales_count, MAX(s.created_at) AS last_purchase_date, AVG(s.total_amount) AS customer_average_ticket FROM sales s JOIN customers c ON s.customer_id = c.id ${whereSql} GROUP BY s.customer_id, c.customer_name ) SELECT customer_id, customer_name, total_sales_count, customer_average_ticket, EXTRACT(DAY FROM NOW() - last_purchase_date) AS days_since_last_purchase FROM customer_metrics WHERE total_sales_count >= $${params.length + 1} AND EXTRACT(DAY FROM NOW() - last_purchase_date) >= $${params.length + 2} ORDER BY days_since_last_purchase DESC LIMIT 20`;
        try {
            const result = await pool.query(query, [...params, min_purchases, days_since_last_purchase_threshold]);
            return result.rows;
        } catch (error) {
             console.error("ERRO no getChurnRiskCustomers:", error.stack);
             return [];
        }
    }


    static async getDashboardMetrics(filters = {}) {
        const simpleAggregates = await DashboardService.getAggregates(filters);
        
        const [
            topProducts,
            revenueByHour,
            revenueByDay,
            salesByChannel
        ] = await Promise.all([
            DashboardService.getTopSellingProducts(filters),
            DashboardService.getRevenueByHour(filters),
            DashboardService.getRevenueByDayOfWeek(filters),
            DashboardService.getSalesByChannel(filters)
        ]);

        return {
            ...simpleAggregates,
            topProducts,
            revenueByHour,
            revenueByDay,
            salesByChannel
        };
    }

    static async getPeriodComparison(filters = {}) {
        const currentPeriod = await DashboardService.getAggregates(filters);
        
        let previousFilters = { ...filters };
        
        if (filters.date_from && filters.date_to) {
            const fromDate = moment(filters.date_from);
            const toDate = moment(filters.date_to);
            const periodDays = toDate.diff(fromDate, 'days');
            
            previousFilters.date_to = fromDate.format('YYYY-MM-DD');
            previousFilters.date_from = fromDate.subtract(periodDays, 'days').format('YYYY-MM-DD');
        } else {
            const lastMonth = moment().subtract(1, 'month');
            previousFilters.date_from = lastMonth.startOf('month').format('YYYY-MM-DD');
            previousFilters.date_to = lastMonth.endOf('month').format('YYYY-MM-DD');
        }
        
        const previousPeriod = await DashboardService.getAggregates(previousFilters);
        
        return {
            current: currentPeriod,
            previous: previousPeriod,
                growth: {
                revenue: currentPeriod.total_revenue - previousPeriod.total_revenue,
                revenue_percentage: previousPeriod.total_revenue > 0 
                    ? ((currentPeriod.total_revenue - previousPeriod.total_revenue) / previousPeriod.total_revenue) * 100 
                    : 0,
                sales_count: currentPeriod.total_sales - previousPeriod.total_sales,
                sales_percentage: previousPeriod.total_sales > 0 
                    ? ((currentPeriod.total_sales - previousPeriod.total_sales) / previousPeriod.total_sales) * 100 
                    : 0,
                average_ticket: currentPeriod.average_ticket - previousPeriod.average_ticket,
                ticket_percentage: previousPeriod.average_ticket > 0 
                    ? ((currentPeriod.average_ticket - previousPeriod.average_ticket) / previousPeriod.average_ticket) * 100 
                    : 0
            }
        };
    }
}

export default DashboardService;
