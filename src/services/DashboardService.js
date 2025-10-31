const pool = require('../config/database');
const moment = require('moment');

class DashboardService {
  // Opções de métricas pré-definidas para o dashboard dinâmico
  static retrieveUniqueMetricOptions() {
    // IDs estáveis para o frontend mapear seleções/consultas
    return [
      { id: 'average_ticket', description: 'Ticket médio' },
      { id: 'total_sales', description: 'Quantidade total de vendas' },
      { id: 'total_revenue', description: 'Faturamento total' },
      { id: 'top_selling_products', description: 'Produtos mais vendidos' },
      { id: 'revenue_by_hour', description: 'Faturamento por hora' },
      { id: 'revenue_by_day', description: 'Faturamento por dia da semana' },
      { id: 'sales_by_channel', description: 'Vendas por canal (Presencial vs Delivery)' },
      { id: 'total_discounts', description: 'Total de descontos aplicados' },
      { id: 'delivery_fees', description: 'Total de taxas de entrega' },
      { id: 'people_quantity', description: 'Total de pessoas atendidas' },
      { id: 'production_time_avg', description: 'Tempo médio de produção (s)' },
      { id: 'delivery_time_avg', description: 'Tempo médio de entrega (s)' }
    ];
  }

  // Utilitário interno para montar condições SQL com múltiplos filtros
  static buildCommonWhere(filters = {}) {
    const conditions = [];
    const params = [];
    let i = 0;

    if (filters.store_ids && Array.isArray(filters.store_ids) && filters.store_ids.length > 0) {
      i++;
      conditions.push(`s.store_id = ANY($${i})`);
      params.push(filters.store_ids);
    } else if (filters.store_id) {
      i++;
      conditions.push(`s.store_id = $${i}`);
      params.push(filters.store_id);
    }

    if (filters.channel_ids && Array.isArray(filters.channel_ids) && filters.channel_ids.length > 0) {
      i++;
      conditions.push(`s.channel_id = ANY($${i})`);
      params.push(filters.channel_ids);
    } else if (filters.channel_id) {
      i++;
      conditions.push(`s.channel_id = $${i}`);
      params.push(filters.channel_id);
    }

    if (filters.sub_brand_id) {
      i++;
      conditions.push(`s.sub_brand_id = $${i}`);
      params.push(filters.sub_brand_id);
    }

    if (filters.date_from) {
      i++;
      conditions.push(`s.created_at >= $${i}`);
      params.push(filters.date_from);
    }
    if (filters.date_to) {
      i++;
      conditions.push(`s.created_at <= $${i}`);
      params.push(filters.date_to);
    }

    const whereSql = conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';
    return { whereSql, params };
  }

  // Agregados genéricos para várias métricas simples
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
    const { whereSql, params } = this.buildCommonWhere(filters);
    const result = await pool.query(base + whereSql, params);
    return result.rows[0];
  }

  // Consulta por IDs de métricas (múltiplas em paralelo)
  static async queryByMetricOptionId(ids = [], stores = [], channels = [], period = {}) {
    const filters = {};
    if (Array.isArray(stores) && stores.length) filters.store_ids = stores.map(Number).filter(Boolean);
    if (Array.isArray(channels) && channels.length) filters.channel_ids = channels.map(Number).filter(Boolean);
    if (period && period.date_from) filters.date_from = period.date_from;
    if (period && period.date_to) filters.date_to = period.date_to;

    const uniqueIds = Array.from(new Set(ids));
    const results = {};

    // Pré-busca de agregados para métricas simples
    let aggregates = null;
    const needsAggregates = uniqueIds.some(id => [
      'average_ticket', 'total_sales', 'total_revenue', 'total_discounts', 'delivery_fees', 'people_quantity',
      'production_time_avg', 'delivery_time_avg'
    ].includes(id));
    if (needsAggregates) {
      aggregates = await this.getAggregates(filters);
    }

    await Promise.all(uniqueIds.map(async (id) => {
      switch (id) {
        case 'average_ticket':
          results[id] = { value: Number(aggregates.average_ticket) };
          break;
        case 'total_sales':
          results[id] = { value: Number(aggregates.total_sales) };
          break;
        case 'total_revenue':
          results[id] = { value: Number(aggregates.total_revenue) };
          break;
        case 'total_discounts':
          results[id] = { value: Number(aggregates.total_discounts) };
          break;
        case 'delivery_fees':
          results[id] = { value: Number(aggregates.delivery_fees) };
          break;
        case 'people_quantity':
          results[id] = { value: Number(aggregates.people_quantity) };
          break;
        case 'production_time_avg':
          results[id] = { value: Number(aggregates.production_time_avg) };
          break;
        case 'delivery_time_avg':
          results[id] = { value: Number(aggregates.delivery_time_avg) };
          break;
        case 'top_selling_products': {
          const data = await this.getTopSellingProducts(filters);
          results[id] = { items: data };
          break;
        }
        case 'revenue_by_hour': {
          const data = await this.getRevenueByHour(filters);
          results[id] = { items: data };
          break;
        }
        case 'revenue_by_day': {
          const data = await this.getRevenueByDayOfWeek(filters);
          results[id] = { items: data };
          break;
        }
        case 'sales_by_channel': {
          const data = await this.getSalesByChannel(filters);
          results[id] = { items: data };
          break;
        }
        default:
          results[id] = { error: 'unsupported_metric_id' };
      }
    }));

    return results;
  }
  // Ticket médio por período
  static async getAverageTicket(filters = {}) {
    let query = `
      SELECT 
        AVG(total_amount) as average_ticket,
        COUNT(*) as total_sales,
        SUM(total_amount) as total_revenue
      FROM sales s
      JOIN stores st ON s.store_id = st.id
    `;
    let params = [];
    let paramCount = 0;

    const conditions = [];
    
    if (filters.store_id) {
      paramCount++;
      conditions.push(`s.store_id = $${paramCount}`);
      params.push(filters.store_id);
    }
    
    if (filters.sub_brand_id) {
      paramCount++;
      conditions.push(`s.sub_brand_id = $${paramCount}`);
      params.push(filters.sub_brand_id);
    }
    
    if (filters.date_from) {
      paramCount++;
      conditions.push(`s.created_at >= $${paramCount}`);
      params.push(filters.date_from);
    }
    
    if (filters.date_to) {
      paramCount++;
      conditions.push(`s.created_at <= $${paramCount}`);
      params.push(filters.date_to);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    const result = await pool.query(query, params);
    return result.rows[0];
  }

  // Produtos mais vendidos
  static async getTopSellingProducts(filters = {}) {
    let query = `
      SELECT 
        p.id,
        p.name as product_name,
        SUM(ps.quantity) as total_quantity_sold,
        SUM(ps.total_price) as total_revenue,
        COUNT(DISTINCT ps.sale_id) as total_sales_count,
        AVG(ps.base_price) as average_price
      FROM products p
      JOIN product_sales ps ON p.id = ps.product_id
      JOIN sales s ON ps.sale_id = s.id
      JOIN stores st ON s.store_id = st.id
    `;
    let params = [];
    let paramCount = 0;

    const conditions = [];
    
    if (filters.store_id) {
      paramCount++;
      conditions.push(`s.store_id = $${paramCount}`);
      params.push(filters.store_id);
    }
    
    if (filters.sub_brand_id) {
      paramCount++;
      conditions.push(`s.sub_brand_id = $${paramCount}`);
      params.push(filters.sub_brand_id);
    }
    
    if (filters.date_from) {
      paramCount++;
      conditions.push(`s.created_at >= $${paramCount}`);
      params.push(filters.date_from);
    }
    
    if (filters.date_to) {
      paramCount++;
      conditions.push(`s.created_at <= $${paramCount}`);
      params.push(filters.date_to);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += `
      GROUP BY p.id, p.name
      ORDER BY total_quantity_sold DESC
      LIMIT 10
    `;
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  // Faturamento por hora
  static async getRevenueByHour(filters = {}) {
    let query = `
      SELECT 
        EXTRACT(HOUR FROM s.created_at) as hour,
        COUNT(*) as sales_count,
        SUM(s.total_amount) as total_revenue,
        AVG(s.total_amount) as average_ticket
      FROM sales s
      JOIN stores st ON s.store_id = st.id
    `;
    let params = [];
    let paramCount = 0;

    const conditions = [];
    
    if (filters.store_id) {
      paramCount++;
      conditions.push(`s.store_id = $${paramCount}`);
      params.push(filters.store_id);
    }
    
    if (filters.sub_brand_id) {
      paramCount++;
      conditions.push(`s.sub_brand_id = $${paramCount}`);
      params.push(filters.sub_brand_id);
    }
    
    if (filters.date_from) {
      paramCount++;
      conditions.push(`s.created_at >= $${paramCount}`);
      params.push(filters.date_from);
    }
    
    if (filters.date_to) {
      paramCount++;
      conditions.push(`s.created_at <= $${paramCount}`);
      params.push(filters.date_to);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += `
      GROUP BY EXTRACT(HOUR FROM s.created_at)
      ORDER BY hour
    `;
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  // Faturamento por dia da semana
  static async getRevenueByDayOfWeek(filters = {}) {
    let query = `
      SELECT 
        EXTRACT(DOW FROM s.created_at) as day_of_week,
        CASE EXTRACT(DOW FROM s.created_at)
          WHEN 0 THEN 'Domingo'
          WHEN 1 THEN 'Segunda'
          WHEN 2 THEN 'Terça'
          WHEN 3 THEN 'Quarta'
          WHEN 4 THEN 'Quinta'
          WHEN 5 THEN 'Sexta'
          WHEN 6 THEN 'Sábado'
        END as day_name,
        COUNT(*) as sales_count,
        SUM(s.total_amount) as total_revenue,
        AVG(s.total_amount) as average_ticket
      FROM sales s
      JOIN stores st ON s.store_id = st.id
    `;
    let params = [];
    let paramCount = 0;

    const conditions = [];
    
    if (filters.store_id) {
      paramCount++;
      conditions.push(`s.store_id = $${paramCount}`);
      params.push(filters.store_id);
    }
    
    if (filters.sub_brand_id) {
      paramCount++;
      conditions.push(`s.sub_brand_id = $${paramCount}`);
      params.push(filters.sub_brand_id);
    }
    
    if (filters.date_from) {
      paramCount++;
      conditions.push(`s.created_at >= $${paramCount}`);
      params.push(filters.date_from);
    }
    
    if (filters.date_to) {
      paramCount++;
      conditions.push(`s.created_at <= $${paramCount}`);
      params.push(filters.date_to);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += `
      GROUP BY EXTRACT(DOW FROM s.created_at)
      ORDER BY day_of_week
    `;
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  // Vendas por canal (Presencial vs Delivery)
  static async getSalesByChannel(filters = {}) {
    let query = `
      SELECT 
        ch.id as channel_id,
        ch.name as channel_name,
        ch.type as channel_type,
        COUNT(*) as sales_count,
        SUM(s.total_amount) as total_revenue,
        AVG(s.total_amount) as average_ticket,
        SUM(s.delivery_fee) as total_delivery_fees
      FROM sales s
      JOIN channels ch ON s.channel_id = ch.id
      JOIN stores st ON s.store_id = st.id
    `;
    let params = [];
    let paramCount = 0;

    const conditions = [];
    
    if (filters.store_id) {
      paramCount++;
      conditions.push(`s.store_id = $${paramCount}`);
      params.push(filters.store_id);
    }
    
    if (filters.sub_brand_id) {
      paramCount++;
      conditions.push(`s.sub_brand_id = $${paramCount}`);
      params.push(filters.sub_brand_id);
    }
    
    if (filters.date_from) {
      paramCount++;
      conditions.push(`s.created_at >= $${paramCount}`);
      params.push(filters.date_from);
    }
    
    if (filters.date_to) {
      paramCount++;
      conditions.push(`s.created_at <= $${paramCount}`);
      params.push(filters.date_to);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += `
      GROUP BY ch.id, ch.name, ch.type
      ORDER BY total_revenue DESC
    `;
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  // Métricas gerais do dashboard
  static async getDashboardMetrics(filters = {}) {
    const [
      averageTicket,
      topProducts,
      revenueByHour,
      revenueByDay,
      salesByChannel
    ] = await Promise.all([
      this.getAverageTicket(filters),
      this.getTopSellingProducts(filters),
      this.getRevenueByHour(filters),
      this.getRevenueByDayOfWeek(filters),
      this.getSalesByChannel(filters)
    ]);

    return {
      averageTicket,
      topProducts,
      revenueByHour,
      revenueByDay,
      salesByChannel
    };
  }

  // Comparação com período anterior
  static async getPeriodComparison(filters = {}) {
    const currentPeriod = await this.getAverageTicket(filters);
    
    // Calcular período anterior baseado no filtro de data
    let previousFilters = { ...filters };
    
    if (filters.date_from && filters.date_to) {
      const fromDate = moment(filters.date_from);
      const toDate = moment(filters.date_to);
      const periodDays = toDate.diff(fromDate, 'days');
      
      previousFilters.date_to = fromDate.format('YYYY-MM-DD');
      previousFilters.date_from = fromDate.subtract(periodDays, 'days').format('YYYY-MM-DD');
    } else {
      // Se não há filtro de data, compara com o mês anterior
      const lastMonth = moment().subtract(1, 'month');
      previousFilters.date_from = lastMonth.startOf('month').format('YYYY-MM-DD');
      previousFilters.date_to = lastMonth.endOf('month').format('YYYY-MM-DD');
    }
    
    const previousPeriod = await this.getAverageTicket(previousFilters);
    
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

module.exports = DashboardService;

