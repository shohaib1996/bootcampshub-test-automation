describe('Verify User API Test', () => {
    let credentials;
  
    // Load credentials before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully verify user and save enrollments to fixture', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Define payload
      const payload = {
        organization: organizationId
      };
  
      // Log the payload for debugging
      cy.log('Request payload:', JSON.stringify(payload));
  
      // Make API request
      cy.request({
        method: 'POST',
        url: '/user/verify',
        headers: {
          Authorization: authToken,
          Enrollment: enrollmentId,
          Organization: organizationId,
        },
        body: payload,
        failOnStatusCode: false // Allow non-2xx status codes for error handling
      }).then((response) => {
        // Verify response time
        expect(response.duration).to.be.lessThan(10000);
  
        // Check if the response is successful (200)
        if (response.status === 200) {
          // Validate response structure
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('enrollments').that.is.an('array');
  
          // Save enrollments to enrollments.json
          const enrollmentsData = response.body.enrollments;
          cy.writeFile('cypress/fixtures/myEnrollments.json', enrollmentsData);
  
          // Log response for debugging
          cy.log('Response:', JSON.stringify(response.body));
        } else {
          // Log error for debugging
          cy.log('Error:', JSON.stringify(response.body));
        }
      });
    });
  });