describe('Get All Community Posts API Test', () => {
    let credentials;
  
    // Load fixture data before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully fetch community posts with dynamic page and filterBy', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Define dynamic field values
      const pages = [1, 2];
      const filters = ['save', 'report', 'mypost', 'recent', 'lastweek', 'lastmonth'];
  
      // Iterate through all combinations of page and filterBy
      pages.forEach((page) => {
        filters.forEach((filterBy) => {
          // Define payload with dynamic fields
          const payload = {
            page: page,
            limit: 10,
            query: '', // Placeholder, update with search values if provided
            tags: [], // Placeholder, update with tags if provided
            user: null, // Placeholder, update with user IDs if provided
            filterBy: filterBy
          };
  
          // Log the payload for debugging
          cy.log(
            `Requesting posts for page: ${page}, filterBy: ${filterBy}`,
            JSON.stringify(payload)
          );
  
          // Make API request
          cy.request({
            method: 'POST',
            url: '/content/community/post/getall',
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
  
            // Check if the response is successful (200) or an error (e.g., 400)
            if (response.status === 200) {
              // Validate successful response
              expect(response.status).to.eq(200);
              expect(response.body).to.be.an('object');
              expect(response.body).to.have.property('success').that.equals(true);
  
              // Validate posts array
              expect(response.body).to.have.property('posts').that.is.an('array');
              expect(response.body.posts.length).to.be.at.most(10); // Up to 10 items as per limit
  
         
              cy.log(
                `Response for page: ${page}, filterBy: ${filterBy}`,
                JSON.stringify(response.body)
              );
            } else {
              // Handle error response (e.g., 400 or 404)
              expect(response.status).to.be.oneOf([400, 404]); // Adjust based on expected error codes
              expect(response.body).to.be.an('object');
              expect(response.body).to.have.property('success').that.equals(false);
              cy.log(
                `Error for page: ${page}, filterBy: ${filterBy}`,
                JSON.stringify(response.body)
              );
            }
          });
        });
      });
    });
  });