describe('Dashboard Portal Community, Family, and Review API Test', () => {
    let credentials;
  
    // Load fixture data before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully post to dashboard portal for community, family, and review', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Define payload
      const payload = {
        community: {},
        familyMember: {},
        review: {},
      };
  
      // Make API request
      cy.request({
        method: 'POST',
        url: '/dashboard/portal',
        headers: {
          Authorization: authToken,
          Enrollment: enrollmentId,
          Organization: organizationId,
        },
        body: payload,
      }).then((response) => {
        // Verify response status
        expect(response.status).to.eq(200);
  
        // Basic response structure validations
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('success').that.equals(true);
        expect(response.body).to.have.property('data').that.is.an('object');
  
        // Validate data.review structure
        expect(response.body.data).to.have.property('review').that.is.an('object');
        expect(response.body.data.review).to.have.property('success').that.equals(true);
        expect(response.body.data.review).to.have.property('results').that.is.an('object');
     
  
        // Validate data.community structure
        expect(response.body.data).to.have.property('community').that.is.an('object');
        expect(response.body.data.community).to.have.property('success').that.equals(true);
        expect(response.body.data.community).to.have.property('results').that.is.an('object');
   
  
        // Validate data.familyMember structure
        expect(response.body.data).to.have.property('familyMember').that.is.an('object');
        expect(response.body.data.familyMember).to.have.property('success').that.equals(true);
        expect(response.body.data.familyMember).to.have.property('results').that.is.an('object');
    
        // Log response for debugging (remove in production)
        cy.log('Response:', JSON.stringify(response.body));
      });
    });
  });