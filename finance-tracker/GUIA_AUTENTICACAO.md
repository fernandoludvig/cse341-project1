# 🔐 Guia de Autenticação - Finance Tracker API

## 📋 Visão Geral

A API agora possui autenticação JWT (JSON Web Token) implementada. As rotas de **Categories** e **Budgets** (POST e PUT) estão protegidas e requerem autenticação.

---

## 🚀 Como Usar a Autenticação

### **1. Criar um Usuário (Não requer autenticação)**

```bash
POST /api/users
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "firstName": "João",
  "lastName": "Silva",
  "phoneNumber": "+5511999999999"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "_id": "67075e9a1234567890abcdef",
    "email": "usuario@exemplo.com",
    "firstName": "João",
    "lastName": "Silva",
    ...
  }
}
```

---

### **2. Gerar Token de Autenticação**

**Opção A: Login por Email**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com"
}
```

**Opção B: Gerar Token de Teste (usando ID)**
```bash
POST /api/auth/token
Content-Type: application/json

{
  "userId": "67075e9a1234567890abcdef"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Token de teste gerado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": "7d",
    "usage": "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "67075e9a1234567890abcdef",
      "email": "usuario@exemplo.com",
      "firstName": "João",
      "lastName": "Silva"
    }
  }
}
```

**⚠️ IMPORTANTE:** Copie o `token` da resposta para usar nas próximas requisições!

---

### **3. Usar o Token nas Requisições Protegidas**

Adicione o header `Authorization` com o formato: `Bearer <seu-token>`

#### **Exemplo: Criar Categoria (Requer Auth)**

```bash
POST /api/categories
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "userId": "67075e9a1234567890abcdef",
  "name": "Alimentação",
  "type": "expense",
  "color": "#FF5733",
  "budgetLimit": 500
}
```

#### **Exemplo: Atualizar Categoria (Requer Auth)**

```bash
PUT /api/categories/67075fab1234567890abcdef
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "budgetLimit": 600
}
```

#### **Exemplo: Criar Orçamento (Requer Auth)**

```bash
POST /api/budgets
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "userId": "67075e9a1234567890abcdef",
  "month": 10,
  "year": 2025,
  "totalBudget": 3000,
  "notes": "Orçamento de outubro"
}
```

#### **Exemplo: Atualizar Orçamento (Requer Auth)**

```bash
PUT /api/budgets/67075fcd1234567890abcdef
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "totalBudget": 3500
}
```

---

## 🔓 Rotas que NÃO Requerem Autenticação

### **Users:**
- ✅ GET /api/users
- ✅ POST /api/users
- ✅ GET /api/users/:id
- ✅ PUT /api/users/:id
- ✅ DELETE /api/users/:id

### **Transactions:**
- ✅ GET /api/transactions
- ✅ POST /api/transactions
- ✅ GET /api/transactions/:id
- ✅ GET /api/transactions/summary
- ✅ PUT /api/transactions/:id
- ✅ DELETE /api/transactions/:id

### **Categories (apenas GET):**
- ✅ GET /api/categories
- ✅ GET /api/categories/:id
- ✅ GET /api/categories/user/:userId
- ✅ DELETE /api/categories/:id

### **Budgets (apenas GET e DELETE):**
- ✅ GET /api/budgets
- ✅ GET /api/budgets/:id
- ✅ GET /api/budgets/current
- ✅ GET /api/budgets/summary/:userId
- ✅ DELETE /api/budgets/:id

---

## 🔐 Rotas que REQUEREM Autenticação

### **Categories:**
- 🔒 POST /api/categories - Criar categoria
- 🔒 PUT /api/categories/:id - Atualizar categoria

### **Budgets:**
- 🔒 POST /api/budgets - Criar orçamento
- 🔒 PUT /api/budgets/:id - Atualizar orçamento

---

## 🧪 Testando no Swagger UI

1. **Acesse:** `http://localhost:3000/api-docs`

2. **Gere um token:**
   - Vá em `/api/auth/token`
   - Clique em "Try it out"
   - Insira um `userId` válido
   - Execute
   - Copie o token da resposta

3. **Configure a autenticação no Swagger:**
   - Clique no botão **"Authorize"** (cadeado verde no topo)
   - Cole o token no formato: `Bearer <seu-token>`
   - Clique em "Authorize"
   - Clique em "Close"

4. **Teste rotas protegidas:**
   - Agora você pode testar POST /api/categories e PUT /api/categories/:id
   - Também POST /api/budgets e PUT /api/budgets/:id

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/finance_tracker
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
MONGODB_TEST_URI=mongodb://localhost:27017/finance_tracker_test
```

**⚠️ IMPORTANTE:** 
- Altere `JWT_SECRET` para uma chave segura em produção
- Nunca commite o arquivo `.env` no Git
- Use variáveis de ambiente no Render/Heroku para deploy

---

## 🛡️ Tratamento de Erros

### **Token não fornecido:**
```json
{
  "success": false,
  "message": "Token de autenticação não fornecido. Use: Authorization: Bearer <token>"
}
```

### **Token inválido:**
```json
{
  "success": false,
  "message": "Token inválido"
}
```

### **Token expirado:**
```json
{
  "success": false,
  "message": "Token expirado. Por favor, faça login novamente"
}
```

### **Usuário não encontrado:**
```json
{
  "success": false,
  "message": "Usuário não encontrado"
}
```

---

## 📝 Fluxo Completo de Teste

```bash
# 1. Criar usuário
POST /api/users
{
  "email": "teste@example.com",
  "firstName": "Teste",
  "lastName": "Usuário"
}
# Copie o "_id" da resposta

# 2. Gerar token
POST /api/auth/token
{
  "userId": "<id-do-usuário>"
}
# Copie o "token" da resposta

# 3. Criar categoria (com token)
POST /api/categories
Headers: Authorization: Bearer <token>
{
  "userId": "<id-do-usuário>",
  "name": "Supermercado",
  "type": "expense",
  "color": "#FF5733"
}

# 4. Criar orçamento (com token)
POST /api/budgets
Headers: Authorization: Bearer <token>
{
  "userId": "<id-do-usuário>",
  "month": 10,
  "year": 2025,
  "totalBudget": 2000
}

# 5. Ver perfil do usuário autenticado
GET /api/auth/profile
Headers: Authorization: Bearer <token>
```

---

## 🔧 Troubleshooting

### **Erro: "Token de autenticação não fornecido"**
- Verifique se você incluiu o header `Authorization`
- Formato correto: `Authorization: Bearer <token>`
- Não esqueça da palavra "Bearer" e o espaço

### **Erro: "Token inválido"**
- Verifique se copiou o token completo
- Certifique-se de que não há espaços extras
- Gere um novo token se necessário

### **Erro: "Usuário não encontrado"**
- Verifique se o usuário ainda existe no banco
- Gere um novo token com um userId válido

---

## 🚀 Próximos Passos

- [ ] Implementar OAuth com Google
- [ ] Adicionar refresh tokens
- [ ] Implementar rate limiting por usuário
- [ ] Adicionar roles (admin, user)
- [ ] Implementar 2FA (Two-Factor Authentication)

---

**✅ Autenticação implementada com sucesso!**

Para mais informações, consulte a documentação completa no Swagger: `http://localhost:3000/api-docs`

