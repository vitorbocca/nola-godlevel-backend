import express from 'express';
import pool from '../config/database.js';

const router = express.Router(); 

// ... (Outros imports)

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                id AS value,     -- O ID do canal é o valor que o frontend deve enviar
                name AS label    -- O nome do canal é o que o usuário vê
            FROM channels 
            ORDER BY name
        `);
        
        // O frontend espera um array de { label: "...", value: "..." }
        res.json({ success: true, data: result.rows }); // Adicionei 'success' e 'data' para consistência
        
    } catch (error) {
        console.error('Erro 500 ao buscar lista de canais:', error.stack);
        // Seu Middleware de Erro deve capturar isso e retornar o 500.
        res.status(500).json({ success: false, error: 'Erro interno ao buscar canais.' });
    }
});

export default router;