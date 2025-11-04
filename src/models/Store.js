import pool from '../config/database.js';

class Store {
  static async findAll(filters = {}) {
    let query = `
      SELECT s.*, b.name as brand_name, sb.name as sub_brand_name
      FROM stores s
      JOIN brands b ON s.brand_id = b.id
      JOIN sub_brands sb ON s.sub_brand_id = sb.id
    `;
    let params = [];
    let paramCount = 0;

    const conditions = [];
    
    if (filters.brand_id) {
      paramCount++;
      conditions.push(`s.brand_id = $${paramCount}`);
      params.push(filters.brand_id);
    }
    
    if (filters.sub_brand_id) {
      paramCount++;
      conditions.push(`s.sub_brand_id = $${paramCount}`);
      params.push(filters.sub_brand_id);
    }
    
    if (filters.is_active !== undefined) {
      paramCount++;
      conditions.push(`s.is_active = $${paramCount}`);
      params.push(filters.is_active);
    }
    
    if (filters.city) {
      paramCount++;
      conditions.push(`s.city ILIKE $${paramCount}`);
      params.push(`%${filters.city}%`);
    }
    
    if (filters.state) {
      paramCount++;
      conditions.push(`s.state = $${paramCount}`);
      params.push(filters.state);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY s.name';
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT s.*, b.name as brand_name, sb.name as sub_brand_name
      FROM stores s
      JOIN brands b ON s.brand_id = b.id
      JOIN sub_brands sb ON s.sub_brand_id = sb.id
      WHERE s.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(storeData) {
    const {
      brand_id, sub_brand_id, name, city, state, district,
      address_street, address_number, zipcode, latitude, longitude,
      is_active, is_own, is_holding, creation_date
    } = storeData;
    
    const query = `
      INSERT INTO stores (
        brand_id, sub_brand_id, name, city, state, district,
        address_street, address_number, zipcode, latitude, longitude,
        is_active, is_own, is_holding, creation_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;
    
    const params = [
      brand_id, sub_brand_id, name, city, state, district,
      address_street, address_number, zipcode, latitude, longitude,
      is_active, is_own, is_holding, creation_date
    ];
    
    const result = await pool.query(query, params);
    return result.rows[0];
  }

  static async update(id, storeData) {
    const {
      brand_id, sub_brand_id, name, city, state, district,
      address_street, address_number, zipcode, latitude, longitude,
      is_active, is_own, is_holding, creation_date
    } = storeData;
    
    const query = `
      UPDATE stores SET 
        brand_id = $1, sub_brand_id = $2, name = $3, city = $4, state = $5, district = $6,
        address_street = $7, address_number = $8, zipcode = $9, latitude = $10, longitude = $11,
        is_active = $12, is_own = $13, is_holding = $14, creation_date = $15
      WHERE id = $16
      RETURNING *
    `;
    
    const params = [
      brand_id, sub_brand_id, name, city, state, district,
      address_street, address_number, zipcode, latitude, longitude,
      is_active, is_own, is_holding, creation_date, id
    ];
    
    const result = await pool.query(query, params);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM stores WHERE id = $1';
    await pool.query(query, [id]);
    return true;
  }
}

export default Store;

