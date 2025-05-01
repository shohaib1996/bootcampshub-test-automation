describe('Add Message Reaction API Test', () => {
    let credentials;

    // Load credentials before each test
    beforeEach(() => {
        cy.fixture('loginCredential.json').then((data) => {
            credentials = data;
        });
    });

    it('should successfully add a reaction to a message and save to fixture', () => {
        // Destructure credentials
        const {
            Authorization: authToken,
            Enrollment: enrollmentId,
            Organization: organizationId,
        } = credentials;

        // Load sentMessages.json to extract the message ID
        cy.fixture('sentMessages.json').then((sentMessages) => {

            const messageId = sentMessages.response.message._id;

            // Validate messageId
            if (!messageId || typeof messageId !== 'string') {
                throw new Error('Invalid message ID in sentMessages.json');
            }

            // Define available emojis
            const emojis = ['👍', '😎', '❤️', '😂', '🥳', '😯'];

            // Randomly select an emoji
            const selectedSymbol = emojis[Math.floor(Math.random() * emojis.length)];

            // Define payload
            const payload = {
                symbol: selectedSymbol
            };

            // Log the payload for debugging
            cy.log('Request payload:', JSON.stringify(payload));

            // Make API request
            cy.request({
                method: 'PUT',
                url: `/chat/react/${messageId}`,
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
                    expect(response.body).to.have.property('message').that.is.an('object');

                    // Validate message object fields
                    const { message } = response.body;
    
                    expect(message).to.have.property('reactionsCount').that.is.a('number');
                    expect(message).to.have.property('reactions').that.is.an('object');
                   
                    expect(message).to.have.property('myReaction').that.equals(selectedSymbol);

                    // Save reaction details to messageReactions.json
                    const reactionData = {
                        messageId,
                        symbol: selectedSymbol,
                        response: response.body
                    };


                    cy.writeFile('cypress/fixtures/messageReactions.json', reactionData);


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