describe('Get Comments API Test', () => {
    let credentials;
    let mediaIds;
  
    // Load fixture data before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
      cy.fixture('mediasId.json').then((data) => {
        mediaIds = data;
      });
    });
  
    it('should successfully fetch comments for each media ID', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Iterate through each media ID in mediasId.json
      mediaIds.forEach((mediaId, index) => {
        // Construct URL with media ID
        const url = `/content/comment/get/${mediaId}`;
  
        // Log the URL for debugging
        cy.log(`Requesting comments for media ID ${mediaId}: ${url}`);
  
        // Make API request
        cy.request({
          method: 'GET',
          url,
          headers: {
            Authorization: authToken,
            Enrollment: enrollmentId,
            Organization: organizationId,
          },
          failOnStatusCode: false, // Allow non-2xx status codes for invalid IDs
        }).then((response) => {
          // Verify response time
          expect(response.duration).to.be.lessThan(2000);
  
          // Check if the response is successful (200) or an error (e.g., 400)
          if (response.status === 200) {
            // Validate successful response
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('success').that.equals(true);
        
            // Log response for debugging
            cy.log(`Response for media ID ${mediaId}:`, JSON.stringify(response.body));
          } else {
            cy.log(`Error for media ID ${mediaId}:`, JSON.stringify(response.body));
          }
        });
      });
    });
  });