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
