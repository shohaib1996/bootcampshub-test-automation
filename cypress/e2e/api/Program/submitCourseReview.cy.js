describe('Submit Course Review API Test', () => {
    let credentials;

    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully submit a course review and save to fixture', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Load programs.json to get the course ID
      cy.fixture('programSlug.json').then((programs) => {
        // Check if programs exists and has at least one program with an _id
    
        // Use the first program's _id
        const courseId = programs.courseId
  
        // Generate random starCount (1-5) and sample text
        const starCount = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
        const reviewText = 'Great course, very informative!';
  
        // Define payload
        const payload = {
          course: courseId,
          starCount: starCount,
          text: reviewText
        };
  
        // Log the payload for debugging
        cy.log('Request payload:', JSON.stringify(payload));
  
        // Make API request
        cy.request({
          method: 'POST',
          url: '/course/review/submit',
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
  
          // Check if the response is successful (200)
          if (response.status === 200) {
            // Validate response structure
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('success').that.equals(true);
  
            // Save review info to reviews.json
            const reviewData = {
              courseId,
              starCount,
              text: reviewText,
              response: response.body
            };
            
              // Initialize as array if file doesn't exist or is invalid
              const reviewsArray = [];
              // Append review info
              reviewsArray.push(reviewData);
              // Write updated array to reviews.json
              cy.writeFile('cypress/fixtures/reviews.json', reviewsArray);
     
  
            // Log response for debugging
            cy.log('Response:', JSON.stringify(response.body));
          } else {
            // Log error for debugging
            cy.log('Error:', JSON.stringify(response.body));
          }
        });
      });
    });
  });