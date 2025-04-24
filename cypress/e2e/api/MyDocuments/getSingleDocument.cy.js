describe("Get Single Document API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully fetch a single document by ID", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/document/get/6805fd7dff069200190abd46",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("document").that.is.an("object");

      const document = response.body.document;
      expect(document)
        .to.have.property("_id")
        .that.equals("6805fd7dff069200190abd46");
      expect(document)
        .to.have.property("name")
        .that.equals("sdfsdfsdfsdfsdf sdf");
      expect(document).to.have.property("description").that.is.a("string");
      expect(document)
        .to.have.property("createdBy")
        .that.equals("64ef676669eaf6370c11429c");
      expect(document)
        .to.have.property("organization")
        .that.equals("64fcb2e60d2f877aaccb3b26");
      expect(document).to.have.property("priority").that.equals("low");
      expect(document).to.have.property("category").that.equals("document");
      expect(document)
        .to.have.property("branches")
        .that.is.an("array")
        .and.deep.equals(["64fcb4e8944cf215d8d32f95"]);
      expect(document).to.have.property("attachment").that.is.an("array").and.is
        .empty;
      expect(document).to.have.property("user").that.is.an("array").and.is
        .empty;
      expect(document).to.have.property("comments").that.is.an("array").and.is
        .empty;
      expect(document)
        .to.have.property("createdAt")
        .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(document)
        .to.have.property("updatedAt")
        .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

      // Log response for debugging
      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
