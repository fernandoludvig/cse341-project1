const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

const authController = {
  login: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email é obrigatório'
        });
      }

      let user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado. Por favor, crie um usuário primeiro.'
        });
      }

      const token = generateToken(user);

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          token,
          tokenType: 'Bearer',
          expiresIn: '7d',
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture
          }
        }
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      const user = await User.findById(req.user.id).select('-__v');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  },

  generateTestToken: async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId é obrigatório'
        });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      const token = generateToken(user);

      res.status(200).json({
        success: true,
        message: 'Token de teste gerado com sucesso',
        data: {
          token,
          tokenType: 'Bearer',
          expiresIn: '7d',
          usage: 'Authorization: Bearer ' + token,
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
        }
      });
    } catch (error) {
      console.error('Erro ao gerar token de teste:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
};

module.exports = authController;

