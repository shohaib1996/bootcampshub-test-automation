describe('Fetch My Notifications API Test', () => {
    let credentials;
  
    // Load credentials before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should successfully fetch my notifications and save to fixture', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Make API request
      cy.request({
        method: 'GET',
        url: '/notification/mynotifications',
        headers: {
          Authorization: authToken,
          Enrollment: enrollmentId,
          Organization: organizationId,
        },
        failOnStatusCode: false // Allow non-2xx status codes for error handling
      }).then((response) => {
        // Verify response time
        expect(response.duration).to.be.lessThan(2000);
  
        // Check if the response is successful (200)
        if (response.status === 200) {
          // Validate response structure
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('notifications').that.is.an('array');
  
          // Validate each notification in the notifications array
          response.body.notifications.forEach((notification) => {
           
            
            expect(notification).to.have.property('userFrom').that.is.an('object');

            expect(notification).to.have.property('opened').that.is.a('boolean');
            expect(notification).to.have.property('entityId').that.is.a('string');
            expect(notification).to.have.property('notificationType').that.is.a('string');
            expect(notification).to.have.property('text').that.is.a('string');
          });
  
          // Save notification details to myNotifications.json as a single object
          const notificationsData = {
            response: response.body
          };
  
          // Overwrite myNotifications.json with the new data
          cy.writeFile('cypress/fixtures/myNotifications.json', notificationsData);
  
          // Log response for debugging
          cy.log('Response:', JSON.stringify(response.body));
        } else {
          // Log error for debugging
          cy.log('Error:', JSON.stringify(response.body));
        }
      });
    });
  });