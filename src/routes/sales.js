import express from 'express';
import Sale from '../models/Sale.js';

const router = express.Router();

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Listar vendas com filtros
 *     description: Retorna uma lista de vendas com filtros opcionais
 *     tags: [Sales]
 *     parameters:
 *       - $ref: '#/components/parameters/StoreId'
 *       - $ref: '#/components/parameters/SubBrandId'
 *       - $ref: '#/components/parameters/BrandId'
 *       - $ref: '#/components/parameters/DateFrom'
 *       - $ref: '#/components/parameters/DateTo'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         description: Lista de vendas retornada com sucesso
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
 *                         $ref: '#/components/schemas/Sale'
 *                     count:
 *                       type: integer
 *                       example: 100
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
  try {
    const filters = req.query;
    const sales = await Sale.findAll(filters);
    
    res.json({
      success: true,
      data: sales,
      count: sales.length
    });
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Buscar venda por ID
 *     description: Retorna uma venda específica pelo ID
 *     tags: [Sales]
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Venda encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Sale'
 *       404:
 *         description: Venda não encontrada
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
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id);
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        error: 'Venda não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: sale
    });
  } catch (error) {
    console.error('Erro ao buscar venda:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Criar nova venda
 *     description: Cria uma nova venda no sistema
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - store_id
 *               - channel_id
 *               - sale_status_desc
 *               - total_amount_items
 *               - total_amount
 *             properties:
 *               store_id:
 *                 type: integer
 *                 example: 1
 *               sub_brand_id:
 *                 type: integer
 *                 example: 1
 *               customer_id:
 *                 type: integer
 *                 example: 1
 *               channel_id:
 *                 type: integer
 *                 example: 1
 *               cod_sale1:
 *                 type: string
 *                 example: "V001"
 *               cod_sale2:
 *                 type: string
 *                 example: "V001-001"
 *               customer_name:
 *                 type: string
 *                 example: "João Silva"
 *               sale_status_desc:
 *                 type: string
 *                 example: "Finalizada"
 *               total_amount_items:
 *                 type: number
 *                 example: 25.50
 *               total_discount:
 *                 type: number
 *                 example: 2.50
 *               total_increase:
 *                 type: number
 *                 example: 0
 *               delivery_fee:
 *                 type: number
 *                 example: 5.00
 *               service_tax_fee:
 *                 type: number
 *                 example: 0
 *               total_amount:
 *                 type: number
 *                 example: 28.00
 *               value_paid:
 *                 type: number
 *                 example: 28.00
 *               production_seconds:
 *                 type: integer
 *                 example: 300
 *               delivery_seconds:
 *                 type: integer
 *                 example: 1800
 *               people_quantity:
 *                 type: integer
 *                 example: 2
 *               discount_reason:
 *                 type: string
 *                 example: "Promoção"
 *               increase_reason:
 *                 type: string
 *                 example: "Taxa de entrega"
 *               origin:
 *                 type: string
 *                 example: "POS"
 *     responses:
 *       201:
 *         description: Venda criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Dados inválidos
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
router.post('/', async (req, res) => {
  try {
    const saleData = req.body;
    const sale = await Sale.create(saleData);
    
    res.status(201).json({
      success: true,
      data: sale
    });
  } catch (error) {
    console.error('Erro ao criar venda:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/sales/summary:
 *   get:
 *     summary: Resumo de vendas
 *     description: Retorna um resumo das vendas com métricas agregadas
 *     tags: [Sales]
 *     parameters:
 *       - $ref: '#/components/parameters/StoreId'
 *       - $ref: '#/components/parameters/SubBrandId'
 *       - $ref: '#/components/parameters/BrandId'
 *       - $ref: '#/components/parameters/DateFrom'
 *       - $ref: '#/components/parameters/DateTo'
 *     responses:
 *       200:
 *         description: Resumo de vendas retornado com sucesso
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
 *                         total_sales:
 *                           type: string
 *                           example: "534079"
 *                         total_revenue:
 *                           type: string
 *                           example: "191491036.18"
 *                         average_ticket:
 *                           type: string
 *                           example: "358.54"
 *                         total_items_amount:
 *                           type: string
 *                           example: "180000000.00"
 *                         total_discounts:
 *                           type: string
 *                           example: "5000000.00"
 *                         total_delivery_fees:
 *                           type: string
 *                           example: "15000000.00"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/summary', async (req, res) => {
  try {
    const filters = req.query;
    const summary = await Sale.getSalesSummary(filters);
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Erro ao buscar resumo de vendas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

export default router;

