const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // baseUrl: "https://staging-api.bootcampshub.ai/api", 
    baseUrl: "http://localhost:4000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
