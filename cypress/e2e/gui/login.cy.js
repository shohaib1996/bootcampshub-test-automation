describe("Login Page Test Flow", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("userInformation.json").then((data) => {
      credentials = data;
    });

    cy.on("uncaught:exception", (err) => {
      if (err.message.includes("Minified React error #418")) {
        return false;
      }
    });
  });

  it("should login successfully and navigate to dashboard", () => {
    const { email, password } = credentials;

    cy.visit("https://staging.bootcampshub.ai/", { timeout: 30000 });

    cy.get(".flex.items-center a:nth-child(3) button", {
      timeout: 10000,
    }).should("be.visible");

    cy.contains("button", "Login", { timeout: 10000 }).click();

    cy.url().should("eq", "https://staging.bootcampshub.ai/auth/login");

    cy.get('input[type="email"]', { timeout: 10000 }).type(email);

    cy.get('input[type="password"]', { timeout: 10000 }).type(password);

    cy.contains("Sign In", { timeout: 10000 }).click();

    cy.origin("https://staging-portal.bootcampshub.ai/dashboard", () => {
      cy.get('[id*="radix"][id*="-content-program"]', {
        timeout: 20000,
      }).should("be.visible");

      cy.get('[id*="radix"][id*="-content-program"] h3', { timeout: 10000 })
        .first()
        .should("have.text", "first program");

      cy.get('[id*="radix"][id*="-content-program"] button', { timeout: 10000 })
        .contains("Switch")
        .click({ force: true });

      cy.get("#global_modal", { timeout: 20000 }).should("be.visible");

      cy.get("#global_modal button", { timeout: 10000 })
        .contains("Go to Program")
        .click({ force: true });

      cy.url({ timeout: 20000 }).should("include", "/program");

      cy.get(".grid-cols-1.xl\\:grid-cols-2 button", { timeout: 10000 })
        .contains("Go to Bootcamp")
        .click({
          force: true,
        });
    });
  });
});
