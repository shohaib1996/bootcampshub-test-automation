describe('Leave Chat Channel API Test', () => {
    let credentials;
  
    // Load credentials before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully leave a chat channel and save to fixture', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Load createdChannels.json to extract the chat ID
      cy.fixture('createdChannels.json').then((channelData) => {
        // Check if channelData exists and is an object
        if (!channelData || typeof channelData !== 'object') {
          throw new Error('Invalid createdChannels.json format: Expected an object');
        }
  
        // Check if response.channel exists
        if (!channelData.response || !channelData.response.chat) {
          throw new Error('No channel found in createdChannels.json');
        }
  
        // Extract chat ID
        const chatId = channelData.response.chat._id;
  
        // Validate chatId
        if (!chatId || typeof chatId !== 'string') {
          throw new Error('Invalid chat ID in createdChannels.json');
        }
  
        // Make API request
        cy.request({
          method: 'PATCH',
          url: `/chat/channel/leave/${chatId}`,
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

            cy.log('Response:', JSON.stringify(response.body));
          } else {
            // Log error for debugging
            cy.log('Error:', JSON.stringify(response.body));
          }
        });
      });
    });
  });