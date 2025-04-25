describe('My Diagrams API Test', () => {
    let credentials;
  
    // Load fixture data before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully fetch my diagrams with dynamic page and limit', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Define dynamic parameter values
      const pages = [1, 2, 3];
      const limits = [5, 10, 20];
  
      // Iterate through all combinations of page and limit
      pages.forEach((page) => {
        limits.forEach((limit) => {
          // Construct URL with dynamic page and limit
          const url = `/diagram/mydiagrams?page=${page}&limit=${limit}`;
  
          // Log the URL for debugging
          cy.log(`Requesting diagrams for page: ${page}, limit: ${limit}`, url);
  
          // Make API request
          cy.request({
            method: 'GET',
            url: url,
            headers: {
              Authorization: authToken,
              Enrollment: enrollmentId,
              Organization: organizationId,
            },
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
              expect(response.body).to.have.property('diagrams').that.is.an('array');
              expect(response.body.diagrams.length).to.be.at.most(limit); // Up to 'limit' items
  

              cy.log(
                `Response for page: ${page}, limit: ${limit}`,
                JSON.stringify(response.body)
              );
            } else {
              // Handle error response (e.g., 400 or 404)
              expect(response.status).to.be.oneOf([400, 404]); // Adjust based on expected error codes
              expect(response.body).to.be.an('object');
              expect(response.body).to.have.property('success').that.equals(false);
              cy.log(
                `Error for page: ${page}, limit: ${limit}`,
                JSON.stringify(response.body)
              );
            }
          });
        });
      });
    });
  });