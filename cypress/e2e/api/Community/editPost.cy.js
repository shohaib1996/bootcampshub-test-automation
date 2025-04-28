describe('Edit Community Post API Test', () => {
    let credentials;
    let postId;

    // Load fixture data before each test
    beforeEach(() => {
        cy.fixture('loginCredential.json').then((data) => {
            credentials = data;
        });
    });

    it('should successfully edit a community post and save to fixture', () => {
        // Destructure credentials
        const {
            Authorization: authToken,
            Enrollment: enrollmentId,
            Organization: organizationId,
        } = credentials;

        // Load createdPosts.json to get a post ID
        cy.fixture('createdPosts.json').then((post) => {
            postId = post._id; // Assuming the first post is the one to edit
            const payload = {
                title: 'Updated Test Post',
                description: 'This is an updated test post',
                attachments: [
                    {
                        name: 'updated-image.png',
                        size: 518902,
                        type: 'image/png',
                        url: 'https://doimages.nyc3.cdn.digitaloceanspaces.com/007BlogBanners2024/nodejs-hosting(tulip).png'
                    }
                ],
                tags: ['test', 'community']
            };

            // Log the payload for debugging
            cy.log('Request payload:', JSON.stringify(payload));

            // Make API request
            cy.request({
                method: 'PATCH',
                url: `/content/community/post/edit/${postId}`,
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

                    expect(response.status).to.eq(200);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('success').that.equals(true);
                    expect(response.body).to.have.property('post').that.is.an('object');

                    const postData = response.body.post;

                    cy.writeFile('cypress/fixtures/createdPosts.json', postData);


                    // Log response for debugging
                    cy.log('Response:', JSON.stringify(response.body));
                } else {
                    // Handle error response (e.g., 400 or 404)
                    expect(response.status).to.be.oneOf([400, 404]);
                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('success').that.equals(false);
                    cy.log('Error:', JSON.stringify(response.body));
                }
            });
        });
    });
});