describe('React to Community Post API Test', () => {
    let credentials;

    // Load credentials before each test
    beforeEach(() => {
        cy.fixture('loginCredential.json').then((data) => {
            credentials = data;
        });
    });

    it('should successfully react to a community post and save to fixture', () => {
        // Destructure credentials
        const {
            Authorization: authToken,
            Enrollment: enrollmentId,
            Organization: organizationId,
        } = credentials;

        // Load createdPosts.json to get the post ID
        cy.fixture('createdPosts.json').then((post) => {
            // Check if post exists and has an _id
            if (!post || !post._id) {
                throw new Error('No valid post found in createdPosts.json');
            }

            // Use the post's _id
            const postId = post._id;

            // Define available emojis
            const emojies = ['❤️', '👍', '🙏', '😂', '🥰', '😯'];
            // Randomly select an emoji
            const emoji = emojies[Math.floor(Math.random() * emojies.length)];

            // Define payload
            const payload = {
                symbol: emoji
            };

            // Log the payload for debugging
            cy.log('Request payload:', JSON.stringify(payload));

            // Make API request
            cy.request({
                method: 'PUT',
                url: `/content/community/post/react/${postId}`,
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
                    
                    // Create or update reactions object
                    let updatedReactions = post.reactions || {};
                    
                    // Increment the count for the selected emoji
                    updatedReactions[emoji] = (updatedReactions[emoji] || 0) + 1;
                    
                    cy.writeFile('cypress/fixtures/createdPosts.json', {
                        ...post,
                        myReaction: emoji,
                        reactions: updatedReactions,
                        reactionsCount: (post.reactionsCount || 0) + 1,
                        isSaved: false,
                        isReported: false
                    });

                    cy.log('Response:', JSON.stringify(response.body));
                } else {
                    // Log error for debugging
                    cy.log('Error:', JSON.stringify(response.body));
                }
            });
        });
    });
});