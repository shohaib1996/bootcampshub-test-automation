describe('Update Chat Member API Test', () => {
    let credentials;
  
    // Load credentials before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully update a chat member\'s mute notification settings and save to fixture', () => {
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
  
        // Load channelMembers.json to extract a member ID
        cy.fixture('channelMembers.json').then((membersData) => {
          // Check if membersData exists and is an object
          if (!membersData || typeof membersData !== 'object') {
            throw new Error('Invalid channelMembers.json format: Expected an object');
          }
  
          // Check if response.results exists and is a non-empty array
          if (
            !membersData.response ||
            !membersData.response.results ||
            !Array.isArray(membersData.response.results) ||
            membersData.response.results.length === 0
          ) {
            throw new Error('No members found in channelMembers.json');
          }
  
          // Extract the first member ID (can adjust to select a specific member if needed)
          const memberId = membersData.response.results[0]._id;
  
          // Validate memberId
          if (!memberId || typeof memberId !== 'string') {
            throw new Error('Invalid member ID in channelMembers.json');
          }
  
          // Randomly select a number between 1 and 5 (inclusive) for selectedOption
        //   const selectedOption = Math.floor(Math.random() * 5) + 1;
          const selectedOption = 5
  
          // Define payload
          const payload = {
            member: memberId,
            selectedOption,
            dateUntil: null,
            chat: chatId,
            actionType: 'mutenoti'
          };
  
          // Log the payload for debugging
          cy.log('Request payload:', JSON.stringify(payload));
  
          // Make API request
          cy.request({
            method: 'POST',
            url: '/chat/member/update',
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
  
              // Save update details to updatedMembers.json as a single object
              const updatedMemberData = {
                member: memberId,
                chatId,
                selectedOption,
                dateUntil: payload.dateUntil,
                actionType: payload.actionType,
                response: response.body
              };
  
              // Overwrite updatedMembers.json with the new data
              cy.writeFile('cypress/fixtures/updatedMembers.json', updatedMemberData);
  
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
  });