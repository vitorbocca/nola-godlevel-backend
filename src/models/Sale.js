import pool from "../config/database.js";

class Sale {
  static async findAll(filters = {}) {
    let query = `
      SELECT s.*, 
             st.name as store_name, st.city, st.state,
             sb.name as sub_brand_name,
             c.customer_name,
             ch.name as channel_name, ch.type as channel_type
      FROM sales s
      JOIN stores st ON s.store_id = st.id
      JOIN sub_brands sb ON s.sub_brand_id = sb.id
      LEFT JOIN customers c ON s.customer_id = c.id
      JOIN channels ch ON s.channel_id = ch.id
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

    if (filters.channel_id) {
      paramCount++;
      conditions.push(`s.channel_id = $${paramCount}`);
      params.push(filters.channel_id);
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

    if (filters.sale_status_desc) {
      paramCount++;
      conditions.push(`s.sale_status_desc = $${paramCount}`);
      params.push(filters.sale_status_desc);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY s.created_at DESC";

    if (filters.limit) {
      query += ` LIMIT $${paramCount + 1}`;
      params.push(filters.limit);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT s.*, 
       st.name as store_name, st.city, st.state,
       sb.name as sub_brand_name,
       c.customer_name,
       ch.name as channel_name, ch.type as channel_type
      FROM sales s
      LEFT JOIN stores st ON s.store_id = st.id
      LEFT JOIN sub_brands sb ON s.sub_brand_id = sb.id
      LEFT JOIN customers c ON s.customer_id = c.id
      LEFT JOIN channels ch ON s.channel_id = ch.id
      WHERE s.id = $1;
    `;
    console.log(id, "id");
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(saleData) {
    const {
      store_id,
      sub_brand_id,
      customer_id,
      channel_id,
      cod_sale1,
      cod_sale2,
      customer_name,
      sale_status_desc,
      total_amount_items,
      total_discount,
      total_increase,
      delivery_fee,
      service_tax_fee,
      total_amount,
      value_paid,
      production_seconds,
      delivery_seconds,
      people_quantity,
      discount_reason,
      increase_reason,
      origin,
    } = saleData;

    const query = `
      INSERT INTO sales (
        store_id, sub_brand_id, customer_id, channel_id,
        cod_sale1, cod_sale2, customer_name, sale_status_desc,
        total_amount_items, total_discount, total_increase,
        delivery_fee, service_tax_fee, total_amount, value_paid,
        production_seconds, delivery_seconds, people_quantity,
        discount_reason, increase_reason, origin
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *
    `;

    const params = [
      store_id,
      sub_brand_id,
      customer_id,
      channel_id,
      cod_sale1,
      cod_sale2,
      customer_name,
      sale_status_desc,
      total_amount_items,
      total_discount,
      total_increase,
      delivery_fee,
      service_tax_fee,
      total_amount,
      value_paid,
      production_seconds,
      delivery_seconds,
      people_quantity,
      discount_reason,
      increase_reason,
      origin,
    ];

    const result = await pool.query(query, params);
    return result.rows[0];
  }

  static async getSalesSummary(filters = {}) {
    let query = `
      SELECT 
        COUNT(*) as total_sales,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_ticket,
        SUM(total_amount_items) as total_items_amount,
        SUM(total_discount) as total_discounts,
        SUM(delivery_fee) as total_delivery_fees
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
      query += " WHERE " + conditions.join(" AND ");
    }

    const result = await pool.query(query, params);
    return result.rows[0];
  }
}

export default Sale;
