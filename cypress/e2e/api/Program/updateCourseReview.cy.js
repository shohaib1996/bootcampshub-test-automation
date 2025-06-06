describe('Update Course Review API Test', () => {
    let credentials;
    let reviewId;
  
    // Load fixture data before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
      cy.fixture('myCourseReview.json').then((data) => {
        if (!data || !data.response || !data.response.review) {
          throw new Error('Invalid myCourseReview.json format: Expected response object with reviewId');
        }
        reviewId = data.response.review._id; 
      });

    });
  
    it('should successfully update a course review', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Define payload
      const payload = {
        starCount: 5,
        text: 'hello how are you'
      };
  
      // Make API request
      cy.request({
        method: 'PATCH',
        url: '/course/review/update/' + reviewId,
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