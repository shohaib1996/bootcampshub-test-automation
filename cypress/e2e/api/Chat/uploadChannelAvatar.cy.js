describe('Update Chat Channel API Test', () => {
    let credentials;
  
    // Load credentials before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully update a chat channel avatar and save to fixture', () => {
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
  
        // Check if response.chat exists
        if (!channelData.response || !channelData.response.chat) {
          throw new Error('No chat found in createdChannels.json');
        }
  
        // Extract channel ID
        const channelId = channelData.response.chat._id;
  
        // Validate channelId
        if (!channelId || typeof channelId !== 'string') {
          throw new Error('Invalid channel ID in createdChannels.json');
        }
  
        // Define payload
        const payload = {
          avatar: 'https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/chat/64ef676669eaf6370c11429c/1746043726385-lms.JPEG'
        };
  
        // Log the payload for debugging
        cy.log('Request payload:', JSON.stringify(payload));
  
        // Make API request
        cy.request({
          method: 'PATCH',
          url: `/chat/channel/update/${channelId}`,
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
            expect(response.body).to.have.property('channel').that.is.an('object');
  
            // Validate channel object fields
            const { channel } = response.body;
            expect(channel).to.have.property('isPublic').that.equals(true);
            expect(channel).to.have.property('isReadOnly').that.equals(false);
            expect(channel).to.have.property('memberScope').that.equals('custom');
            expect(channel).to.have.property('_id').that.equals(channelId);
            expect(channel).to.have.property('name').that.is.a('string');
            expect(channel).to.have.property('description').that.is.a('string');
            expect(channel).to.have.property('avatar').that.equals(payload.avatar);
  
            // Save updated channel details to updatedChannels.json as a single object
            const updatedChannelData = {
              channelId,
              avatar: payload.avatar,
              response: response.body
            };
  
            // Overwrite updatedChannels.json with the new data
            cy.writeFile('cypress/fixtures/updatedChannels.json', updatedChannelData);
  
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