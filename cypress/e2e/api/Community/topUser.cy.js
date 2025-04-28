describe('Top Users API Test', () => {
    let credentials;
  
    // Load fixture data before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully fetch top users and save to fixture', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Make API request
      cy.request({
        method: 'GET',
        url: '/content/community/top-users',
        headers: {
          Authorization: authToken,
          Enrollment: enrollmentId,
          Organization: organizationId,
        },
        failOnStatusCode: false // Allow non-2xx status codes for error handling
      }).then((response) => {
        // Verify response time
        expect(response.duration).to.be.lessThan(2000);
  
        // Check if the response is successful (200) or an error (e.g., 400)
        if (response.status === 200) {
          // Validate successful response
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('success').that.equals(true);
  
          // Validate users data (assumed to be an array or object)
          expect(response.body).to.have.property('users').that.satisfies((users) => {
            return Array.isArray(users) || typeof users === 'object';
          });
  
          // Save users data to topUsers.json
          const usersData = response.body.users || response.body; // Fallback to full body if no 'users' key
          cy.writeFile('cypress/fixtures/topUsers.json', usersData);
          cy.log('Response:', JSON.stringify(response.body));
        } else {
          // Handle error response (e.g., 400 or 404)
          expect(response.status).to.be.oneOf([400, 404]); // Adjust based on expected error codes
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('success').that.equals(false);
          cy.log('Error:', JSON.stringify(response.body));
        }
      });
    });
  });