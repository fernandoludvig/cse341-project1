const Category = require('../models/Category');
const mongoose = require('mongoose');

const categoryController = {
  createCategory: async (req, res) => {
    try {
      const { userId, name, type, budgetLimit, color, isDefault } = req.body;

      const existingCategory = await Category.findOne({ userId, name });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Categoria já existe para este usuário'
        });
      }

      const category = new Category({
        userId,
        name,
        type,
        budgetLimit,
        color,
        isDefault: isDefault || false
      });

      await category.save();

      res.status(201).json({
        success: true,
        message: 'Categoria criada com sucesso',
        data: category
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  getCategories: async (req, res) => {
    try {
      const { userId, type } = req.query;

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
      if (type) {
        if (!['income', 'expense'].includes(type)) {
          return res.status(400).json({
            success: false,
            message: 'Tipo deve ser "income" ou "expense"'
          });
        }
        filter.type = type;
      }

      const categories = await Category.find(filter)
        .populate('userId', 'firstName lastName email')
        .select('-__v')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
      });
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID da categoria deve ser válido'
        });
      }

      const category = await Category.findById(id)
        .populate('userId', 'firstName lastName email')
        .select('-__v');

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID da categoria deve ser válido'
        });
      }

      if (updates.name) {
        const existingCategory = await Category.findOne({
          userId: updates.userId,
          name: updates.name,
          _id: { $ne: id }
        });

        if (existingCategory) {
          return res.status(400).json({
            success: false,
            message: 'Já existe uma categoria com este nome para este usuário'
          });
        }
      }

      const category = await Category.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      ).populate('userId', 'firstName lastName email').select('-__v');

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Categoria atualizada com sucesso',
        data: category
      });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID da categoria deve ser válido'
        });
      }

      const category = await Category.findByIdAndDelete(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Categoria deletada com sucesso',
        data: category
      });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  getUserCategories: async (req, res) => {
    try {
      const { userId } = req.params;
      const { type } = req.query;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: 'userId deve ser um ID válido'
        });
      }

      let filter = { userId };
      if (type && ['income', 'expense'].includes(type)) {
        filter.type = type;
      }

      const categories = await Category.find(filter)
        .select('-__v')
        .sort({ isDefault: -1, createdAt: -1 });

      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
      });
    } catch (error) {
      console.error('Erro ao buscar categorias do usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
};

module.exports = categoryController;