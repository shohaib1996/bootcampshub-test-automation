describe('My Progress API Test', () => {
    let credentials;
  
    // Load fixture data before each test
    beforeEach(() => {
      cy.fixture('loginCredential.json').then((data) => {
        credentials = data;
      });
    });
  
    it('should fetch my progress data successfully', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;
  
      // Make API request
      cy.request({
        method: 'GET',
        url: '/progress/myprogress',
        headers: {
          Authorization: authToken,
          Enrollment: enrollmentId,
          Organization: organizationId,
        },
      }).then((response) => {
        // Verify response status
        expect(response.status).to.eq(200);
  
        // Verify response structure
        expect(response.body).to.have.property('success').that.equals(true);
        expect(response.body).to.have.property('metrics');
        expect(response.body).to.have.property('results').that.is.an('array');
        expect(response.body).to.have.property('_id');
        expect(response.body).to.have.property('enrollment').that.equals(enrollmentId);
        expect(response.body).to.have.property('user');
        expect(response.body).to.have.property('createdAt');
        expect(response.body).to.have.property('updatedAt');
  
        // Verify metrics structure
        const metrics = response.body.metrics;
        expect(metrics).to.have.property('totalMark').that.is.a('number');
        expect(metrics).to.have.property('totalObtainedMark').that.is.a('number');
        expect(metrics).to.have.property('overallPercentageAllItems').that.is.a('number');
  
        // Verify results array structure
        response.body.results.forEach((result) => {
          expect(result).to.have.property('_id');
          expect(result).to.have.property('id');
          expect(result).to.have.property('title');
          expect(result).to.have.property('limit').that.is.a('number');
          expect(result).to.have.property('count').that.is.a('number');
          expect(result).to.have.property('additionalData').that.is.an('object');
  
          // Verify specific result items
          if (result.id === 'messages') {
            expect(result.title).to.eq('My Messages edited');
            expect(result.limit).to.eq(281);
            expect(result.count).to.eq(437);
            expect(result.additionalData).to.include.keys(
              'totalMessage',
              'totalChat',
              'totalUnreadChat',
              'totalReadChat',
              'totalPinnedMessages',
              'totalUnreadCrowd',
              'totalUnreadDirect'
            );
          }
  
          if (result.id === 'showAndTell') {
            expect(result.title).to.eq('Show And Tell');
            expect(result.limit).to.eq(15);
            expect(result.count).to.eq(3);
            expect(result.additionalData).to.include.keys(
              'totalItems',
              'acceptedItems',
              'pendingItems',
              'rejectedItems'
            );
          }
  
          if (result.id === 'events') {
            expect(result.title).to.eq('My Calender Events');
            expect(result.limit).to.eq(10);
            expect(result.count).to.eq(281);
            expect(result.additionalData).to.include.keys(
              'total',
              'finished',
              'current',
              'upcoming',
              'recurrent'
            );
          }
        });
      });
    });
  });