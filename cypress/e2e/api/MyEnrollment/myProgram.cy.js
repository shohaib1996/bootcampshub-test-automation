describe('Verify User API Test', () => {
    let credentials;
  
    // Load credentials before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully verify user, save enrollments, and save programs to fixtures', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Define payload
      const payload = {
        organization: '64fcb2e60d2f877aaccb3b26'
      };
  
      // Log the payload for debugging
      cy.log('Request payload:', JSON.stringify(payload));
  
      // Make API request
      cy.request({
        method: 'POST',
        url: '/user/verify',
        headers: {
          Authorization: authToken,
          Enrollment: enrollmentId,
          Organization: organizationId,
        },
        body: payload,
        failOnStatusCode: false // Allow non-2xx status codes for error handling
      }).then((response) => {
        // Verify response time
        expect(response.duration).to.be.lessThan(10000);
  
        // Check if the response is successful (200)
        if (response.status === 200) {
          // Validate response structure
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('enrollments').that.is.an('array');
  
     
          const enrollmentsData = response.body.enrollments;
          cy.writeFile('cypress/fixtures/enrollments.json', enrollmentsData);

          const programsData = response.body.enrollments.map((enrollment) => enrollment.program);
  
      
            const programsArray =  [];

            programsArray.push(...programsData);

            cy.writeFile('cypress/fixtures/myPrograms.json', programsArray);

          // Log response for debugging
          cy.log('Response:', JSON.stringify(response.body));
        } else {
          // Log error for debugging
          cy.log('Error:', JSON.stringify(response.body));
        }
      });
    });
  });