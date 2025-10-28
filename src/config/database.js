const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.POSTGRES_DB || process.env.DB_NAME || 'challenge_db',
  user: process.env.POSTGRES_USER || process.env.DB_USER || 'challenge',
  password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || 'challenge_2024',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Teste de conexão
pool.on('connect', () => {
  console.log('Conectado ao banco de dados PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no cliente PostgreSQL:', err);
  process.exit(-1);
});

module.exports = pool;
