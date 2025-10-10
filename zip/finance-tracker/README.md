# Finance Tracker API

Sistema de gerenciamento financeiro pessoal com API REST.

## Funcionalidades

- Gerenciamento de usuários
- Controle de transações (receitas e despesas)
- Documentação interativa com Swagger
- Validação de dados
- Tratamento de erros robusto

## Tecnologias

- Node.js
- Express.js
- MongoDB
- Mongoose
- Swagger UI
- Express Validator

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor:
```bash
npm start
```

Para desenvolvimento:
```bash
npm run dev
```

## Endpoints

### Usuários
- `POST /api/users` - Criar usuário
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Transações
- `POST /api/transactions` - Criar transação
- `GET /api/transactions` - Listar transações
- `GET /api/transactions/summary` - Resumo financeiro
- `GET /api/transactions/:id` - Buscar transação por ID
- `PUT /api/transactions/:id` - Atualizar transação
- `DELETE /api/transactions/:id` - Deletar transação

### Categorias
- `POST /api/categories` - Criar categoria
- `GET /api/categories` - Listar categorias
- `GET /api/categories/:id` - Buscar categoria por ID
- `GET /api/categories/user/:userId` - Buscar categorias do usuário
- `PUT /api/categories/:id` - Atualizar categoria
- `DELETE /api/categories/:id` - Deletar categoria

### Orçamentos
- `POST /api/budgets` - Criar orçamento
- `GET /api/budgets` - Listar orçamentos
- `GET /api/budgets/:id` - Buscar orçamento por ID
- `GET /api/budgets/current` - Buscar orçamento do mês atual
- `GET /api/budgets/summary/:userId` - Resumo de orçamentos
- `PUT /api/budgets/:id` - Atualizar orçamento
- `DELETE /api/budgets/:id` - Deletar orçamento

## Testes

Execute os testes da API:
```bash
# Todos os testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes específicos
npm run test:users
npm run test:transactions
npm run test:categories
npm run test:budgets

# Modo watch
npm run test:watch
```

## Documentação

Acesse a documentação interativa em: `http://localhost:3000/api-docs`

## Estrutura do Projeto

```
src/
├── controllers/     # Lógica de negócio
├── models/         # Modelos MongoDB
├── routes/         # Definição de rotas
├── middleware/     # Middlewares personalizados
├── config/         # Configurações
├── utils/          # Funções auxiliares
├── docs/           # Documentação Swagger
└── app.js          # Aplicação principal
tests/
├── users.test.js        # Testes para endpoints de usuários
├── transactions.test.js # Testes para endpoints de transações
├── categories.test.js   # Testes para endpoints de categorias
├── budgets.test.js     # Testes para endpoints de orçamentos
├── setup.js            # Configuração dos testes
├── run-tests.js        # Script executor de testes
└── README.md           # Documentação completa dos testes
```

## Banco de Dados

### Collection: Users
- googleId (String)
- email (String, obrigatório)
- firstName (String, obrigatório)
- lastName (String, obrigatório)
- profilePicture (String)
- dateOfBirth (Date)
- phoneNumber (String)
- createdAt (Date)
- updatedAt (Date)

### Collection: Categories
- userId (ObjectId, referência para User)
- name (String, obrigatório)
- type (String: 'income' ou 'expense', obrigatório)
- budgetLimit (Number)
- color (String, formato hex, obrigatório)
- isDefault (Boolean)
- createdAt (Date)

### Collection: Budgets
- userId (ObjectId, referência para User)
- month (Number: 1-12, obrigatório)
- year (Number, obrigatório)
- totalBudget (Number, obrigatório)
- totalSpent (Number)
- categories (Array de objetos com categoryId, budgetedAmount, spentAmount)
- notes (String)
- createdAt (Date)

### Collection: Transactions
- userId (ObjectId, referência para User)
- amount (Number, obrigatório)
- description (String, obrigatório)
- category (String, obrigatório)
- type (String: 'income' ou 'expense', obrigatório)
- date (Date)
- createdAt (Date)

## Segurança

- Rate limiting
- Helmet para headers de segurança
- Validação de entrada
- CORS configurado
- Tratamento de erros padronizado
