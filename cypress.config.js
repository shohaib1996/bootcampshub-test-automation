const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.bootcampshub.ai",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
