describe("Get Single User Document API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully fetch a single user document by ID", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/document/userdocument/get/68064581ff069200190ac18c",
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
        .that.equals("68064581ff069200190ac18c");
      expect(document).to.have.property("name").that.equals("Test Upload");
      expect(document).to.have.property("description").that.equals("");
      expect(document)
        .to.have.property("user")
        .that.equals("64ef676669eaf6370c11429c");
      expect(document)
        .to.have.property("branch")
        .that.equals("64fcb4e8944cf215d8d32f95");
      expect(document)
        .to.have.property("enrollment")
        .that.equals("6523d8d71eab265c60cf30ce");
      expect(document)
        .to.have.property("attachment")
        .that.is.an("array")
        .and.deep.equals([null]);
      expect(document).to.have.property("comments").that.is.an("array").and.is
        .empty;
      expect(document)
        .to.have.property("createdAt")
        .that.equals("2025-04-21T13:17:53.857Z");
      expect(document)
        .to.have.property("updatedAt")
        .that.equals("2025-04-21T13:17:53.857Z");

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
