# Configuração para Deploy no Render.com

## Variáveis de Ambiente Necessárias

Para que a aplicação funcione corretamente no Render.com, você precisa configurar as seguintes variáveis de ambiente:

### 1. Acesse o Painel do Render.com
- Faça login no [Render.com](https://render.com)
- Vá para o seu serviço (Web Service)
- Clique em "Environment" no menu lateral

### 2. Configure as Variáveis de Ambiente

Adicione as seguintes variáveis:

```
MONGODB_URL=mongodb+srv://Render-user:082004Fe@cluster0.k8gunhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
PORT=10000
```

### 3. Como Adicionar Variáveis no Render

1. Clique em "Add Environment Variable"
2. **Key:** `MONGODB_URL`
3. **Value:** `mongodb+srv://Render-user:082004Fe@cluster0.k8gunhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
4. Clique em "Save Changes"

Repita para as outras variáveis:
- **Key:** `NODE_ENV`, **Value:** `production`
- **Key:** `PORT`, **Value:** `10000`

### 4. Redeploy

Após adicionar as variáveis:
1. Vá para a aba "Manual Deploy"
2. Clique em "Deploy latest commit"
3. Aguarde o deploy completar

### 5. Verificação

Após o deploy, verifique os logs para confirmar:
- "MongoDB conectado: cluster0-shard-00-XX.XXXX.mongodb.net"
- Sem erros de timeout

## Troubleshooting

### Se ainda houver erros de timeout:

1. **Verifique se a variável MONGODB_URI está correta**
2. **Confirme se o MongoDB Atlas permite conexões de qualquer IP (0.0.0.0/0)**
3. **Verifique se o usuário tem permissões no banco**

### MongoDB Atlas - Configuração de Rede

1. Acesse [MongoDB Atlas](https://cloud.mongodb.com)
2. Vá para "Network Access"
3. Adicione IP `0.0.0.0/0` (qualquer IP) ou especifique o IP do Render
4. Confirme as permissões do usuário no banco

## Estrutura do Projeto no Render

```
Root Directory: /finance-tracker
Build Command: npm install
Start Command: npm start
```

## Logs Importantes

Procure por estes logs para confirmar que está funcionando:
- ✅ "MongoDB conectado: [host]"
- ✅ "Server running on port 10000"
- ❌ "MONGODB_URI não encontrada" = Variável não configurada
- ❌ "Operation buffering timed out" = Problema de conexão
