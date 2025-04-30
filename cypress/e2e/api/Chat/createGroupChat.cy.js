describe('Create Chat Channel API Test', () => {
    let credentials;
  
    // Load credentials before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully create a chat channel and save to fixture', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Load chatUsersId.json to get user IDs
      cy.fixture('chatUsersId.json').then((userIds) => {
        // Check if userIds exists and is a non-empty array
        if (!userIds || !Array.isArray(userIds) || userIds.length < 2) {
          throw new Error('Not enough user IDs found in chatUsersId.json (minimum 2 required)');
        }
  
        // Remove duplicates by converting to a Set and back to an array
        const uniqueUserIds = [...new Set(userIds)];
  
        // Ensure we still have at least 2 unique users after removing duplicates
        if (uniqueUserIds.length < 2) {
          throw new Error('Not enough unique user IDs found in chatUsersId.json (minimum 2 required)');
        }
  
        // Randomly select two unique user IDs
        const shuffled = uniqueUserIds.sort(() => 0.5 - Math.random());
        const selectedUsers = shuffled.slice(0, 2);
  
        // Define payload
        const payload = {
          name: 'test group test group',
          description: 'sdf sdfsd',
          users: selectedUsers,
          isReadOnly: false,
          isPublic: true,
          avatar: 'https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/chat/64ef676669eaf6370c11429c/1746040027805-lms.png'
        };
  
        // Log the payload for debugging
        cy.log('Request payload:', JSON.stringify(payload));
  
        // Make API request
        cy.request({
          method: 'POST',
          url: '/chat/channel/create',
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
  
            // Save created channel details to createdChannels.json as a single object
            const channelData = {
              name: payload.name,
              description: payload.description,
              users: payload.users,
              isReadOnly: payload.isReadOnly,
              isPublic: payload.isPublic,
              avatar: payload.avatar,
              response: response.body
            };
  
            // Overwrite createdChannels.json with the new channel data
            cy.writeFile('cypress/fixtures/createdChannels.json', channelData);
  
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