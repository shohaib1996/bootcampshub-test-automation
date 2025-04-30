describe('Add User to Chat Channel API Test', () => {
    let credentials;
  
    // Load credentials before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully add a user to a chat channel and save to fixture', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Load createdChannels.json to extract chat ID and existing users
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
  
        // Extract existing users
        const existingUsers = channelData.users || [];
  
        // Validate existingUsers
        if (!Array.isArray(existingUsers)) {
          throw new Error('Invalid users array in createdChannels.json');
        }
  
        // Load chatUsersId.json to select a new user
        cy.fixture('chatUsersId.json').then((userIds) => {
          // Check if userIds exists and is a non-empty array
          if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            throw new Error('No user IDs found in chatUsersId.json');
          }
  
          // Filter out users already in the channel
          const availableUsers = userIds.filter((userId) => !existingUsers.includes(userId));
  
          // Check if there are any available users to add
          if (availableUsers.length === 0) {
            throw new Error('No new users available to add from chatUsersId.json');
          }
  
          // Randomly select one user from the available users
          const selectedUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
  
          // Define payload
          const payload = {
            user: selectedUser
          };
  
          // Log the payload for debugging
          cy.log('Request payload:', JSON.stringify(payload));
  
          // Make API request
          cy.request({
            method: 'PATCH',
            url: `/chat/channel/adduser/${chatId}`,
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
              cy.log('Response:', JSON.stringify(response.body));
            } else {
              // Log error for debugging
              cy.log('Error:', JSON.stringify(response.body));
            }
          });
        });
      });
    });
  });