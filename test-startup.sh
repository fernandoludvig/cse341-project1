#!/bin/bash

echo "🚀 === INICIANDO SERVIDOR CSE341 COM OAUTH ==="
cd "$(dirname "$0")"

# Mata processos antigos
pkill -f "node.*server"

# Inicia a aplicação
echo "📳 Iniciando servidor..."
npm start &
SERVER_PID=$!

# Aguarda a aplicação inicializar
echo "⏳ Aguardando servidor inicializar..."
sleep 5

# Testa todos os endpoints
echo ""
echo "🔍 === TESTANDO ENDPOINTS ==="

# Test 1: Root
echo "📍 Testando root endpoint..."
curl -s http://localhost:3000/ | jq .

# Test 2: Auth Health 
echo "📍 Testando /auth/health..."
curl -s http://localhost:3000/auth/health | jq .

# Test 3: Swagger Documentation
echo "📍 Testando documentação..."
curl -s -I http://localhost:3000/api-docs | head -2

echo ""
echo "✅ Servidor inicializado corretamente!"
echo "🌐 URLs disponíveis:"
echo "   🖥  Base: http://localhost:3000"  
echo "   📚 API Docs: http://localhost:3000/api-docs"
echo "   🔧 Auth Health: http://localhost:3000/auth/health"
echo "   🧪 Test UI: $(pwd)/test-auth.html"
echo ""
echo "Aguardando conexões... (Ctrl+C para parar)"
wait $SERVER_PID
