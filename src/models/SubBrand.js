import pool from '../config/database.js';

class SubBrand {
  static async findAll(brandId = null) {
    let query = `
      SELECT sb.*, b.name as brand_name 
      FROM sub_brands sb 
      JOIN brands b ON sb.brand_id = b.id
    `;
    let params = [];
    
    if (brandId) {
      query += ' WHERE sb.brand_id = $1';
      params.push(brandId);
    }
    
    query += ' ORDER BY sb.name';
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT sb.*, b.name as brand_name 
      FROM sub_brands sb 
      JOIN brands b ON sb.brand_id = b.id
      WHERE sb.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(subBrandData) {
    const { brand_id, name } = subBrandData;
    const query = 'INSERT INTO sub_brands (brand_id, name) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [brand_id, name]);
    return result.rows[0];
  }

  static async update(id, subBrandData) {
    const { brand_id, name } = subBrandData;
    const query = 'UPDATE sub_brands SET brand_id = $1, name = $2 WHERE id = $3 RETURNING *';
    const result = await pool.query(query, [brand_id, name, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM sub_brands WHERE id = $1';
    await pool.query(query, [id]);
    return true;
  }
}

export default SubBrand;

