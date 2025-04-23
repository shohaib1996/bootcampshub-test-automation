describe('My Transaction API Test', () => {
    let credentials;
  
    // Load fixture data before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully fetch my transactions', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Make API request
      cy.request({
        method: 'GET',
        url: 'https://staging-api.bootcampshub.ai/api/transaction/mytransaction',
        headers: {
          Authorization: authToken,
          Enrollment: enrollmentId,
          Organization: organizationId,
        },
      }).then((response) => {
        // Verify response status
        expect(response.status).to.eq(200);
  
        // Basic response structure validations
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('success').that.equals(true);
        expect(response.body).to.have.property('transactions').that.is.an('array');
  
  
        // Log response for debugging (remove in production)
        cy.log('Response:', JSON.stringify(response.body));
      });
    });
  });