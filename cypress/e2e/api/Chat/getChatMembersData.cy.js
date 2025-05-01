describe('Fetch Chat Channel Members API Test', () => {
    let credentials;
  
    // Load credentials before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully fetch members of a chat channel and save to fixture', () => {
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
  
        // Define payload
        const payload = {
          limit: 15,
          page: 1
        };
  
        // Log the payload for debugging
        cy.log('Request payload:', JSON.stringify(payload));
  
        // Make API request
        cy.request({
          method: 'POST',
          url: `/chat/members/${chatId}`,
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
            expect(response.body).to.have.property('results').that.is.an('array');
            expect(response.body).to.have.property('pagination').that.is.an('object');
  
            // Validate each member in the results array
            response.body.results.forEach((member) => {
              expect(member).to.have.property('_id').that.is.a('string');
              expect(member).to.have.property('mute').that.is.an('object');
             
              // lastActive might not always be present, so check conditionally
              if (member.user.lastActive) {
                expect(member.user.lastActive).to.be.a('string');
              }
              expect(member).to.have.property('chat').that.equals(chatId);
            
            });
            const membersData = {
              chatId,
              limit: payload.limit,
              page: payload.page,
              response: response.body
            };
  
            // Overwrite channelMembers.json with the new data
            cy.writeFile('cypress/fixtures/channelMembers.json', membersData);
  
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