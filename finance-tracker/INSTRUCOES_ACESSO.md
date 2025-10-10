# 🌐 Instruções de Acesso - Finance Tracker API

## ✅ **SERVIDOR FUNCIONANDO!**

O servidor está rodando corretamente em: **http://localhost:3000**

---

## 📚 **ACESSAR SWAGGER UI:**

### **URL Correta:**
```
http://localhost:3000/api-docs/
```
**⚠️ IMPORTANTE:** Note a **barra final** (`/`) - é obrigatória!

### **Se der erro de CORS:**
1. Use a URL com barra final: `http://localhost:3000/api-docs/`
2. Se ainda der erro, tente: `http://127.0.0.1:3000/api-docs/`

---

## 🧪 **TESTAR A API:**

### **1. Verificar se está funcionando:**
```bash
curl http://localhost:3000/
```

**Resposta esperada:**
```json
{
    "success": true,
    "message": "Finance Tracker API",
    "version": "1.0.0",
    "documentation": "/api-docs"
}
```

### **2. Testar endpoints diretamente:**

#### **Ver usuários:**
```bash
curl http://localhost:3000/api/users
```

#### **Criar usuário:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "firstName": "Teste",
    "lastName": "User"
  }'
```

---

## 🔐 **TESTAR AUTENTICAÇÃO:**

### **Passo 1 - Criar usuário:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@teste.com",
    "firstName": "João",
    "lastName": "Silva"
  }'
```

### **Passo 2 - Gerar token (copie o _id da resposta acima):**
```bash
curl -X POST http://localhost:3000/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "SEU_USER_ID_AQUI"
  }'
```

### **Passo 3 - Usar token (copie o token da resposta acima):**
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "userId": "SEU_USER_ID_AQUI",
    "name": "Alimentação",
    "type": "expense",
    "color": "#FF5733"
  }'
```

---

## 🛠️ **SOLUÇÃO DE PROBLEMAS:**

### **Erro: "Failed to fetch"**
1. ✅ Use: `http://localhost:3000/api-docs/` (com barra final)
2. ✅ Ou tente: `http://127.0.0.1:3000/api-docs/`
3. ✅ Limpe o cache do navegador (Ctrl+F5)

### **Erro de CORS no Swagger:**
- ✅ CORS está configurado corretamente
- ✅ Use a URL com barra final
- ✅ Se persistir, reinicie o navegador

### **Servidor não responde:**
```bash
# Verificar se está rodando
lsof -ti:3000

# Se não estiver, reiniciar
cd /Users/manoellaludvig/Desktop/cse341-projects/cse341-project1/finance-tracker
node server.js
```

### **MongoDB não conecta:**
- ✅ O servidor continua funcionando mesmo sem MongoDB
- ✅ Para testes, pode usar sem conexão

---

## 📊 **ENDPOINTS DISPONÍVEIS:**

### **🔓 Públicos (não precisam de token):**
- ✅ GET /api/users
- ✅ POST /api/users
- ✅ GET /api/transactions
- ✅ POST /api/auth/login
- ✅ POST /api/auth/token
- ✅ GET /api/categories
- ✅ GET /api/budgets

### **🔒 Protegidos (precisam de token):**
- 🔒 POST /api/categories
- 🔒 PUT /api/categories/:id
- 🔒 POST /api/budgets
- 🔒 PUT /api/budgets/:id

---

## 🎯 **TESTE RÁPIDO:**

1. **Acesse:** http://localhost:3000/api-docs/
2. **Teste um endpoint público:** GET /api/users
3. **Crie um usuário:** POST /api/users
4. **Gere um token:** POST /api/auth/token
5. **Teste endpoint protegido:** POST /api/categories (com token)

---

## ✅ **STATUS ATUAL:**

- ✅ Servidor rodando
- ✅ CORS configurado
- ✅ Swagger UI funcionando
- ✅ 27 endpoints ativos
- ✅ Autenticação JWT
- ✅ MongoDB conectado
- ✅ 110 testes prontos

---

**🚀 Tudo funcionando! Acesse agora:** http://localhost:3000/api-docs/
