describe("Add User Document API Test", () => {
  let credentials;
  let payload;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
    cy.fixture("uploadDocumentPayload.json").then((data) => {
      payload = data;
    });
  });

  it("should successfully add a user document", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "POST",
      url: "/document/userdocument/add",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
      body: payload,
    }).then((response) => {
      console.log(response);
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("document").that.is.an("object");

      const document = response.body.document;
      expect(document).to.have.property("_id").that.is.a("string");
      expect(document).to.have.property("name").that.equals(payload.name);
      expect(document)
        .to.have.property("description")
        .that.equals(payload.description);
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
        .and.deep.equals(payload.attachment);
      expect(document).to.have.property("comments").that.is.an("array").and.is
        .empty;
      expect(document)
        .to.have.property("createdAt")
        .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(document)
        .to.have.property("updatedAt")
        .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
