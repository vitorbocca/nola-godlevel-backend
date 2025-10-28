const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { swaggerUi, specs } = require('./config/swagger');
require('dotenv').config();

// Importar configuração do banco
require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
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

// Importar rotas
const dashboardRoutes = require('./routes/dashboard');
const salesRoutes = require('./routes/sales');
const productsRoutes = require('./routes/products');
const storesRoutes = require('./routes/stores');

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

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Verifica o status da API e conectividade com banco de dados
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API funcionando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T12:00:00.000Z"
 *                 environment:
 *                   type: string
 *                   example: "development"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Informações da API
 *     description: Retorna informações básicas sobre a API e endpoints disponíveis
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Informações da API retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "NOLA GodLevel Backend API"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     dashboard:
 *                       type: string
 *                       example: "/api/dashboard"
 *                     sales:
 *                       type: string
 *                       example: "/api/sales"
 *                     products:
 *                       type: string
 *                       example: "/api/products"
 *                     stores:
 *                       type: string
 *                       example: "/api/stores"
 *                     health:
 *                       type: string
 *                       example: "/health"
 *                 documentation:
 *                   type: object
 *                   properties:
 *                     swagger:
 *                       type: string
 *                       example: "/api-docs"
 *                     readme:
 *                       type: string
 *                       example: "Consulte o README.md para mais informações"
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'NOLA GodLevel Backend API',
    version: '1.0.0',
    endpoints: {
      dashboard: '/api/dashboard',
      sales: '/api/sales',
      products: '/api/products',
      stores: '/api/stores',
      health: '/health'
    },
    documentation: {
      swagger: '/api-docs',
      readme: 'Consulte o README.md para mais informações'
    }
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  
  // Erro de validação do Joi
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      error: 'Dados inválidos',
      details: err.details.map(detail => detail.message)
    });
  }
  
  // Erro de conexão com banco
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      error: 'Serviço indisponível - Problema de conexão com banco de dados'
    });
  }
  
  // Erro genérico
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`📊 API disponível em: http://localhost:${PORT}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

module.exports = app;