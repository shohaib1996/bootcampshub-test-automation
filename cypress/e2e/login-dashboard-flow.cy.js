import { performLoginDashboardFlow } from "../e2e/custom-flows/login-dashboard-flow";

describe("Login Page Test Flow", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", (err) => {
      if (err.message.includes("Minified React error #418")) {
        return false;
      }
    });
  });

  it("should login successfully and navigate to dashboard", () => {
    performLoginDashboardFlow();
  });
});