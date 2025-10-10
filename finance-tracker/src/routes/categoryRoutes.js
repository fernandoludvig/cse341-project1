const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { requireAuth } = require('../middleware/auth');
const { body } = require('express-validator');

const categoryValidation = [
  body('userId').isMongoId().withMessage('userId deve ser um ID válido'),
  body('name').notEmpty().trim().withMessage('Nome da categoria é obrigatório'),
  body('type').isIn(['income', 'expense']).withMessage('Tipo deve ser "income" ou "expense"'),
  body('budgetLimit').optional().isFloat({ min: 0 }).withMessage('Limite do orçamento deve ser um número positivo'),
  body('color').matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('Cor deve estar em formato hexadecimal válido (#RRGGBB ou #RGB)'),
  body('isDefault').optional().isBoolean().withMessage('isDefault deve ser um valor booleano')
];

const categoryUpdateValidation = [
  body('userId').optional().isMongoId().withMessage('userId deve ser um ID válido'),
  body('name').optional().notEmpty().trim().withMessage('Nome da categoria não pode estar vazio'),
  body('type').optional().isIn(['income', 'expense']).withMessage('Tipo deve ser "income" ou "expense"'),
  body('budgetLimit').optional().isFloat({ min: 0 }).withMessage('Limite do orçamento deve ser um número positivo'),
  body('color').optional().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('Cor deve estar em formato hexadecimal válido (#RRGGBB ou #RGB)'),
  body('isDefault').optional().isBoolean().withMessage('isDefault deve ser um valor booleano')
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - userId
 *         - name
 *         - type
 *         - color
 *       properties:
 *         userId:
 *           type: string
 *           description: ID do usuário proprietário da categoria
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           description: Nome da categoria
 *           example: "Alimentação"
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           description: Tipo da categoria
 *           example: "expense"
 *         budgetLimit:
 *           type: number
 *           minimum: 0
 *           description: Limite do orçamento para a categoria
 *           example: 500.00
 *         color:
 *           type: string
 *           pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
 *           description: Cor da categoria em formato hexadecimal
 *           example: "#FF5733"
 *         isDefault:
 *           type: boolean
 *           description: Se é uma categoria padrão do sistema
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação da categoria
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Criar nova categoria
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
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
 *                   example: "Categoria criada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Dados inválidos ou categoria já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', requireAuth, categoryValidation, categoryController.createCategory);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Listar categorias
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
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
 *         description: Filtrar por tipo de categoria
 *     responses:
 *       200:
 *         description: Lista de categorias
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
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', categoryController.getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Buscar categoria por ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', categoryController.getCategoryById);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Atualizar categoria
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
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
 *                   example: "Categoria atualizada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', requireAuth, categoryUpdateValidation, categoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Deletar categoria
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria deletada com sucesso
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
 *                   example: "Categoria deletada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', categoryController.deleteCategory);

/**
 * @swagger
 * /api/categories/user/{userId}:
 *   get:
 *     summary: Buscar categorias de um usuário específico
 *     tags: [Categories]
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filtrar por tipo de categoria
 *     responses:
 *       200:
 *         description: Categorias do usuário
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
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       400:
 *         description: ID do usuário inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/user/:userId', categoryController.getUserCategories);

module.exports = router;