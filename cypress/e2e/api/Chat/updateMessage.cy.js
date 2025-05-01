describe('Update Chat Message API Test', () => {
    let credentials;

    // Load credentials before each test
    beforeEach(() => {
        cy.fixture('loginCredential.json').then((data) => {
            credentials = data;
        });
    });

    it('should successfully update a chat message and save to fixture', () => {
        // Destructure credentials
        const {
            Authorization: authToken,
            Enrollment: enrollmentId,
            Organization: organizationId,
        } = credentials;

        // Load sentMessages.json to extract the message ID and files
        cy.fixture('sentMessages.json').then((sentMessages) => {
            // Check if sentMessages exists and is a non-empty array
            if (!sentMessages || typeof sentMessages !== 'object') {
                throw new Error('Invalid sentMessages.json format: Expected an object');
              }
        
              // Check if response.message exists
              if (!sentMessages.response || !sentMessages.response.message) {
                throw new Error('No message found in sentMessages.json');
              }
            // Use the most recent sent message (last entry in the array)
           
            const messageId = sentMessages.response.message._id;

            // Validate messageId
            if (!messageId || typeof messageId !== 'string') {
                throw new Error('Invalid message ID in sentMessages.json');
            }

            // Extract and map files from response.message.files
            let files = [];
            const responseFiles = sentMessages.response.message.files;
            if (Array.isArray(responseFiles) && responseFiles.length > 0) {
                files = responseFiles.map((file) => ({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    url: file.url
                }));
            }

            // Define payload
            const payload = {
                text: 'test message sdf sdfsfd',
                files: files
            };

            // Log the payload for debugging
            cy.log('Request payload:', JSON.stringify(payload));

            // Make API request
            cy.request({
                method: 'PATCH',
                url: `/chat/update/message/${messageId}`,
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
                    expect(response.body).to.have.property('message').that.is.an('object');

                    // Validate message object fields
                    const { message } = response.body;
                    expect(message).to.have.property('chat').that.is.an('string');
                    expect(message).to.have.property('files').that.is.an('array');
                    expect(message.files).to.have.lengthOf(files.length);
                    expect(message).to.have.property('text').that.is.a('string');

                    // Save updated message details to updatedMessages.json
                    const messageData = {
                        messageId,
                        text: payload.text,
                        files: payload.files,
                        response: response.body
                    };
                    cy.writeFile('cypress/fixtures/updatedMessages.json', messageData);
                    cy.log('Response:', JSON.stringify(response.body));
                } else {
                    // Log error for debugging
                    cy.log('Error:', JSON.stringify(response.body));
                }
            });
        });
    });
});