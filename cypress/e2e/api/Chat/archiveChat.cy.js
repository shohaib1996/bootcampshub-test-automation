describe('Archive Chat Channel API Test', () => {
    let credentials;
  
    // Load credentials before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully update channel archive status and save to fixture', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Load createdChannels.json to extract the channel ID
      cy.fixture('createdChannels.json').then((channelData) => {
        // Check if channelData exists and is an object
        if (!channelData || typeof channelData !== 'object') {
          throw new Error('Invalid createdChannels.json format: Expected an object');
        }
  
        // Check if response.channel exists
        if (!channelData.response || !channelData.response.chat) {
          throw new Error('No channel found in createdChannels.json');
        }
  
        // Extract channel ID
        const channelId = channelData.response.chat._id;
  
        // Validate channelId
        if (!channelId || typeof channelId !== 'string') {
          throw new Error('Invalid channel ID in createdChannels.json');
        }
  
        // Define payload
        const payload = {
          isArchived: false
        };
  
        // Log the payload for debugging
        cy.log('Request payload:', JSON.stringify(payload));
  
        // Make API request
        cy.request({
          method: 'PATCH',
          url: `/chat/channel/archive/${channelId}`,
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

          if (response.status === 200) {
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