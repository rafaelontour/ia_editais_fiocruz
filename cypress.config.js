const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{js,ts,jsx,tsx}",
    excludeSpecPattern: [
      "cypress/fixtures/**",
      "cypress/support/**",
      "cypress/e2e/1-getting-started/**",
      "cypress/e2e/2-advanced-examples/**"
    ]
  }
});
