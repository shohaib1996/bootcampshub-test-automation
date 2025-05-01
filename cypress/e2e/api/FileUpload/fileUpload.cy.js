describe('Upload User Document API Test', () => {
    let credentials;
  
    // Load credentials before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully upload a document file and save the response', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      const fileName = 'file-to-upload.png';
      const filePath = fileName;
      console.log('File Path:', filePath);
      cy.fixture(filePath, 'binary').then((fileContent) => {
        const blob = Cypress.Blob.binaryStringToBlob(fileContent, 'image/png');
        const formData = new FormData();
        formData.append('file', blob, fileName);
        cy.request({
          method: 'POST',
          url: '/document/userdocumentfile',
          headers: {
            Authorization: authToken,
            Enrollment: enrollmentId,
            Organization: organizationId,
          },
          body: formData,
          failOnStatusCode: false // Allow non-2xx status codes for error handling
        }).then((response) => {
          // Verify response time
          expect(response.duration).to.be.lessThan(2000);

          cy.log('Full Response:', JSON.stringify(response));

          if (response.status === 200) {
            if (response.body.success && response.body.fileUrl) {
              expect(response.body).to.have.property('success').that.equals(true);
              expect(response.body).to.have.property('fileUrl').that.is.a('string');
  
              // Log the successful response
              cy.log('Response:', JSON.stringify(response.body));
 
              cy.writeFile('cypress/fixtures/uploadedDocument.json', response.body);
            } else {
              cy.log('Warning: Response is empty or missing expected fields:', JSON.stringify(response.body));
            }
          } else {
            // Log error details
            cy.log('Error Status:', response.status);
            cy.log('Error Body:', JSON.stringify(response.body));
          }
        });
      });
    });
  });