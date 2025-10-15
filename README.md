# CSE341 Project 1 - Users API

## Descrição
API REST para gerenciamento de usuários com operações CRUD completas, documentação Swagger e integração com MongoDB Atlas.

## Funcionalidades

### Autenticação (OAuth 2.0)
- ✅ **POST** `/auth/register` - Registra novo usuário (com senha hasheada)
- ✅ **POST** `/auth/login` - Faz login do usuário
- ✅ **POST** `/auth/logout` - Faz logout do usuário
- ✅ **GET** `/auth/profile` - Obtém perfil do usuário atual (protegido)
- ✅ **GET** `/auth/google` - Inicia autenticação OAuth com Google
- ✅ **GET** `/auth/google/callback` - Callback OAuth do Google
- ✅ **POST** `/auth/oauth/logout` - Logout OAuth
- 🔐 **Todas as rotas de usuários** requerem autenticação OAuth
- 🔐 **Rotas de produtos** (POST, PUT, DELETE) requerem autenticação OAuth

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
- **OAuth 2.0** com Google como provedor principal
- Senhas são hasheadas com bcrypt (salt rounds: 10)
- JWT tokens para autenticação de sessão
- Middleware de verificação de tokens JWT
- Sessões Express para OAuth
- Validações de email e formato de senha
- Proteção contra email duplicado
- Suporte a múltiplos provedores (Google + Email/Password)

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
SESSION_SECRET=your-session-secret-change-in-production

# OAuth Google (obtenha em https://console.developers.google.com/)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
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

# Testar OAuth Google (abrir no navegador)
# http://localhost:3000/auth/google
```

### 5. Interface de Autenticação
Acesse a interface de autenticação em: `http://localhost:3000/frontend/auth.html`

## Documentação da API
Acesse: `http://localhost:3000/api-docs`

## Testes
Use o arquivo `routes.rest` com a extensão REST Client do VS Code, ou teste diretamente no Swagger UI.

### Testes Unitários
O projeto inclui testes unitários completos para todos os módulos principais:

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

**Arquivos de teste:**
- `tests/users.test.js` - Testes para controllers/users.js (GET e getAll)
- `tests/products.test.js` - Testes para controllers/products.js (GET e getAll)  
- `tests/database.test.js` - Testes para data/database.js

**Cobertura de testes:**
- ✅ GET /users - Lista todos os usuários
- ✅ GET /users/:id - Busca usuário por ID
- ✅ GET /products - Lista todos os produtos
- ✅ GET /products/:id - Busca produto por ID
- ✅ Database operations - Conexão e operações básicas

## Deploy no Render
1. Conecte seu repositório GitHub ao Render
2. Configure as variáveis de ambiente:
   - `MONGODB_URL`: String de conexão do MongoDB Atlas
   - `JWT_SECRET`: Chave secreta para assinatura JWT (use uma chave forte e segura)
   - `SESSION_SECRET`: Chave secreta para sessões (use uma chave forte e segura)
   - `GOOGLE_CLIENT_ID`: ID do cliente Google OAuth
   - `GOOGLE_CLIENT_SECRET`: Segredo do cliente Google OAuth
   - `GOOGLE_CALLBACK_URL`: URL de callback (ex: https://seu-app.onrender.com/auth/google/callback)
   - `PORT`: Será definida automaticamente pelo Render

## Estrutura do Projeto
```
├── config/
│   └── oauth.js          # Configuração OAuth com Passport
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
│   └── auth.html         # Interface de autenticação OAuth
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
- Passport.js (OAuth)
- Google OAuth 2.0