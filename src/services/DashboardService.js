const pool = require('../config/database');
const moment = require('moment');

class DashboardService {
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

