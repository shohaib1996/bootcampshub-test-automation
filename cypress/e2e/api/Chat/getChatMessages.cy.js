describe('Get Chat Messages API Test', () => {
    let credentials;

    // Load credentials before each test
    beforeEach(() => {
        cy.fixture('loginCredential.json').then((data) => {
            credentials = data;
        });
    });

    it('should successfully retrieve chat messages and save to fixture', () => {
        // Destructure credentials
        const {
            Authorization: authToken,
            Enrollment: enrollmentId,
            Organization: organizationId,
        } = credentials;

        // Load myChatsId.json to get the chat ID
        cy.fixture('myChatsId.json').then((chatIds) => {
            // Check if chatIds exists and is a non-empty array
            if (!chatIds || !Array.isArray(chatIds) || chatIds.length === 0) {
                throw new Error('No valid chat IDs found in myChatsId.json');
            }

            // Use the first chat ID
            const chatId = chatIds[0];

            // Define payload
            const payload = {
                page: 1,
                chat: chatId,
                limit: 15,
                query: ''
            };

            // Log the payload for debugging
            cy.log('Request payload:', JSON.stringify(payload));

            // Make API request
            cy.request({
                method: 'POST',
                url: '/chat/messages',
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

                    // Validate each message object if the array is not empty
                    if (response.body.length > 0) {
                        response.body.forEach((message) => {
                            expect(message).to.have.property('_id').that.is.a('string');
                            expect(message).to.have.property('text').that.is.a('string');
                            expect(message).to.have.property('sender').that.is.an('object');
                        });
                    }

                    // Save chat ID and messages to chatMessages.json
                    const messagesData = {
                        chatId,
                        messages: response.body
                    };



                    cy.writeFile('cypress/fixtures/chatMessages.json', messagesData);


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