describe('assertion', () => {
    beforeEach(() => {
      cy.visit('/', { timeout: 10000 }); // Increase timeout for page load
      // Wait for any critical API calls (adjust the URL pattern)
      cy.intercept('GET', '/api/**').as('apiCalls');
      cy.wait('@apiCalls', { timeout: 10000 }).its('response.statusCode').should('eq', 200);
    });
  
    it('should have working CTA buttons', () => {
      // Debug: Log found elements
      cy.contains('Get Started Now', { timeout: 10000 })
        .should('be.visible')
        .then(($el) => {
          cy.log(`Found "Get Started Now" element: ${$el.length}`);
        })
        .closest('a')
        .should('have.attr', 'href', '/auth/login')
        .and('be.visible');
  
      cy.contains('See How it Works', { timeout: 10000 })
        .should('be.visible')
        .then(($el) => {
          cy.log(`Found "See How it Works" element: ${$el.length}`);
        })
        .closest('a')
        .should('have.attr', 'href', '/book-a-demo')
        .and('be.visible');
    });
  });