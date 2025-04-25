describe('My Media API Test', () => {
    let credentials;

    // Load fixture data before each test
    beforeEach(() => {
        cy.fixture('loginCredential.json').then((data) => {
            credentials = data;
        });
    });

    it('should successfully fetch my media and validate mediaType', () => {
        // Destructure credentials
        const {
            Authorization: authToken,
            Enrollment: enrollmentId,
            Organization: organizationId,
        } = credentials;

        // Make API request
        cy.request({
            method: 'GET',
            url: '/media/mymedia',
            headers: {
                Authorization: authToken,
                Enrollment: enrollmentId,
                Organization: organizationId,
            },
        }).then((response) => {
            // Verify response time
            expect(response.duration).to.be.lessThan(2000);

            // Verify response status
            expect(response.status).to.eq(200);

            // Basic response structure validations
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('success').that.equals(true);
            expect(response.body).to.have.property('medias').that.is.an('array');

            // Validate medias array
            response.body.medias.forEach((media, index) => {
                expect(media).to.have.property('mediaType').that.is.a('string').and.is.oneOf(['audio', 'video']);
                cy.log(`Media ${index + 1}:`, JSON.stringify(media));
            });

            // Extract media IDs
            const mediaIds = response.body.medias.map((media) => media._id);

            // Write media IDs to mediasId.json
            cy.writeFile('cypress/fixtures/mediasId.json', mediaIds, { encoding: 'utf8' });

            cy.log('Response:', JSON.stringify(response.body));
        });
    });
});