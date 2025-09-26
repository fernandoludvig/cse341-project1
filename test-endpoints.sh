#!/bin/bash

echo "🧪 === TESTANDO API CSE341 - AUTENTICAÇÃO OAUTH ==="
echo ""

BASE_URL="http://localhost:3000"

# Teste 1: Health Check
echo "📋 **1. Testando Health Check da API**"
echo "GET $BASE_URL/"
curl -s -X GET "$BASE_URL/" -H "Content-Type: application/json" | jq
echo -e "\n"

# Teste 2: Registrar usuário
echo "📝 **2. Registrando novo usuário**"
echo "POST $BASE_URL/auth/register"
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Maria",
    "lastName": "Santos",
    "email": "maria@example.com",
    "password": "password123",
    "favoriteColor": "Verde",
    "birthday": "1995-03-20"
  }' | jq

# Salvando o token do usuário registrado para próximos testes
echo -e "\n"

# Teste 3: Login
echo "🔐 **3. Fazendo login do usuário**"
echo "POST $BASE_URL/auth/login"
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "password123"
  }' | jq -r '.token 2>/dev/null')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo "✅ Token obtido: ${TOKEN:0:50}..."
else 
    echo "❌ Falha ao obter token"
fi

echo ""

# Teste 4: Obter perfil
if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo "👤 **4. Obtendo perfil do usuário**"
    echo "GET $BASE_URL/auth/profile"
    curl -s -X GET "$BASE_URL/auth/profile" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" | jq
    echo ""
fi

# Teste 5: Testando rota protegida com autenticação
if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo "🔒 **5. Testando acesso a rotas protegidas com autenticação**"
    echo "GET $BASE_URL/users (com token)"
    curl -s -X GET "$BASE_URL/users" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" | jq
    echo ""
fi

# Teste 6: Testando sem autenticação (deve falhar)
echo "🚫 **6. Testando acesso sem autenticação (deve falhar)**"
echo "GET $BASE_URL/users (sem token)"
curl -s -X GET "$BASE_URL/users" \
  -H "Content-Type: application/json" | jq
echo ""

# Teste 7: Swagger Documentation
echo "📚 **7. Verificando documentação Swagger**"
echo "GET $BASE_URL/api-docs"
curl -s -I "$BASE_URL/api-docs" | head -1
echo ""

# Teste 8: Endpoints públicos (GETs de produtos)
echo "🌐 **8. Testando endpoints públicos de produtos**"
echo "GET $BASE_URL/products"
curl -s -X GET "$BASE_URL/products" \
  -H "Content-Type: application/json" | jq
echo ""

echo "✅ **TODOS OS TESTES CONCLUÍDOS**"
echo ""
echo "💡 Acesse as seguintes URLs no seu navegador:"
echo "   🖥  API Base: http://localhost:3000"
echo "   📚 Swagger Docs: http://localhost:3000/api-docs"
echo "   🧪 Test Interface: http://localhost:3000/test-auth.html"
echo ""
