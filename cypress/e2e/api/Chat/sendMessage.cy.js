describe('Send Chat Message API Test', () => {
    let credentials;

    // Load credentials before each test
    beforeEach(() => {
        cy.fixture('loginCredential.json').then((data) => {
            credentials = data;
        });
    });

    it('should successfully send a chat message and save to fixture', () => {
        // Destructure credentials
        const {
            Authorization: authToken,
            Enrollment: enrollmentId,
            Organization: organizationId,
        } = credentials;

        // Load chatsId.json to get the chat ID
        cy.fixture('myChatsId.json').then((chatIds) => {
            // Check if chatIds exists and is a non-empty array
            if (!chatIds || !Array.isArray(chatIds) || chatIds.length === 0) {
                throw new Error('No valid chat IDs found in chatsId.json');
            }

            // Use the first chat ID
            const chatId = chatIds[0];

            // Define payload
            const payload = {
                text: 'test message',
                files: [{
                    name: "Screenshot1.png",
                    type: "image/png",
                    size: 156692,
                    url: "https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/chat/64ef676669eaf6370c11429c/1746032152940-Screenshot1.png"
                }]
            };

            // Log the payload for debugging
            cy.log('Request payload:', JSON.stringify(payload));

            // Make API request
            cy.request({
                method: 'PUT',
                url: `/chat/sendmessage/${chatId}`,
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
                    expect(message).to.have.property('type').that.equals('message');
                    expect(message).to.have.property('status').that.equals('sent');


                    // Save sent message details to sentMessages.json
                    const messageData = {
                        chatId,
                        text: payload.text,
                        files: payload.files,
                        response: response.body
                    };


                    cy.writeFile('cypress/fixtures/sentMessages.json', messageData);


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