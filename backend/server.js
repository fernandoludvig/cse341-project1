// Importa o framework Express para criar o servidor
const express = require("express");

// Importa o CORS para permitir requisições de outros domínios
const cors = require("cors");

// Cria uma instância do Express
const app = express();

// Define a porta onde o servidor irá rodar
const PORT = 8080;

// Aplica o middleware CORS em todas as rotas
app.use(cors());

// Aqui vai o JSON que o frontend espera
const professionalData = {
  professionalName: "Fernando Ludvig", // Nome completo do profissional
  base64Image: "iVBORw0KGgoAAAANSUhEUgAA..." , // Imagem em Base64
  nameLink: {
    firstName: "Fernando", // Primeiro nome
    url: "https://fernandoludvig.github.io" // Link pessoal
  },
  primaryDescription: "Sou desenvolvedor backend focado em Node.js, APIs e bancos de dados.", // Descrição principal
  workDescription1: "Atuo como analista de sistemas na DataJuri, resolvendo problemas de software e suporte.", // Experiência 1
  workDescription2: "Tenho experiência em desenvolvimento web na Prefeitura de Florianópolis e projetos acadêmicos.", // Experiência 2
  linkTitleText: "Saiba mais sobre mim:", // Texto de título para links
  linkedInLink: {
    text: "Meu LinkedIn", // Texto do link
    link: "https://linkedin.com/in/fernando-ludvig-06664a230" // URL do LinkedIn
  },
  githubLink: {
    text: "Meu GitHub", // Texto do link
    link: "https://github.com/fernandoludvig" // URL do GitHub
  }
};

// Endpoint GET que retorna os dados profissionais em JSON
app.get("/professional", (req, res) => {
  res.json(professionalData); // Retorna o objeto professionalData
});

// Inicia o servidor na porta definida e imprime uma mensagem no console
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
