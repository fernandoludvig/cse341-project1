const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { body } = require('express-validator');

const budgetValidation = [
  body('userId').isMongoId().withMessage('userId deve ser um ID válido'),
  body('month').isInt({ min: 1, max: 12 }).withMessage('Mês deve ser um número entre 1 e 12'),
  body('year').isInt({ min: 2000 }).withMessage('Ano deve ser um número maior que 2000'),
  body('totalBudget').isFloat({ min: 0 }).withMessage('Orçamento total deve ser um número positivo'),
  body('categories').optional().isArray().withMessage('Categorias devem ser um array'),
  body('categories.*.categoryId').optional().isMongoId().withMessage('ID da categoria deve ser válido'),
  body('categories.*.budgetedAmount').optional().isFloat({ min: 0 }).withMessage('Valor orçado deve ser um número positivo'),
  body('categories.*.spentAmount').optional().isFloat({ min: 0 }).withMessage('Valor gasto deve ser um número positivo'),
  body('notes').optional().isString().withMessage('Notas devem ser texto')
];

const budgetUpdateValidation = [
  body('userId').optional().isMongoId().withMessage('userId deve ser um ID válido'),
  body('month').optional().isInt({ min: 1, max: 12 }).withMessage('Mês deve ser um número entre 1 e 12'),
  body('year').optional().isInt({ min: 2000 }).withMessage('Ano deve ser um número maior que 2000'),
  body('totalBudget').optional().isFloat({ min: 0 }).withMessage('Orçamento total deve ser um número positivo'),
  body('totalSpent').optional().isFloat({ min: 0 }).withMessage('Total gasto deve ser um número positivo'),
  body('categories').optional().isArray().withMessage('Categorias devem ser um array'),
  body('categories.*.categoryId').optional().isMongoId().withMessage('ID da categoria deve ser válido'),
  body('categories.*.budgetedAmount').optional().isFloat({ min: 0 }).withMessage('Valor orçado deve ser um número positivo'),
  body('categories.*.spentAmount').optional().isFloat({ min: 0 }).withMessage('Valor gasto deve ser um número positivo'),
  body('notes').optional().isString().withMessage('Notas devem ser texto')
];

/**
 * @swagger
 * components:
 *   schemas:
 *     BudgetCategory:
 *       type: object
 *       required:
 *         - categoryId
 *         - budgetedAmount
 *       properties:
 *         categoryId:
 *           type: string
 *           description: ID da categoria
 *           example: "507f1f77bcf86cd799439011"
 *         budgetedAmount:
 *           type: number
 *           minimum: 0
 *           description: Valor orçado para a categoria
 *           example: 300.00
 *         spentAmount:
 *           type: number
 *           minimum: 0
 *           description: Valor gasto na categoria
 *           example: 250.00
 *     Budget:
 *       type: object
 *       required:
 *         - userId
 *         - month
 *         - year
 *         - totalBudget
 *       properties:
 *         userId:
 *           type: string
 *           description: ID do usuário proprietário do orçamento
 *           example: "507f1f77bcf86cd799439011"
 *         month:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           description: Mês do orçamento
 *           example: 10
 *         year:
 *           type: integer
 *           minimum: 2000
 *           description: Ano do orçamento
 *           example: 2025
 *         totalBudget:
 *           type: number
 *           minimum: 0
 *           description: Orçamento total
 *           example: 2000.00
 *         totalSpent:
 *           type: number
 *           minimum: 0
 *           description: Total gasto
 *           example: 1500.00
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BudgetCategory'
 *         notes:
 *           type: string
 *           description: Notas sobre o orçamento
 *           example: "Orçamento para viagem de férias"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do orçamento
 *         remainingBudget:
 *           type: number
 *           description: Orçamento restante (virtual)
 *           example: 500.00
 *         utilizationPercentage:
 *           type: integer
 *           description: Percentual de utilização do orçamento (virtual)
 *           example: 75
 */

/**
 * @swagger
 * /api/budgets:
 *   post:
 *     summary: Criar novo orçamento
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Budget'
 *     responses:
 *       201:
 *         description: Orçamento criado com sucesso
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
 *                   example: "Orçamento criado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Budget'
 *       400:
 *         description: Dados inválidos ou orçamento já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', budgetValidation, budgetController.createBudget);

/**
 * @swagger
 * /api/budgets:
 *   get:
 *     summary: Listar orçamentos
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do usuário
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filtrar por ano
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Filtrar por mês
 *     responses:
 *       200:
 *         description: Lista de orçamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Budget'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', budgetController.getBudgets);

/**
 * @swagger
 * /api/budgets/current:
 *   get:
 *     summary: Buscar orçamento do mês atual
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Orçamento do mês atual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Budget'
 *       404:
 *         description: Orçamento não encontrado para o mês atual
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/current', budgetController.getCurrentBudget);

/**
 * @swagger
 * /api/budgets/summary/{userId}:
 *   get:
 *     summary: Resumo anual de orçamentos de um usuário
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Ano para o resumo (padrão: ano atual)
 *     responses:
 *       200:
 *         description: Resumo de orçamentos do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     year:
 *                       type: integer
 *                       example: 2025
 *                     totalBudgets:
 *                       type: integer
 *                       example: 12
 *                     totalBudgetedAmount:
 *                       type: number
 *                       example: 24000.00
 *                     totalSpentAmount:
 *                       type: number
 *                       example: 18000.00
 *                     overallUtilizationPercentage:
 *                       type: integer
 *                       example: 75
 *                     monthlyBreakdown:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: integer
 *                           budgeted:
 *                             type: number
 *                           spent:
 *                             type: number
 *                           remaining:
 *                             type: number
 *                           utilizationPercentage:
 *                             type: integer
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/summary/:userId', budgetController.getBudgetSummary);

/**
 * @swagger
 * /api/budgets/{id}:
 *   get:
 *     summary: Buscar orçamento por ID
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do orçamento
 *     responses:
 *       200:
 *         description: Orçamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Budget'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Orçamento não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', budgetController.getBudgetById);

/**
 * @swagger
 * /api/budgets/{id}:
 *   put:
 *     summary: Atualizar orçamento
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do orçamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Budget'
 *     responses:
 *       200:
 *         description: Orçamento atualizado com sucesso
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
 *                   example: "Orçamento atualizado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Budget'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Orçamento não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', budgetUpdateValidation, budgetController.updateBudget);

/**
 * @swagger
 * /api/budgets/{id}:
 *   delete:
 *     summary: Deletar orçamento
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do orçamento
 *     responses:
 *       200:
 *         description: Orçamento deletado com sucesso
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
 *                   example: "Orçamento deletado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Budget'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Orçamento não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;