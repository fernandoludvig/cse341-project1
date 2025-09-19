# CSE341 Project 1 - Users API

## Descrição
API REST para gerenciamento de usuários com operações CRUD completas, documentação Swagger e integração com MongoDB Atlas.

## Funcionalidades
- ✅ **GET** `/users` - Lista todos os usuários
- ✅ **GET** `/users/:id` - Busca usuário por ID
- ✅ **POST** `/users` - Cria novo usuário
- ✅ **PUT** `/users/:id` - Atualiza usuário existente
- ✅ **DELETE** `/users/:id` - Remove usuário

## Validações Implementadas
- Todos os campos obrigatórios (firstName, lastName, email, favoriteColor, birthday)
- Validação de formato de email
- Validação de formato de data (YYYY-MM-DD)
- Validação de ObjectId do MongoDB
- Tratamento de erros completo

## Configuração Local

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar MongoDB
Crie um arquivo `.env` na raiz do projeto:
```env
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
PORT=3000
```

### 3. Executar o Projeto
```bash
npm start
```

## Documentação da API
Acesse: `http://localhost:3000/api-docs`

## Testes
Use o arquivo `routes.rest` com a extensão REST Client do VS Code, ou teste diretamente no Swagger UI.

## Deploy no Render
1. Conecte seu repositório GitHub ao Render
2. Configure as variáveis de ambiente:
   - `MONGODB_URL`: String de conexão do MongoDB Atlas
   - `PORT`: Será definida automaticamente pelo Render

## Estrutura do Projeto
```
├── controllers/
│   └── users.js          # Lógica de negócio
├── data/
│   └── database.js       # Conexão MongoDB
├── routes/
│   ├── index.js          # Roteador principal
│   └── user.js           # Rotas de usuários
├── frontend/             # Interface web básica
├── server.js             # Servidor Express
├── swagger.js            # Configuração Swagger
└── swagger.json          # Documentação API
```

## Tecnologias
- Node.js
- Express.js
- MongoDB Atlas
- Swagger UI
- Body Parser