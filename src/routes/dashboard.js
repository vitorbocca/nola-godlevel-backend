const express = require('express');
const router = express.Router();
const DashboardService = require('../services/DashboardService');
const { validateDashboardFilters } = require('../middleware/validation');

/**
 * @swagger
 * /api/dashboard/metrics:
 *   get:
 *     summary: Métricas gerais do dashboard
 *     description: Retorna todas as métricas do dashboard em uma única requisição
 *     tags: [Dashboard]
 *     parameters:
 *       - $ref: '#/components/parameters/StoreId'
 *       - $ref: '#/components/parameters/SubBrandId'
 *       - $ref: '#/components/parameters/BrandId'
 *       - $ref: '#/components/parameters/DateFrom'
 *       - $ref: '#/components/parameters/DateTo'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         description: Métricas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/DashboardMetrics'
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/metrics', validateDashboardFilters, async (req, res) => {
  try {
    const filters = req.query;
    const metrics = await DashboardService.getDashboardMetrics(filters);
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Erro ao buscar métricas do dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/dashboard/average-ticket:
 *   get:
 *     summary: Ticket médio
 *     description: Retorna o ticket médio do período especificado
 *     tags: [Dashboard]
 *     parameters:
 *       - $ref: '#/components/parameters/StoreId'
 *       - $ref: '#/components/parameters/SubBrandId'
 *       - $ref: '#/components/parameters/BrandId'
 *       - $ref: '#/components/parameters/DateFrom'
 *       - $ref: '#/components/parameters/DateTo'
 *     responses:
 *       200:
 *         description: Ticket médio retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         average_ticket:
 *                           type: string
 *                           example: "358.54"
 *                         total_sales:
 *                           type: string
 *                           example: "534079"
 *                         total_revenue:
 *                           type: string
 *                           example: "191491036.18"
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/average-ticket', validateDashboardFilters, async (req, res) => {
  try {
    const filters = req.query;
    const averageTicket = await DashboardService.getAverageTicket(filters);
    
    res.json({
      success: true,
      data: averageTicket
    });
  } catch (error) {
    console.error('Erro ao buscar ticket médio:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/dashboard/top-products:
 *   get:
 *     summary: Produtos mais vendidos
 *     description: Retorna os produtos mais vendidos com métricas detalhadas
 *     tags: [Dashboard]
 *     parameters:
 *       - $ref: '#/components/parameters/StoreId'
 *       - $ref: '#/components/parameters/SubBrandId'
 *       - $ref: '#/components/parameters/BrandId'
 *       - $ref: '#/components/parameters/DateFrom'
 *       - $ref: '#/components/parameters/DateTo'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         description: Produtos mais vendidos retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 169
 *                           product_name:
 *                             type: string
 *                             example: "Lasanha G #003"
 *                           total_quantity_sold:
 *                             type: number
 *                             example: 15014
 *                           total_revenue:
 *                             type: number
 *                             example: 1608149.54
 *                           total_sales_count:
 *                             type: string
 *                             example: "7525"
 *                           average_price:
 *                             type: number
 *                             example: 107.11
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/top-products', validateDashboardFilters, async (req, res) => {
  try {
    const filters = req.query;
    const topProducts = await DashboardService.getTopSellingProducts(filters);
    
    res.json({
      success: true,
      data: topProducts
    });
  } catch (error) {
    console.error('Erro ao buscar produtos mais vendidos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/dashboard/revenue-by-hour:
 *   get:
 *     summary: Faturamento por hora
 *     description: Retorna o faturamento por hora do dia
 *     tags: [Dashboard]
 *     parameters:
 *       - $ref: '#/components/parameters/StoreId'
 *       - $ref: '#/components/parameters/SubBrandId'
 *       - $ref: '#/components/parameters/BrandId'
 *       - $ref: '#/components/parameters/DateFrom'
 *       - $ref: '#/components/parameters/DateTo'
 *     responses:
 *       200:
 *         description: Faturamento por hora retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           hour:
 *                             type: integer
 *                             example: 12
 *                           sales_count:
 *                             type: integer
 *                             example: 15
 *                           total_revenue:
 *                             type: string
 *                             example: "382.50"
 *                           average_ticket:
 *                             type: string
 *                             example: "25.50"
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/revenue-by-hour', validateDashboardFilters, async (req, res) => {
  try {
    const filters = req.query;
    const revenueByHour = await DashboardService.getRevenueByHour(filters);
    
    res.json({
      success: true,
      data: revenueByHour
    });
  } catch (error) {
    console.error('Erro ao buscar faturamento por hora:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/dashboard/revenue-by-day:
 *   get:
 *     summary: Faturamento por dia da semana
 *     description: Retorna o faturamento por dia da semana
 *     tags: [Dashboard]
 *     parameters:
 *       - $ref: '#/components/parameters/StoreId'
 *       - $ref: '#/components/parameters/SubBrandId'
 *       - $ref: '#/components/parameters/BrandId'
 *       - $ref: '#/components/parameters/DateFrom'
 *       - $ref: '#/components/parameters/DateTo'
 *     responses:
 *       200:
 *         description: Faturamento por dia retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           day_of_week:
 *                             type: integer
 *                             example: 1
 *                           day_name:
 *                             type: string
 *                             example: "Segunda"
 *                           sales_count:
 *                             type: integer
 *                             example: 20
 *                           total_revenue:
 *                             type: string
 *                             example: "510.00"
 *                           average_ticket:
 *                             type: string
 *                             example: "25.50"
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/revenue-by-day', validateDashboardFilters, async (req, res) => {
  try {
    const filters = req.query;
    const revenueByDay = await DashboardService.getRevenueByDayOfWeek(filters);
    
    res.json({
      success: true,
      data: revenueByDay
    });
  } catch (error) {
    console.error('Erro ao buscar faturamento por dia:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/dashboard/sales-by-channel:
 *   get:
 *     summary: Vendas por canal
 *     description: Retorna vendas por canal (Presencial vs Delivery)
 *     tags: [Dashboard]
 *     parameters:
 *       - $ref: '#/components/parameters/StoreId'
 *       - $ref: '#/components/parameters/SubBrandId'
 *       - $ref: '#/components/parameters/BrandId'
 *       - $ref: '#/components/parameters/DateFrom'
 *       - $ref: '#/components/parameters/DateTo'
 *     responses:
 *       200:
 *         description: Vendas por canal retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           channel_id:
 *                             type: integer
 *                             example: 1
 *                           channel_name:
 *                             type: string
 *                             example: "Presencial"
 *                           channel_type:
 *                             type: string
 *                             example: "P"
 *                           sales_count:
 *                             type: string
 *                             example: "100"
 *                           total_revenue:
 *                             type: string
 *                             example: "2550.00"
 *                           average_ticket:
 *                             type: string
 *                             example: "25.50"
 *                           total_delivery_fees:
 *                             type: string
 *                             example: "0.00"
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/sales-by-channel', validateDashboardFilters, async (req, res) => {
  try {
    const filters = req.query;
    const salesByChannel = await DashboardService.getSalesByChannel(filters);
    
    res.json({
      success: true,
      data: salesByChannel
    });
  } catch (error) {
    console.error('Erro ao buscar vendas por canal:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/dashboard/period-comparison:
 *   get:
 *     summary: Comparação com período anterior
 *     description: Compara métricas com o período anterior
 *     tags: [Dashboard]
 *     parameters:
 *       - $ref: '#/components/parameters/StoreId'
 *       - $ref: '#/components/parameters/SubBrandId'
 *       - $ref: '#/components/parameters/BrandId'
 *       - $ref: '#/components/parameters/DateFrom'
 *       - $ref: '#/components/parameters/DateTo'
 *     responses:
 *       200:
 *         description: Comparação de períodos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         current:
 *                           type: object
 *                           properties:
 *                             average_ticket:
 *                               type: string
 *                               example: "25.50"
 *                             total_sales:
 *                               type: string
 *                               example: "150"
 *                             total_revenue:
 *                               type: string
 *                               example: "3825.00"
 *                         previous:
 *                           type: object
 *                           properties:
 *                             average_ticket:
 *                               type: string
 *                               example: "24.00"
 *                             total_sales:
 *                               type: string
 *                               example: "120"
 *                             total_revenue:
 *                               type: string
 *                               example: "2880.00"
 *                         growth:
 *                           type: object
 *                           properties:
 *                             revenue:
 *                               type: number
 *                               example: 945.00
 *                             revenue_percentage:
 *                               type: number
 *                               example: 32.81
 *                             sales_count:
 *                               type: number
 *                               example: 30
 *                             sales_percentage:
 *                               type: number
 *                               example: 25.00
 *                             average_ticket:
 *                               type: number
 *                               example: 1.50
 *                             ticket_percentage:
 *                               type: number
 *                               example: 6.25
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/period-comparison', validateDashboardFilters, async (req, res) => {
  try {
    const filters = req.query;
    const comparison = await DashboardService.getPeriodComparison(filters);
    
    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Erro ao buscar comparação de períodos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;

