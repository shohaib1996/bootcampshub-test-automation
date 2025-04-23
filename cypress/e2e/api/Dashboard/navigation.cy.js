describe('My Navigations API Test', () => {
    let credentials;
  
    // Load fixture data before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully fetch my navigations', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Make API request
      cy.request({
        method: 'GET',
        url: '/navigation/mynavigations',
        headers: {
          Authorization: authToken,
          Enrollment: enrollmentId,
          Organization: organizationId,
        },
      }).then((response) => {
        // Verify response time
        expect(response.duration).to.be.lessThan(2000);
  
        // Verify response status
        expect(response.status).to.eq(200);
  
        // Basic response structure validations
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('success').that.equals(true);
        expect(response.body).to.have.property('navigation').that.is.an('object');
  
        cy.log('Response:', JSON.stringify(response.body));
      });
    });
  });