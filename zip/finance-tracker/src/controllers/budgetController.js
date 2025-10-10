const Budget = require('../models/Budget');
const Category = require('../models/Category');
const mongoose = require('mongoose');

const budgetController = {
  createBudget: async (req, res) => {
    try {
      const { userId, month, year, totalBudget, categories, notes } = req.body;

      const existingBudget = await Budget.findOne({ userId, month, year });
      if (existingBudget) {
        return res.status(400).json({
          success: false,
          message: 'Orçamento já existe para este usuário neste mês/ano'
        });
      }

      if (categories && categories.length > 0) {
        const categoryIds = categories.map(cat => cat.categoryId);
        const validCategories = await Category.find({
          _id: { $in: categoryIds },
          userId: userId
        });

        if (validCategories.length !== categoryIds.length) {
          return res.status(400).json({
            success: false,
            message: 'Uma ou mais categorias são inválidas ou não pertencem ao usuário'
          });
        }
      }

      const budget = new Budget({
        userId,
        month,
        year,
        totalBudget,
        categories: categories || [],
        notes: notes || ''
      });

      await budget.save();

      await budget.populate('categories.categoryId', 'name type color');
      await budget.populate('userId', 'firstName lastName email');

      res.status(201).json({
        success: true,
        message: 'Orçamento criado com sucesso',
        data: budget
      });
    } catch (error) {
      console.error('Erro ao criar orçamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  getBudgets: async (req, res) => {
    try {
      const { userId, year, month } = req.query;

      let filter = {};
      if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({
            success: false,
            message: 'userId deve ser um ID válido'
          });
        }
        filter.userId = userId;
      }
      if (year) {
        filter.year = parseInt(year);
      }
      if (month) {
        filter.month = parseInt(month);
      }

      const budgets = await Budget.find(filter)
        .populate('userId', 'firstName lastName email')
        .populate('categories.categoryId', 'name type color')
        .select('-__v')
        .sort({ year: -1, month: -1 });

      res.status(200).json({
        success: true,
        count: budgets.length,
        data: budgets
      });
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  getBudgetById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID do orçamento deve ser válido'
        });
      }

      const budget = await Budget.findById(id)
        .populate('userId', 'firstName lastName email')
        .populate('categories.categoryId', 'name type color')
        .select('-__v');

      if (!budget) {
        return res.status(404).json({
          success: false,
          message: 'Orçamento não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: budget
      });
    } catch (error) {
      console.error('Erro ao buscar orçamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  updateBudget: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID do orçamento deve ser válido'
        });
      }

      if (updates.month || updates.year || updates.userId) {
        const existingBudget = await Budget.findOne({
          userId: updates.userId || req.body.userId,
          month: updates.month || req.body.month,
          year: updates.year || req.body.year,
          _id: { $ne: id }
        });

        if (existingBudget) {
          return res.status(400).json({
            success: false,
            message: 'Já existe um orçamento para este usuário neste mês/ano'
          });
        }
      }

      // Validate categories if being updated
      if (updates.categories && updates.categories.length > 0) {
        const categoryIds = updates.categories.map(cat => cat.categoryId);
        const validCategories = await Category.find({
          _id: { $in: categoryIds },
          userId: updates.userId || req.body.userId
        });

        if (validCategories.length !== categoryIds.length) {
          return res.status(400).json({
            success: false,
            message: 'Uma ou mais categorias são inválidas ou não pertencem ao usuário'
          });
        }
      }

      const budget = await Budget.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      )
      .populate('userId', 'firstName lastName email')
      .populate('categories.categoryId', 'name type color')
      .select('-__v');

      if (!budget) {
        return res.status(404).json({
          success: false,
          message: 'Orçamento não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Orçamento atualizado com sucesso',
        data: budget
      });
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  deleteBudget: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID do orçamento deve ser válido'
        });
      }

      const budget = await Budget.findByIdAndDelete(id);

      if (!budget) {
        return res.status(404).json({
          success: false,
          message: 'Orçamento não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Orçamento deletado com sucesso',
        data: budget
      });
    } catch (error) {
      console.error('Erro ao deletar orçamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  getCurrentBudget: async (req, res) => {
    try {
      const { userId } = req.query;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: 'userId válido é obrigatório'
        });
      }

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const budget = await Budget.findOne({
        userId,
        month: currentMonth,
        year: currentYear
      })
      .populate('userId', 'firstName lastName email')
      .populate('categories.categoryId', 'name type color')
      .select('-__v');

      if (!budget) {
        return res.status(404).json({
          success: false,
          message: `Nenhum orçamento encontrado para ${currentMonth}/${currentYear}`
        });
      }

      res.status(200).json({
        success: true,
        data: budget
      });
    } catch (error) {
      console.error('Erro ao buscar orçamento atual:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  getBudgetSummary: async (req, res) => {
    try {
      const { userId } = req.params;
      const { year } = req.query;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: 'userId deve ser um ID válido'
        });
      }

      const currentYear = year ? parseInt(year) : new Date().getFullYear();

      const budgets = await Budget.find({
        userId,
        year: currentYear
      }).select('month totalBudget totalSpent');

      const summary = {
        year: currentYear,
        totalBudgets: budgets.length,
        totalBudgetedAmount: budgets.reduce((sum, budget) => sum + budget.totalBudget, 0),
        totalSpentAmount: budgets.reduce((sum, budget) => sum + budget.totalSpent, 0),
        monthlyBreakdown: budgets.map(budget => ({
          month: budget.month,
          budgeted: budget.totalBudget,
          spent: budget.totalSpent,
          remaining: budget.totalBudget - budget.totalSpent,
          utilizationPercentage: budget.totalBudget > 0 ? Math.round((budget.totalSpent / budget.totalBudget) * 100) : 0
        }))
      };

      summary.overallUtilizationPercentage = summary.totalBudgetedAmount > 0 ?
        Math.round((summary.totalSpentAmount / summary.totalBudgetedAmount) * 100) : 0;

      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Erro ao gerar resumo do orçamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
};

module.exports = budgetController;