const options = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 50px 0 }
  `,
  customSiteTitle: "Finance Tracker API",
  swaggerOptions: {
    tryItOutEnabled: true,
    supportedSubmitMethods: ['get', 'post', 'put', 'delete'],
    validatorUrl: null,
    docExpansion: 'list',
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true
  }
};

module.exports = options;
