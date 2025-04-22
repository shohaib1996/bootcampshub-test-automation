describe('Bootcamps Hub Landing page tests', () => {
    beforeEach(() => {
        cy.visit('/');
      });
      
  
    it('should load the page correctly', () => {
      cy.title().should('include', 'Bootcamps Hub');
      cy.url().should('include', '/');
    });
  });
