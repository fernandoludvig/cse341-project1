# Exemplos para Testar no Swagger UI

## ✅ **SWAGGER ATUALIZADO COM DADOS VÁLIDOS!**

Agora o Swagger UI já vem com dados válidos pré-preenchidos! Não precisa mais corrigir.

### 1. Criar Usuário (POST /api/users):

**Dados pré-preenchidos no Swagger:**
```json
{
  "email": "maria.santos@example.com",
  "firstName": "Maria",
  "lastName": "Santos",
  "phoneNumber": "+5511888776655",
  "dateOfBirth": "1985-03-20"
}
```

### 2. Criar Transação (POST /api/transactions):

**Dados pré-preenchidos no Swagger:**
```json
{
  "userId": "68e03db228d3da6c9a9e5e2b",
  "amount": 1500.50,
  "description": "Salário mensal",
  "category": "Trabalho",
  "type": "income",
  "date": "2025-10-03T21:16:00.568Z"
}
```

### 3. Exemplo de Despesa:
```json
{
  "userId": "68e03db228d3da6c9a9e5e2b",
  "amount": 300.50,
  "description": "Supermercado",
  "category": "Alimentação",
  "type": "expense"
}
```

## ✅ **PROBLEMA RESOLVIDO!**

**Agora o Swagger UI já vem com dados válidos pré-preenchidos!**

- ✅ **IDs válidos** do MongoDB
- ✅ **Descrições reais** ao invés de "string"
- ✅ **Emails válidos** com formato correto
- ✅ **Números de telefone** no formato brasileiro
- ✅ **Datas válidas** em formato ISO

## 📊 **Dados de Teste Disponíveis:**

**Usuário criado:**
- ID: `68e03db228d3da6c9a9e5e2b`
- Email: `usuario@teste.com`
- Nome: Maria Santos

**Transações criadas:**
- Receita: R$ 1.500,00 (Salário mensal)
- Despesa: R$ 300,50 (Supermercado)
- **Saldo atual: R$ 1.199,50**

## 🧪 **Teste no Swagger:**

1. Acesse: `http://localhost:3000/api-docs`
2. Use os IDs reais mostrados acima
3. Teste todas as operações CRUD
4. Verifique o resumo financeiro

**URLs para teste:**
- Documentação: `http://localhost:3000/api-docs`
- Usuários: `http://localhost:3000/api/users`
- Transações: `http://localhost:3000/api/transactions`
