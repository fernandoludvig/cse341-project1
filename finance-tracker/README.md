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
