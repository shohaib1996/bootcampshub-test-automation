describe('Search Users API Test', () => {
    let credentials;
  
    // Load credentials before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully search users and save chat user IDs to fixture', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Make API request
      cy.request({
        method: 'GET',
        url: '/chat/searchuser?query=',
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
          expect(response.body).to.have.property('users').that.is.an('array');
  
          // Validate each user object in the users array
          response.body.users.forEach((user) => {
            expect(user).to.have.property('_id').that.is.a('string');
            expect(user).to.have.property('firstName').that.is.a('string');
            expect(user).to.have.property('lastName').that.is.a('string');
            expect(user).to.have.property('email').that.is.a('string');
            expect(user).to.have.property('phone').that.satisfies((phone) => {
              return typeof phone === 'string' || (typeof phone === 'object' && 'number' in phone);
            });
            expect(user).to.have.property('profilePicture').that.is.a('string');
            expect(user).to.have.property('createdAt').that.is.a('string');
            expect(user).to.have.property('fullName').that.is.a('string');
            // lastActive might not always be present, so check conditionally
            if (user.lastActive) {
              expect(user.lastActive).to.be.a('string');
            }
          });
  
          // Extract chat user IDs from the users array
          const chatUsersId = response.body.users.map((user) => user._id);
  
          // Save chat user IDs to chatUsersId.json as an array
          cy.writeFile('cypress/fixtures/chatUsersId.json', chatUsersId);
  
          // Log response for debugging
          cy.log('Response:', JSON.stringify(response.body));
        } else {
          // Log error for debugging
          cy.log('Error:', JSON.stringify(response.body));
        }
      });
    });
  });