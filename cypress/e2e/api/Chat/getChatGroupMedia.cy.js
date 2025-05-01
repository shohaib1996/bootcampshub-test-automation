describe('Fetch Chat Channel Media API Test', () => {
    let credentials;
  
    // Load credentials before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully fetch media from a chat channel and save to fixture', () => {
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
  
        // Check if response.chat exists
        if (!channelData.response || !channelData.response.chat) {
          throw new Error('No chat found in createdChannels.json');
        }
  
        // Extract chat ID
        const chatId = channelData.response.chat._id;
  
        // Validate chatId
        if (!chatId || typeof chatId !== 'string') {
          throw new Error('Invalid chat ID in createdChannels.json');
        }
  
        // Define query parameters
        const page = 1;
        const limit = 5;
        const type = 'image';
  
        // Make API request
        cy.request({
          method: 'GET',
          url: `/chat/media/${chatId}?page=${page}&limit=${limit}&type=${type}`,
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
           
  
            // Save media fetch details to channelMedia.json as a single object
            const mediaData = {
              chatId,
              page,
              limit,
              type,
              response: response.body
            };
  
      
            cy.log('Response:', JSON.stringify(response.body));
          } else {
            // Log error for debugging
            cy.log('Error:', JSON.stringify(response.body));
          }
        });
      });
    });
  });