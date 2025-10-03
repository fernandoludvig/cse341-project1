const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { body } = require('express-validator');

const transactionValidation = [
  body('userId').isMongoId().withMessage('userId deve ser um ID válido'),
  body('amount').isFloat({ min: 0 }).withMessage('Valor deve ser um número positivo'),
  body('description').notEmpty().trim().withMessage('Descrição é obrigatória'),
  body('category').notEmpty().trim().withMessage('Categoria é obrigatória'),
  body('type').isIn(['income', 'expense']).withMessage('Tipo deve ser "income" ou "expense"'),
  body('date').optional().isISO8601().withMessage('Data deve ser válida')
];

/**
 * @swagger
 * /finance-tracker/api/transactions:
 *   post:
 *     summary: Criar nova transação
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', transactionValidation, transactionController.createTransaction);

/**
 * @swagger
 * /finance-tracker/api/transactions:
 *   get:
 *     summary: Listar transações
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do usuário
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filtrar por tipo de transação
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
 *     responses:
 *       200:
 *         description: Lista de transações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', transactionController.getTransactions);

/**
 * @swagger
 * /api/transactions/summary:
 *   get:
 *     summary: Obter resumo financeiro
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Resumo financeiro
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalIncome:
 *                       type: number
 *                     totalExpense:
 *                       type: number
 *                     balance:
 *                       type: number
 *       400:
 *         description: userId é obrigatório
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/summary', transactionController.getTransactionSummary);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Buscar transação por ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da transação
 *     responses:
 *       200:
 *         description: Transação encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transação não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', transactionController.getTransactionById);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Atualizar transação
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da transação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 *       404:
 *         description: Transação não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', transactionValidation, transactionController.updateTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Deletar transação
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da transação
 *     responses:
 *       200:
 *         description: Transação deletada com sucesso
 *       404:
 *         description: Transação não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
