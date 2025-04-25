describe('Get Program Info API Test', () => {
    let credentials;
  
    // Load fixture data before each test (if needed for headers)
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully fetch enrolled program info', () => {
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      cy.request({
        method: 'GET',
        url: '/enrollment/myprogram',
        headers: {
          Authorization: authToken,
          Enrollment: enrollmentId,
          Organization: organizationId,
        }
      }).then((response) => {
        // ✅ Status and speed checks
        expect(response.status).to.eq(200);
        expect(response.duration).to.be.lessThan(2000);
  
        // ✅ Body structure
        const body = response.body;
        expect(body).to.have.property('success', true);
        expect(body).to.have.property('program').that.is.an('object');
        expect(body.program).to.have.property('meta').that.is.a('object');
  
        // 🐛 Log response (for debugging only)
        cy.log('Program Info:', JSON.stringify(body));
      });
    });
  });
  