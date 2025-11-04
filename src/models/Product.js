import pool from '../config/database.js';

class Product {
  static async findAll(filters = {}) {
    let query = `
      SELECT p.*, 
             b.name as brand_name,
             sb.name as sub_brand_name,
             c.name as category_name
      FROM products p
      JOIN brands b ON p.brand_id = b.id
      JOIN sub_brands sb ON p.sub_brand_id = sb.id
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    let params = [];
    let paramCount = 0;

    const conditions = [];
    
    if (filters.brand_id) {
      paramCount++;
      conditions.push(`p.brand_id = $${paramCount}`);
      params.push(filters.brand_id);
    }
    
    if (filters.sub_brand_id) {
      paramCount++;
      conditions.push(`p.sub_brand_id = $${paramCount}`);
      params.push(filters.sub_brand_id);
    }
    
    if (filters.category_id) {
      paramCount++;
      conditions.push(`p.category_id = $${paramCount}`);
      params.push(filters.category_id);
    }
    
    if (filters.name) {
      paramCount++;
      conditions.push(`p.name ILIKE $${paramCount}`);
      params.push(`%${filters.name}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY p.name';
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT p.*, 
             b.name as brand_name,
             sb.name as sub_brand_name,
             c.name as category_name
      FROM products p
      JOIN brands b ON p.brand_id = b.id
      JOIN sub_brands sb ON p.sub_brand_id = sb.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(productData) {
    const { brand_id, sub_brand_id, category_id, name, pos_uuid } = productData;
    const query = 'INSERT INTO products (brand_id, sub_brand_id, category_id, name, pos_uuid) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const result = await pool.query(query, [brand_id, sub_brand_id, category_id, name, pos_uuid]);
    return result.rows[0];
  }

  static async update(id, productData) {
    const { brand_id, sub_brand_id, category_id, name, pos_uuid } = productData;
    const query = 'UPDATE products SET brand_id = $1, sub_brand_id = $2, category_id = $3, name = $4, pos_uuid = $5 WHERE id = $6 RETURNING *';
    const result = await pool.query(query, [brand_id, sub_brand_id, category_id, name, pos_uuid, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'UPDATE products SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1';
    await pool.query(query, [id]);
    return true;
  }

  static async getTopSelling(filters = {}) {
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
    `;
    
    if (filters.limit) {
      query += ` LIMIT $${paramCount + 1}`;
      params.push(filters.limit);
    }
    
    const result = await pool.query(query, params);
    return result.rows;
  }
}

export default Product;

