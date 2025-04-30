describe('Check User Online Status API Test', () => {
    let credentials;
  
    // Load credentials before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully check user online status and save to fixture', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Make API request
      cy.request({
        method: 'GET',
        url: '/user/online',
        headers: {
          Authorization: authToken,
          Enrollment: enrollmentId,
          Organization: organizationId,
        },
        failOnStatusCode: false // Allow non-2xx status codes for error handling
      }).then((response) => {
        // Verify response time
        expect(response.duration).to.be.lessThan(2000);
  
        // Check if the response is successful (200)
        if (response.status === 200) {
          // Validate response structure
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('success').that.equals(true);

  
          // Save response to onlineStatus.json
          cy.writeFile('cypress/fixtures/onlineStatus.json', response.body);
  
          // Log response for debugging
          cy.log('Response:', JSON.stringify(response.body));
        } else {
          // Log error for debugging
          cy.log('Error:', JSON.stringify(response.body));
        }
      });
    });
  });