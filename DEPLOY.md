# Deploy no Render - Guia Passo a Passo

## Preparação do Projeto

### 1. Verificar arquivos obrigatórios
- ✅ `package.json` com script "start"
- ✅ `server.js` como entry point
- ✅ `.gitignore` incluindo `.env`

### 2. Configurações do Render

#### Build Command:
```
npm install
```

#### Start Command:
```
npm start
```

#### Environment Variables:
```
MONGODB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 3. Configuração do MongoDB Atlas
1. Acesse seu cluster MongoDB Atlas
2. Vá em "Database Access" e crie um usuário
3. Vá em "Network Access" e adicione `0.0.0.0/0` (ou IPs específicos do Render)
4. Copie a string de conexão

### 4. Passos no Render
1. Conecte seu repositório GitHub
2. Escolha "Web Service"
3. Configure:
   - **Name**: cse341-project1
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Adicione a variável de ambiente `MONGODB_URL`

### 5. URLs importantes após deploy
- **API Base**: `https://seu-app.onrender.com`
- **Swagger Docs**: `https://seu-app.onrender.com/api-docs`
- **Usuários**: `https://seu-app.onrender.com/users`

### 6. Atualizar swagger.json
Após o deploy, atualize o campo "host" no `swagger.json` com sua URL do Render.

## Testando o Deploy
Use o arquivo `routes.rest` alterando `localhost:3000` para sua URL do Render.
