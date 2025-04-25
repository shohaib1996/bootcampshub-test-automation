describe('My Course Review API Test', () => {
  let credentials;

  // Load fixture data before each test
  beforeEach(() => {
    cy.fixture('loginCredential.json').then((data) => {
      credentials = data;
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
      url: '/course/review/myreview/64fcb957b0cf6e9ae43d126d',
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