describe('First Program API Test', () => {
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
  
    it('should successfully fetch first program categories and save to file', () => {
      // Destructure credentials
      const {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      } = credentials;

      const { programSlug } = programData;
  
      // Make API request
      cy.request({
        method: 'GET',
        url: `/course/contentv2/${programSlug}`,
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
        expect(response.body).to.have.property('category').that.is.an('object');
  
        // Validate category object
        const category = response.body.category;
        expect(category).to.have.property('_id').that.is.a('string');
        expect(category).to.have.property('course').that.is.a('string');
        expect(category).to.have.property('branch').that.is.a('string');
        expect(category).to.have.property('categories').that.is.an('array');
  
        // Validate categories array dynamically
        const categories = category.categories;
        categories.forEach((cat, index) => {
          // Validate required fields
          expect(cat).to.have.property('isActive').that.is.a('boolean');
          expect(cat).to.have.property('_id').that.is.a('string');
          expect(cat).to.have.property('name').that.is.a('string');
  
          // Validate optional slug field
          if (cat.slug !== undefined) {
            expect(cat).to.have.property('slug').that.is.a('string');
          } 
  
          // Log category details for debugging (optional)
          cy.log(`Category ${index + 1}:`, JSON.stringify(cat));
        });
  
        // Write categories array to programCategory.json
        cy.writeFile('cypress/fixtures/programCategory.json', categories, { encoding: 'utf8' });
  
        // Log response for debugging (remove in production)
        cy.log('Response:', JSON.stringify(response.body));
      });
    });
  });