describe('Add Transaction API Test', () => {
    let credentials;
  
    // Load fixture data before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully add a transaction', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Define payload
      const payload = {
        method: 'paypal',
        amount: 10,
        attachment: 'https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/any-document/1745434700843-image_5-removebg-preview-2.png',
        note: 'asdf',
        date: '2025-04-23T18:34:54.564Z',
      };
  
      // Make API request
      cy.request({
        method: 'POST',
        url: '/transaction/addbyuser',
        headers: {
          Authorization: authToken,
          Enrollment: enrollmentId,
          Organization: organizationId,
        },
        body: payload,
      }).then((response) => {
        // Verify response time
        expect(response.duration).to.be.lessThan(2000);
  
        // Verify response status
        expect(response.status).to.eq(200); // POST typically returns 201 for resource creation
  
        // Basic response structure validations
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('success').that.equals(true);
        expect(response.body).to.have.property('transaction').that.is.an('object');

        // Log response for debugging (remove in production)
        cy.log('Response:', JSON.stringify(response.body));
      });
    });
  });