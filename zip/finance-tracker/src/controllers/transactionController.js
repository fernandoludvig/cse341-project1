const Transaction = require('../models/Transaction');

const transactionController = {
  createTransaction: async (req, res) => {
    try {
      const { userId, amount, description, category, type, date } = req.body;

      if (!userId || !amount || !description || !category || !type) {
        return res.status(400).json({
          success: false,
          message: 'Todos os campos obrigatórios devem ser fornecidos'
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'O valor deve ser maior que zero'
        });
      }

      if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo deve ser "income" ou "expense"'
        });
      }

      const transaction = new Transaction({
        userId,
        amount,
        description,
        category,
        type,
        date: date || new Date()
      });

      await transaction.save();

      res.status(201).json({
        success: true,
        message: 'Transação criada com sucesso',
        data: transaction
      });
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  getTransactions: async (req, res) => {
    try {
      const { userId, type, category } = req.query;
      let filter = {};

      if (userId) filter.userId = userId;
      if (type) filter.type = type;
      if (category) filter.category = new RegExp(category, 'i');

      const transactions = await Transaction.find(filter)
        .populate('userId', 'firstName lastName email')
        .sort({ date: -1 });

      res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions
      });
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  getTransactionById: async (req, res) => {
    try {
      const { id } = req.params;

      const transaction = await Transaction.findById(id)
        .populate('userId', 'firstName lastName email');

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transação não encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error('Erro ao buscar transação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  updateTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.amount && updateData.amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'O valor deve ser maior que zero'
        });
      }

      if (updateData.type && !['income', 'expense'].includes(updateData.type)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo deve ser "income" ou "expense"'
        });
      }

      const transaction = await Transaction.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('userId', 'firstName lastName email');

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transação não encontrada'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Transação atualizada com sucesso',
        data: transaction
      });
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  deleteTransaction: async (req, res) => {
    try {
      const { id } = req.params;

      const transaction = await Transaction.findByIdAndDelete(id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transação não encontrada'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Transação deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  getTransactionSummary: async (req, res) => {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId é obrigatório para obter resumo'
        });
      }

      const transactions = await Transaction.find({ userId });

      const summary = transactions.reduce((acc, transaction) => {
        if (transaction.type === 'income') {
          acc.totalIncome += transaction.amount;
        } else {
          acc.totalExpense += transaction.amount;
        }
        return acc;
      }, { totalIncome: 0, totalExpense: 0 });

      summary.balance = summary.totalIncome - summary.totalExpense;

      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Erro ao obter resumo:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
};

module.exports = transactionController;
