const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🚀 Testando API NOLA GodLevel Backend\n');
  
  try {
    // Teste 1: Health Check
    console.log('1️⃣ Testando Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Status:', health.data.status);
    console.log('⏰ Timestamp:', health.data.timestamp);
    console.log('🌍 Environment:', health.data.environment);
    console.log('📦 Version:', health.data.version);
    console.log('');

    // Teste 2: Informações da API
    console.log('2️⃣ Testando Informações da API...');
    const info = await axios.get(`${BASE_URL}/`);
    console.log('✅ Message:', info.data.message);
    console.log('📋 Endpoints disponíveis:');
    Object.entries(info.data.endpoints).forEach(([key, value]) => {
      console.log(`   - ${key}: ${value}`);
    });
    console.log('');

    // Teste 3: Ticket Médio
    console.log('3️⃣ Testando Ticket Médio...');
    const avgTicket = await axios.get(`${BASE_URL}/api/dashboard/average-ticket`);
    const ticketData = avgTicket.data.data;
    console.log('💰 Ticket Médio: R$', parseFloat(ticketData.average_ticket).toFixed(2));
    console.log('📊 Total de Vendas:', parseInt(ticketData.total_sales).toLocaleString());
    console.log('💵 Receita Total: R$', parseFloat(ticketData.total_revenue).toLocaleString('pt-BR', {minimumFractionDigits: 2}));
    console.log('');

    // Teste 4: Produtos Mais Vendidos (Top 3)
    console.log('4️⃣ Testando Produtos Mais Vendidos (Top 3)...');
    const topProducts = await axios.get(`${BASE_URL}/api/dashboard/top-products`);
    console.log('🏆 Top 3 Produtos:');
    topProducts.data.data.slice(0, 3).forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.product_name}`);
      console.log(`      📦 Quantidade Vendida: ${parseInt(product.total_quantity_sold).toLocaleString()}`);
      console.log(`      💰 Receita: R$ ${parseFloat(product.total_revenue).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
      console.log(`      🛒 Vendas: ${parseInt(product.total_sales_count).toLocaleString()}`);
      console.log(`      💲 Preço Médio: R$ ${parseFloat(product.average_price).toFixed(2)}`);
      console.log('');
    });

    // Teste 5: Vendas por Canal
    console.log('5️⃣ Testando Vendas por Canal...');
    const salesByChannel = await axios.get(`${BASE_URL}/api/dashboard/sales-by-channel`);
    console.log('📈 Vendas por Canal:');
    salesByChannel.data.data.forEach(channel => {
      console.log(`   ${channel.channel_name} (${channel.channel_type === 'P' ? 'Presencial' : 'Delivery'}):`);
      console.log(`      🛒 Vendas: ${parseInt(channel.sales_count).toLocaleString()}`);
      console.log(`      💰 Receita: R$ ${parseFloat(channel.total_revenue).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
      console.log(`      💲 Ticket Médio: R$ ${parseFloat(channel.average_ticket).toFixed(2)}`);
      console.log('');
    });

    // Teste 6: Faturamento por Hora (primeiras 5 horas)
    console.log('6️⃣ Testando Faturamento por Hora (primeiras 5 horas)...');
    const revenueByHour = await axios.get(`${BASE_URL}/api/dashboard/revenue-by-hour`);
    console.log('⏰ Faturamento por Hora:');
    revenueByHour.data.data.slice(0, 5).forEach(hour => {
      console.log(`   ${hour.hour}:00 - ${hour.hour + 1}:00:`);
      console.log(`      🛒 Vendas: ${parseInt(hour.sales_count).toLocaleString()}`);
      console.log(`      💰 Receita: R$ ${parseFloat(hour.total_revenue).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
      console.log(`      💲 Ticket Médio: R$ ${parseFloat(hour.average_ticket).toFixed(2)}`);
      console.log('');
    });

    console.log('🎉 Todos os testes foram executados com sucesso!');
    console.log('📊 A API está funcionando perfeitamente e retornando dados reais do banco.');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testAPI();
