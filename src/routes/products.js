import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar produtos com filtros
 *     description: Retorna uma lista de produtos com filtros opcionais
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/BrandId'
 *       - $ref: '#/components/parameters/SubBrandId'
 *       - name: category_id
 *         in: query
 *         description: ID da categoria
 *         required: false
 *         schema:
 *           type: integer
 *       - name: name
 *         in: query
 *         description: Nome do produto (busca parcial)
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
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
 *                         $ref: '#/components/schemas/Product'
 *                     count:
 *                       type: integer
 *                       example: 50
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
    const products = await Product.findAll(filters);
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     description: Retorna um produto específico pelo ID
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
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
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Criar novo produto
 *     description: Cria um novo produto no sistema
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand_id
 *               - name
 *             properties:
 *               brand_id:
 *                 type: integer
 *                 example: 1
 *               sub_brand_id:
 *                 type: integer
 *                 example: 1
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Big Mac"
 *               pos_uuid:
 *                 type: string
 *                 example: "uuid-123"
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
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
    const productData = req.body;
    const product = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    const product = await Product.update(id, productData);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Deletar produto (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Product.delete(id);
    
    res.json({
      success: true,
      message: 'Produto deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Produtos mais vendidos
router.get('/analytics/top-selling', async (req, res) => {
  try {
    const filters = req.query;
    const topProducts = await Product.getTopSelling(filters);
    
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

export default router;

