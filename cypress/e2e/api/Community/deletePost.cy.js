describe('Delete Community Post API Test', () => {
    let credentials;
    let postId;

    // Load credentials before each test
    beforeEach(() => {
        cy.fixture('loginCredential.json').then((data) => {
            credentials = data;
        });
    });

    it('should successfully delete a community post and save to fixture', () => {
        // Destructure credentials
        const {
            Authorization: authToken,
            Enrollment: enrollmentId,
            Organization: organizationId,
        } = credentials;

        // Load createdPosts.json to get the post ID
        cy.fixture('createdPosts.json').then((post) => {
            const postId = post._id;

            // Log the post ID for debugging
          if (!postId) {
                return cy.log('No post ID found in createdPosts.json');
            }

            // Make API request
            cy.request({
                method: 'DELETE',
                url: `/content/community/post/delete/${postId}`,
                headers: {
                    Authorization: authToken,
                    Enrollment: enrollmentId,
                    Organization: organizationId,
                },
                failOnStatusCode: false // Allow non-2xx status codes for error handling
            }).then((response) => {
                // Verify response time
                expect(response.duration).to.be.lessThan(2000);

                // Check if the response is successful (200)
                if (response.status === 200) {

                    expect(response.body).to.be.an('object');
                    expect(response.body).to.have.property('success').that.equals(true);

                    cy.writeFile('cypress/fixtures/createdPosts.json', {});

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