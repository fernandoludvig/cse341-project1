require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 Finance Tracker API iniciado com sucesso!');
  console.log('='.repeat(60));
  console.log(`📍 Servidor rodando em: http://localhost:${PORT}`);
  console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`🔐 Autenticação: JWT Bearer Token`);
  console.log('='.repeat(60));
  console.log('\n✅ Endpoints disponíveis:');
  console.log('   - GET  /api/users');
  console.log('   - POST /api/auth/login');
  console.log('   - POST /api/auth/token');
  console.log('   - GET  /api/categories');
  console.log('   - GET  /api/budgets');
  console.log('   - GET  /api/transactions');
  console.log('\n🔒 Rotas protegidas (requerem token):');
  console.log('   - POST /api/categories');
  console.log('   - PUT  /api/categories/:id');
  console.log('   - POST /api/budgets');
  console.log('   - PUT  /api/budgets/:id');
  console.log('\n📖 Consulte GUIA_AUTENTICACAO.md para mais informações\n');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Servidor encerrado graciosamente');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Servidor encerrado pelo usuário');
  process.exit(0);
});

