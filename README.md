# CSE341 Project 1 - Users API

## Descrição
API REST para gerenciamento de usuários com operações CRUD completas, documentação Swagger e integração com MongoDB Atlas.

## Funcionalidades

### Autenticação (OAuth)
- ✅ **POST** `/auth/register` - Registra novo usuário (com senha hasheada)
- ✅ **POST** `/auth/login` - Faz login do usuário
- ✅ **POST** `/auth/logout` - Faz logout do usuário
- ✅ **GET** `/auth/profile` - Obtém perfil do usuário atual (protegido)
- 🔐 **Todas as rotas de usuários e produtos** requerem autenticação (exceto GET públicos)

### Usuários (Protegido por Auth)
- ✅ **GET** `/users` - Lista todos os usuários (protegido)
- ✅ **GET** `/users/:id` - Busca usuário por ID (protegido)
- ✅ **POST** `/users` - Cria novo usuário (protegido)
- ✅ **PUT** `/users/:id` - Atualiza usuário existente (protegido)
- ✅ **DELETE** `/users/:id` - Remove usuário (protegido)

### Produtos
- ✅ **GET** `/products` - Lista todos os produtos (público)
- ✅ **GET** `/products/:id` - Busca produto por ID (público)
- 🔐 **POST** `/products` - Cria novo produto (protegido)
- 🔐 **PUT** `/products/:id` - Atualiza produto existente (protegido)
- 🔐 **DELETE** `/products/:id` - Remove produto (protegido)

## Validações Implementadas
### Autenticação
- Senhas são hasheadas com bcrypt (salt rounds: 10)
- JWT tokens para autenticação de sessão
- Middleware de verificação de tokens JWT
- Validações de email e formato de senha
- Proteção contra email duplicado

### Geral
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

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
```

### 3. Executar o Projeto
```bash
npm start
```

### 4. Testar a API
Verifique se os endpoints funcionam:
```bash
# Testar a API principal
curl http://localhost:3000/

# Testar auth health  
curl http://localhost:3000/auth/health

# Testar registro (com banco conectado)
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"password123","favoriteColor":"Blue","birthday":"1990-01-01"}'
```

## Documentação da API
Acesse: `http://localhost:3000/api-docs`

## Testes
Use o arquivo `routes.rest` com a extensão REST Client do VS Code, ou teste diretamente no Swagger UI.

## Deploy no Render
1. Conecte seu repositório GitHub ao Render
2. Configure as variáveis de ambiente:
   - `MONGODB_URL`: String de conexão do MongoDB Atlas
   - `JWT_SECRET`: Chave secreta para assinatura JWT (use uma chave forte e segura)
   - `PORT`: Será definida automaticamente pelo Render

## Estrutura do Projeto
```
├── controllers/
│   ├── users.js          # Lógica de usuários
│   ├── products.js       # Lógica de produtos 
│   └── auth.js           # Controlador de autenticação
├── data/
│   └── database.js       # Conexão MongoDB
├── routes/
│   ├── index.js          # Roteador principal
│   ├── user.js           # Rotas de usuários
│   ├── product.js        # Rotas de produtos
│   └── auth.js           # Rotas de autenticação
├── frontend/             # Interface web básica
├── server.js             # Servidor Express
├── swagger.js            # Configuração Swagger
├── swagger.json          # Documentação API
├── package.json          # Dependências npm
└── README.md             # Documentação do projeto
```

## Tecnologias
- Node.js
- Express.js
- MongoDB Atlas
- Swagger UI
- Body Parser
- bcryptjs (hashing de senhas)
- jsonwebtoken (JWT)
- express-session