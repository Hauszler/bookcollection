const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5500', // ajuste para a URL do seu Live Server
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: false,
    fixturesFolder: 'cypress/fixtures',
  },
});
