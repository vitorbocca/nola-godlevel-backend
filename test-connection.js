const pool = require('./src/config/database');

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com o banco de dados...');
    
    const client = await pool.connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Teste básico de query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('⏰ Hora atual do banco:', result.rows[0].current_time);
    
    // Verificar se as tabelas existem
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 Tabelas encontradas:');
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    } else {
      console.log('  ⚠️  Nenhuma tabela encontrada. Execute o script database.sql primeiro.');
    }
    
    client.release();
    
    console.log('🎉 Teste de conexão concluído com sucesso!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:');
    console.error('Erro:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Possíveis soluções:');
      console.log('1. Verifique se o PostgreSQL está rodando');
      console.log('2. Confirme as credenciais no arquivo .env');
      console.log('3. Verifique se o banco "challenge_db" existe');
    }
    
    process.exit(1);
  }
}

testConnection();

