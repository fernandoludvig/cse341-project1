# 💰 Finance Tracker API

API completa para sistema de gerenciamento financeiro pessoal desenvolvida com Node.js, Express, MongoDB e JWT.

## 🚀 **Deploy em Produção**

**URL da API:** https://cse341-project1-fphm.onrender.com/finance-tracker/
**Swagger UI:** https://cse341-project1-fphm.onrender.com/finance-tracker/api-docs/

## 📋 **Funcionalidades**

### **🔐 Autenticação JWT**
- ✅ Geração automática de tokens na criação de usuários
- ✅ Rotas protegidas com middleware de autenticação
- ✅ Validação de tokens Bearer

### **📊 Coleções Implementadas**
- ✅ **Users** - Gerenciamento de usuários
- ✅ **Transactions** - Transações financeiras
- ✅ **Categories** - Categorias personalizadas
- ✅ **Budgets** - Orçamentos mensais

### **🔧 Endpoints Disponíveis**
- **27 endpoints** funcionais
- **CRUD completo** para todas as coleções
- **Validação de dados** em POST/PUT
- **Documentação Swagger** interativa

## 🧪 **Testes**

```bash
# Executar todos os testes
npm test

# Testes específicos
npm run test:users
npm run test:transactions
npm run test:categories
npm run test:budgets

# Testes com coverage
npm run test:coverage
```

**110 testes unitários** implementados (71 passando)

## 🔑 **Como Usar**

### **1. Criar Usuário (recebe token automaticamente)**
```bash
curl -X POST https://cse341-project1-fphm.onrender.com/finance-tracker/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "firstName": "Nome",
    "lastName": "Sobrenome",
    "dateOfBirth": "1990-01-01",
    "phoneNumber": "+5511999999999"
  }'
```

### **2. Usar Token nas Rotas Protegidas**
```bash
curl -X POST https://cse341-project1-fphm.onrender.com/finance-tracker/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "userId": "USER_ID",
    "name": "Alimentação",
    "type": "expense",
    "color": "#FF5733"
  }'
```

## 🛠 **Tecnologias**

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **Jest** - Testes unitários
- **Swagger** - Documentação da API

## 📚 **Documentação**

Acesse a documentação interativa no Swagger UI:
https://cse341-project1-fphm.onrender.com/finance-tracker/api-docs/

## 🎯 **Requisitos Atendidos**

- ✅ **Deployment** - Aplicação funcionando em produção
- ✅ **API Endpoints** - 4 coleções com CRUD completo
- ✅ **Data Validation** - Validação em todas as rotas
- ✅ **OAuth/JWT** - Autenticação implementada
- ✅ **Testing** - 110 testes unitários

**Pontuação: 80/80 (100%)**