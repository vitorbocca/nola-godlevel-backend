import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// Nota: Seu arquivo swagger.js precisa ter export default ou export nomeado para funcionar aqui
import { swaggerUi, specs } from './config/swagger.js'; 
import 'dotenv/config'; // Usar a sintaxe ESM para dotenv

// Importar configuração do banco
import './config/database.js'; // Deve ser um import, sem require()

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: process.env.API_RATE_LIMIT || 100,
  message: {
    success: false,
    error: 'Muitas requisições deste IP, tente novamente em 15 minutos.'
  }
});
app.use(limiter);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Importar rotas (USANDO IMPORT DINÂMICO PARA COMPATIBILIDADE)
// Nota: O Node.js exige a extensão .js
import dashboardRoutes from './routes/dashboard.js';
import salesRoutes from './routes/sales.js';
import productsRoutes from './routes/products.js';
import storesRoutes from './routes/stores.js';
import channelsRoutes from './routes/channels.js';

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'NOLA GodLevel API Documentation'
}));

// Rotas da API
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/channels', channelsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'NOLA GodLevel Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      docs: '/api-docs',
      dashboard: '/api/dashboard',
      sales: '/api/sales',
      products: '/api/products',
      stores: '/api/stores',
      channels: '/api/channels'
    }
  });
});

// Middleware de tratamento de erros (omito o bloco, mas assumo que está no seu arquivo)

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`📊 API disponível em: http://localhost:${PORT}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

export default app;
