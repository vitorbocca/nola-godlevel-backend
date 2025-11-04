import express from 'express';
import DashboardService from '../services/DashboardService.js';
import { validateDashboardFilters } from '../middleware/validation.js';

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/metric-options:
 *   get:
 *     summary: Lista de métricas disponíveis
 *     description: Retorna opções únicas de métricas para o dashboard dinâmico
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Opções de métricas retornadas com sucesso
 */
router.get('/metric-options', async (req, res) => {
  try {
    const data = DashboardService.retrieveUniqueMetricOptions();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao buscar opções de métricas:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/dashboard/query:
 *   post:
 *     summary: Consulta dinâmica por IDs de métricas
 *     description: Retorna dados para uma ou mais métricas com filtros opcionais
 *     tags: [Dashboard]
 */
router.post('/query', async (req, res) => {
  try {
    const { ids = [], stores = [], channels = [], sub_brands = [], period = {}, group_by_dimension = null } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'ids_required' });
    }
    const data = await DashboardService.queryByMetricOptionId(ids, stores, channels, sub_brands, period, group_by_dimension);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Erro na consulta dinâmica de métricas:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /api/dashboard/metrics:
 *   get:
 *     summary: Métricas gerais do dashboard
 *     description: Retorna todas as métricas do dashboard em uma única requisição
 *     tags: [Dashboard]
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

export default router;