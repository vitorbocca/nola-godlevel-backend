import pool from '../config/database.js';

class Brand {
  static async findAll() {
    const query = 'SELECT * FROM brands ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM brands WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(brandData) {
    const { name } = brandData;
    const query = 'INSERT INTO brands (name) VALUES ($1) RETURNING *';
    const result = await pool.query(query, [name]);
    return result.rows[0];
  }

  static async update(id, brandData) {
    const { name } = brandData;
    const query = 'UPDATE brands SET name = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [name, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM brands WHERE id = $1';
    await pool.query(query, [id]);
    return true;
  }
}

export default Brand;

