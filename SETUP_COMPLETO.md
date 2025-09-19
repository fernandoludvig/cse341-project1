# 🚀 Configuração Completa - MongoDB + Render

## 1. 📊 CONFIGURAÇÃO DO MONGODB ATLAS

### Passo 1: Database Access (Usuários)
1. Vá para [MongoDB Atlas](https://cloud.mongodb.com/v2/68b62df9515ebf25b5a02763#/clusters)
2. Clique em "Database Access" (no menu lateral esquerdo)
3. Clique em "Add New Database User"
4. Configure:
   - **Authentication Method**: Password
   - **Username**: `render-user` (ou qualquer nome)
   - **Password**: Gere uma senha segura (anote ela!)
   - **Database User Privileges**: "Read and write to any database"
5. Clique em "Add User"

### Passo 2: Network Access (IPs permitidos)
1. Clique em "Network Access" (no menu lateral esquerdo)
2. Clique em "Add IP Address"
3. Escolha "Allow Access from Anywhere" (0.0.0.0/0)
4. Clique em "Confirm"

### Passo 3: Obter String de Conexão
1. Volte para "Clusters"
2. Clique em "Connect" no seu cluster
3. Escolha "Connect your application"
4. Copie a string de conexão (algo como):
   ```
   mongodb+srv://render-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **IMPORTANTE**: Substitua `<password>` pela senha real do usuário

## 2. ⚙️ CONFIGURAÇÃO DO RENDER

### Seu serviço: `srv-d2u7t7vfte5s73atk4pg`

### Passo 1: Environment Variables
1. Vá para [Render Dashboard](https://dashboard.render.com/web/srv-d2u7t7vfte5s73atk4pg/events)
2. Clique na aba "Environment"
3. Adicione esta variável:
   - **Key**: `MONGODB_URL`
   - **Value**: Sua string de conexão do MongoDB (do passo 3 acima)

### Passo 2: Verificar Configurações
Na aba "Settings", verifique se está assim:
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: Latest (ou 18+)

### Passo 3: Deploy Manual (se necessário)
1. Vá para a aba "Manual Deploy"
2. Clique em "Deploy Latest Commit"

## 3. 🧪 TESTAR A API

### URLs da sua API:
- **Base URL**: `https://srv-d2u7t7vfte5s73atk4pg.onrender.com`
- **Swagger Docs**: `https://srv-d2u7t7vfte5s73atk4pg.onrender.com/api-docs`
- **Lista Usuários**: `https://srv-d2u7t7vfte5s73atk4pg.onrender.com/users`

### Teste rápido:
1. Acesse: `https://srv-d2u7t7vfte5s73atk4pg.onrender.com`
2. Deve retornar: `{"message": "Users API is running! Acesse /api-docs para documentação."}`

## 4. 📝 EXEMPLO DE TESTE

### Criar usuário (POST):
```bash
curl -X POST https://srv-d2u7t7vfte5s73atk4pg.onrender.com/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "João",
    "lastName": "Silva", 
    "email": "joao@teste.com",
    "favoriteColor": "Blue",
    "birthday": "1990-01-15"
  }'
```

### Listar usuários (GET):
```bash
curl https://srv-d2u7t7vfte5s73atk4pg.onrender.com/users
```

## 5. 🔧 SOLUÇÃO DE PROBLEMAS

### Se der erro de conexão MongoDB:
- Verifique se a string de conexão está correta
- Confirme que o usuário tem permissões
- Verifique se o IP 0.0.0.0/0 está liberado

### Se o Render não iniciar:
- Verifique os logs na aba "Logs" do Render
- Confirme que a variável MONGODB_URL está definida

## ✅ CHECKLIST FINAL

- [ ] Usuário MongoDB criado com senha
- [ ] IP 0.0.0.0/0 liberado no MongoDB
- [ ] String de conexão copiada
- [ ] Variável MONGODB_URL configurada no Render
- [ ] Deploy realizado
- [ ] API testada e funcionando
