describe('Single Chapter API Test', () => {
    let credentials;
    let programData;
  
    // Load fixture data before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
      cy.fixture('programSlug.json').then((data) => {
        programData = data;
      });
    });
  
    it('should successfully fetch a single chapter', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;

      const {chapterId} = programData;
  
      // Make API request
      cy.request({
        method: 'GET',
        url: `/course/chapterv2/get-single/chapter/${chapterId}`,
        headers: {
          Authorization: authToken,
          Enrollment: enrollmentId,
          Organization: organizationId,
        },
      }).then((response) => {
        // Verify response time
        expect(response.duration).to.be.lessThan(2000);
        expect(response.status).to.eq(200);

        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('success').that.equals(true);
        expect(response.body).to.have.property('chapter').that.is.an('object');
        
        // Log response for debugging (remove in production)
        cy.log('Response:', JSON.stringify(response.body));
      });
    });
  });