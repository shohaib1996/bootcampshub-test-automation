describe('Track your calendar events and status', () => {
    let credentials;
  
    // Load fixture data before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully post to dashboard portal', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Define payload
      const payload = {
        calendar: {},
      };
  
      // Make API request
      cy.request({
        method: 'POST',
        url: '/dashboard/portal',
        headers: {
          Authorization: authToken,
          Enrollment: enrollmentId,
          Organization: organizationId,
        },
        body: payload,
      }).then((response) => {
        // Verify response status
        expect(response.status).to.eq(200);
  
        // Basic response structure validations
        expect(response.body).to.be.an('object');
        
  
        expect(response.body).to.have.property('success').that.equals(true);
        expect(response.body).to.have.property('data').that.is.an('object');
        
        // Log response for debugging (remove in production)
        cy.log('Response:', JSON.stringify(response.body));
      });
    });
  });