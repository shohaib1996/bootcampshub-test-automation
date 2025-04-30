describe('Save Community Post API Test', () => {
    let credentials;

    // Load credentials before each test
    beforeEach(() => {
        cy.fixture('loginCredential.json').then((data) => {
            credentials = data;
        });
    });

    it('should successfully save a community post and save to fixture', () => {
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

            // Define payload
            const payload = {
                post: postId,
                action: 'save'
            };

            // Log the payload for debugging
            cy.log('Request payload:', JSON.stringify(payload));

            // Make API request
            cy.request({
                method: 'POST',
                url: '/content/community/post/option/save',
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

                    // Save save info to savedPosts.json
                    const saveData = {
                        postId,
                        response: response.body
                    };
                    cy.writeFile('cypress/fixtures/savedPosts.json', saveData);
                    cy.log('Response:', JSON.stringify(response.body));
                } else {
                    // Log error for debugging
                    cy.log('Error:', JSON.stringify(response.body));
                }
            });
        });
    });
});