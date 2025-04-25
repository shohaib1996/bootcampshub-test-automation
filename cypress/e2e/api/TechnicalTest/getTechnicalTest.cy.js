describe('My Assignments API Test', () => {
    let credentials;
  
    // Load fixture data before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully fetch my assignments for dynamic categories, statuses, and types', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Define dynamic field values
      const categories = ['task', 'assignment', 'question'];
      const statuses = ['pending', 'accepted', 'rejected'];
      const types = ['answered', 'notanswered'];
  
      // Iterate through all combinations of categories, statuses, and types
      categories.forEach((category) => {
        statuses.forEach((status) => {
          types.forEach((type) => {
            // Define payload with dynamic fields
            const payload = {
              page: 1,
              limit: 10,
              workshop: null,
              category: category,
              query: '',
              type: type,
              status: status
            };
  
            // Log the payload for debugging
            cy.log(
              `Requesting assignments for category: ${category}, status: ${status}, type: ${type}`,
              JSON.stringify(payload)
            );
  
            // Make API request
            cy.request({
              method: 'POST',
              url: '/assignment/myassignments',
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
                expect(response.body).to.have.property('assignments').that.is.an('array');
                expect(response.body.assignments.length).to.be.at.most(10); // Up to 10 items as per limit
  
                cy.log(
                  `Response for category: ${category}, status: ${status}, type: ${type}`,
                  JSON.stringify(response.body)
                );
              } else {
         
                cy.log(
                  `Error for category: ${category}, status: ${status}, type: ${type}`,
                  JSON.stringify(response.body)
                );
              }
            });
          });
        });
      });
    });
  });