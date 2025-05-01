describe('Toggle Favourite Chat API Test', () => {
    let credentials;
  
    // Load credentials before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully toggle a chat as favourite and save to fixture', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Load myChatsId.json to get the chat ID
      cy.fixture('myChatsId.json').then((chatIds) => {
        // Check if chatIds exists and is a non-empty array
        if (!chatIds || !Array.isArray(chatIds) || chatIds.length === 0) {
          throw new Error('No valid chat IDs found in myChatsId.json');
        }
  
        // Use the first chat ID
        const chatId = chatIds[0];
  
          const payload = {
            chat: chatId,
            isFavourite: true
          };
  
          // Log the payload for debugging
          cy.log('Request payload (first run):', JSON.stringify(payload));
  
          // Make API request
          cy.request({
            method: 'PUT',
            url: '/chat/favourite',
            headers: {
              Authorization: authToken,
              Enrollment: enrollmentId,
              Organization: organizationId,
            },
            body: payload,
            failOnStatusCode: false // Allow non-2xx status codes for error handling
          }).then((response) => {
            // Verify response time
            expect(response.duration).to.be.lessThan(2000);
  
            // Check if the response is successful (200)
            if (response.status === 200) {
              // Validate response structure
              expect(response.body).to.be.an('object');
              expect(response.body).to.have.property('success').that.equals(true);
  
              // Save favourite status to favouriteChats.json as a single object
              const favouriteChatData = {
                chatId,
                isFavourite: true,
                response: response.body
              };
  
              // Overwrite favouriteChats.json with the new data
              cy.writeFile('cypress/fixtures/favouriteChats.json', favouriteChatData);
  
              // Log response for debugging
              cy.log('Response:', JSON.stringify(response.body));
            } else {
              // Log error for debugging
              cy.log('Error:', JSON.stringify(response.body));
            }
          });
        });
      });
    });
  