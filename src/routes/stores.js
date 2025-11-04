import express from 'express';
import Store from '../models/Store.js';
import Brand from '../models/Brand.js';
import SubBrand from '../models/SubBrand.js';

const router = express.Router();

// --- Função utilitária para mapear dados para { label: name, value: id } ---
const mapToLabelValue = (items) => {
    return items.map(item => ({ 
        label: item.name || item.label, 
        value: item.id || item.value 
    }));
};

// =========================================================================
// Rotas de Filtro (Prioridade do Dashboard)
// =========================================================================

/**
 * @swagger
 * /api/stores:
 * get:
 * summary: Retorna a lista de lojas no formato {value, label} para dropdowns de filtro.
 */
router.get('/', async (req, res) => {
    try {
        // A falha provavelmente ocorre aqui se o ORM não encontrar a tabela
        const stores = await Store.findAll(req.query); 
        
        // Mapeia para o formato ideal { label: 'Nome', value: ID }
        const mappedStores = mapToLabelValue(stores);
        
        res.json({
            success: true,
            data: mappedStores
        });
    } catch (error) {
        // SE ESTA ROTA FALHAR, ESTE É O ERRO QUE VOCÊ PRECISA VER NO CONSOLE DO NODE.JS
        console.error('Erro ao buscar lojas:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// =========================================================================
// Outras Rotas de Entidade (CRUD e Marcas) - Mantenha o restante como está
// =========================================================================

// Buscar loja por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const store = await Store.findById(id);
        
        if (!store) {
            return res.status(404).json({ success: false, error: 'Loja não encontrada' });
        }
        
        res.json({ success: true, data: store });
    } catch (error) {
        console.error('Erro ao buscar loja:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// [Rotas POST, PUT, DELETE omitidas para brevidade]

// Listar marcas (Mapeada)
router.get('/brands/list', async (req, res) => {
    try {
        const brands = await Brand.findAll();
        const mappedBrands = mapToLabelValue(brands);
        res.json({ success: true, data: mappedBrands });
    } catch (error) {
        console.error('Erro ao buscar marcas:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// Listar sub-marcas (Mapeada)
router.get('/sub-brands/list', async (req, res) => {
    try {
        const { brand_id } = req.query;
        const subBrands = await SubBrand.findAll(brand_id); 
        
        const mappedSubBrands = mapToLabelValue(subBrands);
        
        res.json({ success: true, data: mappedSubBrands });
    } catch (error) {
        console.error('Erro ao buscar sub-marcas:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

export default router;