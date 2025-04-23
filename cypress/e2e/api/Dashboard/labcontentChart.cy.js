describe('Lab Content API Test', () => {
    let credentials;
  
    // Load fixture data before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully fetch lab content', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Make API request
      cy.request({
        method: 'GET',
        url: '/content/labcontent?page=1&limit=10',
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
  
        // Add specific assertions based on expected response structure
        // Example placeholders (modify based on actual response):
        expect(response.body).to.have.property('success').that.equals(true);
        expect(response.body).to.have.property('contents').that.is.an('array');
        expect(response.body).to.have.property('count').that.is.an('number');
  
        // Log response for debugging (remove in production)
        cy.log('Response:', JSON.stringify(response.body));
      });
    });
  });