const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const Brand = require('../models/Brand');
const SubBrand = require('../models/SubBrand');

/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: Listar lojas com filtros
 *     description: Retorna uma lista de lojas com filtros opcionais
 *     tags: [Stores]
 *     parameters:
 *       - $ref: '#/components/parameters/BrandId'
 *       - $ref: '#/components/parameters/SubBrandId'
 *       - name: is_active
 *         in: query
 *         description: Status ativo da loja
 *         required: false
 *         schema:
 *           type: boolean
 *       - name: city
 *         in: query
 *         description: Cidade da loja (busca parcial)
 *         required: false
 *         schema:
 *           type: string
 *       - name: state
 *         in: query
 *         description: Estado da loja
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de lojas retornada com sucesso
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
 *                         $ref: '#/components/schemas/Store'
 *                     count:
 *                       type: integer
 *                       example: 25
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
    const stores = await Store.findAll(filters);
    
    res.json({
      success: true,
      data: stores,
      count: stores.length
    });
  } catch (error) {
    console.error('Erro ao buscar lojas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Buscar loja por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findById(id);
    
    if (!store) {
      return res.status(404).json({
        success: false,
        error: 'Loja não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Erro ao buscar loja:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Criar nova loja
router.post('/', async (req, res) => {
  try {
    const storeData = req.body;
    const store = await Store.create(storeData);
    
    res.status(201).json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Erro ao criar loja:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Atualizar loja
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const storeData = req.body;
    const store = await Store.update(id, storeData);
    
    if (!store) {
      return res.status(404).json({
        success: false,
        error: 'Loja não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Erro ao atualizar loja:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Deletar loja
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Store.delete(id);
    
    res.json({
      success: true,
      message: 'Loja deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar loja:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Listar marcas
router.get('/brands/list', async (req, res) => {
  try {
    const brands = await Brand.findAll();
    
    res.json({
      success: true,
      data: brands
    });
  } catch (error) {
    console.error('Erro ao buscar marcas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Listar sub-marcas
router.get('/sub-brands/list', async (req, res) => {
  try {
    const { brand_id } = req.query;
    const subBrands = await SubBrand.findAll(brand_id);
    
    res.json({
      success: true,
      data: subBrands
    });
  } catch (error) {
    console.error('Erro ao buscar sub-marcas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;

