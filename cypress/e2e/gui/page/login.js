class loginPage {
  visit() {
    cy.visit('/auth/login'); // Replace with your actual login URL
  }

//   clickLoginButton() {
//     cy.wait(5000); 
//     cy.get('[data-testid="login-button"] > .flex').click({ force: true });
//   }

    enterEmail() {
        cy.get('[data-testid="email-input"]').type("Ashraful186@@");
    }
    
    enterPassword() {
        cy.get('[data-testid="pass-input"]').type("Ashraful186@@");
    }


}

export default loginPage