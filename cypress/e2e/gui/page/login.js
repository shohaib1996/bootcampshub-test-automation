class LoginPage {
    // Selectors
    get loginButton() {
      return cy.contains("button", "Login", { timeout: 10000 });
    }
  
    get emailInput() {
      return cy.get('input[type="email"]', { timeout: 10000 });
    }
  
    get passwordInput() {
      return cy.get('input[type="password"]', { timeout: 10000 });
    }
  
    get signInButton() {
      return cy.contains("Sign In", { timeout: 10000 });
    }
  
    // Dashboard selectors
    get programContent() {
      return cy.get('[id*="radix"][id*="-content-program"]', { timeout: 20000 });
    }
  
    get programTitle() {
      return this.programContent.find("h3").first();
    }
  
    get switchButton() {
      return this.programContent.contains("button", "Switch");
    }
  
    get globalModal() {
      return cy.get("#global_modal", { timeout: 20000 });
    }
  
    get goToProgramButton() {
      return this.globalModal.contains("button", "Go to Program");
    }
  
    get goToBootcampButton() {
      return cy.get(".grid-cols-1.xl\\:grid-cols-2 button", { timeout: 10000 }).contains("Go to Bootcamp");
    }
  
    // Actions
    visit() {
      cy.visit("/", { timeout: 30000 });
    }
  
    clickLoginButton() {
      this.loginButton.click();
    }
  
    verifyLoginPageUrl() {
      cy.url().should("eq", "https://staging.bootcampshub.ai/auth/login");
    }
  
    enterCredentials(email, password) {
      this.emailInput.type(email);
      this.passwordInput.type(password);
    }
  
    clickSignIn() {
      this.signInButton.click();
    }
  
    verifyDashboardLoaded() {
      cy.origin(
        "https://staging-portal.bootcampshub.ai/dashboard",
        { args: { programContent: this.programContent, programTitle: this.programTitle } },
        ({ programContent, programTitle }) => {
          programContent.should("be.visible");
          programTitle.should("have.text", "first program");
        }
      );
    }
  
    switchProgram() {
      cy.origin("https://staging-portal.bootcampshub.ai/dashboard", () => {
        this.switchButton.click({ force: true });
        this.globalModal.should("be.visible");
        this.goToProgramButton.click({ force: true });
        cy.url({ timeout: 20000 }).should("include", "/program");
      });
    }
  
    goToBootcamp() {
      cy.origin("https://staging-portal.bootcampshub.ai/dashboard", () => {
        this.goToBootcampButton.click({ force: true });
      });
    }
  }
  
  export default new LoginPage();