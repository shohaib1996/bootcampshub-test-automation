describe("Get Content Details API", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should retrieve content details successfully", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/content/getcontent/67faa0a18751a4001986ff5d",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      // Verify response structure
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("content").that.is.an("object");

      // Verify content details
      const content = response.body.content;
      expect(content)
        .to.have.property("_id")
        .that.equals("67faa0a18751a4001986ff5d");
      expect(content).to.have.property("category").that.equals("other");
      expect(content)
        .to.have.property("name")
        .that.equals("Getting Started with Next.js: A Comprehensive Guide");

      // Verify createdBy
      expect(content).to.have.property("createdBy").that.is.an("object");
      expect(content.createdBy)
        .to.have.property("_id")
        .that.equals("64ef676669eaf6370c11429c");
      expect(content.createdBy)
        .to.have.property("firstName")
        .that.equals("Ashraful");
      expect(content.createdBy)
        .to.have.property("lastName")
        .that.equals("Shimul");
      expect(content.createdBy)
        .to.have.property("fullName")
        .that.equals("Ashraful Shimul");
    });
  });
});
