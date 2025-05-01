describe('My Course Review API Test', () => {
  let credentials;
  let courseId;

  // Load fixture data before each test
  beforeEach(() => {
    cy.fixture('loginCredential.json').then((data) => {
      credentials = data;
    });
    cy.fixture('myProgram.json').then((data) => {
      // Validate myProgram.json structure
      if (!data || !data.program || !data.program._id) {
        throw new Error('Invalid myProgram.json format: Expected program object with _id');
      }
      courseId = data.program._id; // Extract the course ID
    });
  });

  it('should successfully fetch my review for a specific course', () => {
    // Destructure credentials
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    // Make API request
    cy.request({
      method: 'GET',
      url: `/course/review/myreview/${courseId}`,
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
      failOnStatusCode: false // Allow non-2xx status codes for error handling
    }).then((response) => {
      // Verify response time
      expect(response.duration).to.be.lessThan(2000);

      // Check if the response is successful (200) or an error (e.g., 400 or 404)
      if (response.status === 200) {
        // Validate successful response
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('success').that.equals(true);

        // Log response for debugging
        cy.log('Response:', JSON.stringify(response.body));
        const reviewData = {
          response: response.body
        };

        cy.writeFile('cypress/fixtures/myCourseReview.json', reviewData);

      } else {
        // Handle error response (e.g., 400 or 404)
        expect(response.status).to.be.oneOf([400, 404]);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('success').that.equals(false);

        // Log error for debugging
        cy.log('Error:', JSON.stringify(response.body));
      }
    });
  });
});