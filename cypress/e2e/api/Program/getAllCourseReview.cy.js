describe('Get Course Review API Test', () => {
    let credentials;
  
    // Load fixture data before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully fetch course reviews with query parameters', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Define query parameters
      const queryParams = {
        fields: JSON.stringify(['categories', 'reviews']),
        category: 'ssss',
        page: 1,
        limit: 10
      };
  
      // Make API request
      cy.request({
        method: 'GET',
        url: '/course/review/get/6647be35e44f020019e06b65',
        headers: {
          Authorization: authToken,
          Enrollment: enrollmentId,
          Organization: organizationId,
        },
        qs: queryParams,
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
  
          // Validate reviews array
          expect(response.body).to.have.property('reviews').that.is.an('array');
          expect(response.body.reviews.length).to.be.at.most(10); 
  
      
          cy.log('Response:', JSON.stringify(response.body));
        } else {
          // Handle error response (e.g., 400 or 404)
          expect(response.status).to.be.oneOf([400, 404]); // Adjust based on expected error codes
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('success').that.equals(false);
          cy.log('Error:', JSON.stringify(response.body));
        }
      });
    });
  });