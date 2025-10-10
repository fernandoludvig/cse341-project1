const mongoose = require('mongoose');

const budgetCategorySchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  budgetedAmount: {
    type: Number,
    required: true,
    min: 0
  },
  spentAmount: {
    type: Number,
    default: 0,
    min: 0
  }
}, { _id: false });

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true,
    min: 2000
  },
  totalBudget: {
    type: Number,
    required: true,
    min: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  categories: [budgetCategorySchema],
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

budgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

budgetSchema.virtual('remainingBudget').get(function() {
  return this.totalBudget - this.totalSpent;
});

budgetSchema.virtual('utilizationPercentage').get(function() {
  if (this.totalBudget === 0) return 0;
  return Math.round((this.totalSpent / this.totalBudget) * 100);
});

budgetSchema.methods.isOverBudget = function() {
  return this.totalSpent > this.totalBudget;
};

budgetSchema.methods.addExpenseToCategory = function(categoryId, amount) {
  const category = this.categories.find(cat => cat.categoryId.toString() === categoryId.toString());
  if (category) {
    category.spentAmount += amount;
    this.totalSpent += amount;
  }
  return this.save();
};

budgetSchema.methods.removeExpenseFromCategory = function(categoryId, amount) {
  const category = this.categories.find(cat => cat.categoryId.toString() === categoryId.toString());
  if (category) {
    category.spentAmount = Math.max(0, category.spentAmount - amount);
    this.totalSpent = Math.max(0, this.totalSpent - amount);
  }
  return this.save();
};

budgetSchema.set('toJSON', { virtuals: true });
budgetSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Budget', budgetSchema);