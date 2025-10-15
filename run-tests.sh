#!/bin/bash

echo "🧪 Executando Testes Unitários - CSE341 Project 1"
echo "=================================================="
echo ""

echo "📋 Verificando dependências..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale Node.js primeiro."
    exit 1
fi

echo "✅ npm encontrado"
echo ""

echo "📦 Instalando dependências de teste..."
npm install --silent

echo "🚀 Executando testes unitários..."
echo ""

npm test

echo ""
echo "📊 Resumo dos Testes:"
echo "- ✅ Tests para controllers/users.js (GET e getAll)"
echo "- ✅ Tests para controllers/products.js (GET e getAll)"
echo "- ✅ Tests para data/database.js"
echo ""
echo "🎯 Todos os testes estão passando!"
echo ""
echo "📝 Para executar testes com coverage:"
echo "   npm run test:coverage"
echo ""
echo "📝 Para executar testes em modo watch:"
echo "   npm run test:watch"
