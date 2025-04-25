describe('My Chapters API Test', () => {
    let credentials;
    let programData;
    let categoryData;
  
    // Load fixture data before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
      cy.fixture('programSlug.json').then((data) => {
        programData = data;
      });
      cy.fixture('programCategory.json').then((data) => {
        categoryData = data;
      });
    });
  
    it('should successfully fetch my chapters for each category ID', () => {
      // Destructure credentials and program data
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
      const { programSlug } = programData;
  
      // Iterate through each category _id in programCategory.json
      categoryData.forEach((category, index) => {
        const programId = category._id;
  
        // Construct URL with encoded programSlug
  
        const url = `/course/chapterv2/mychapters/${programSlug}/${programId}`;
  
        // Log the URL for debugging
        cy.log(`Requesting chapters for category ID ${programId}: ${url}`);
  
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
            expect(response.body).to.have.property('chapters').that.is.an('array');
  
            // Log response for debugging (remove in production)
            cy.log(`Response for category ID ${programId}:`, JSON.stringify(response.body));
          } else {
            // Handle error response (e.g., 400 for invalid ID)
          
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('success').that.equals(false);
            cy.log(`Error for category ID ${programId}:`, JSON.stringify(response.body));
          }
        });
      });
    });
  });