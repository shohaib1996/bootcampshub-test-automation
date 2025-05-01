describe('Get My Chats API Test', () => {
    let credentials;
  
    // Load credentials before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully retrieve all chats and save to fixture', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Make API request
      cy.request({
        method: 'GET',
        url: '/chat/mychats',
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
        if (response) {
          // Validate response structure
          expect(response.body).to.be.an('object');
          expect(response.body.chats).to.be.an('array');
  
          // Validate each chat object if the array is not empty
       
  
          // Save response to myChats.json
          cy.writeFile('cypress/fixtures/myChats.json', response.body.chats);
          cy.writeFile('cypress/fixtures/myChatsId.json', response.body.chats.map(chat => chat._id))
  
          // Log response for debugging
          cy.log('Response:', JSON.stringify(response.body))
        } else {
          // Log error for debugging
          cy.log('Error:', JSON.stringify(response.body));
        }
      });
    });
  });