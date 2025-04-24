describe("User Documents API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully fetch user documents with pagination", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/document/userdocument/get?page=1&limit=10",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      //   console.log(response);
      expect(response.status).to.eq(201);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("documents").that.is.an("array");
      expect(response.body).to.have.property("count").that.is.a("number");

      const documents = response.body.documents;
      expect(documents).to.have.length.within(0, 10); // Allow variable length up to limit=10

      documents.forEach((document) => {
        expect(document).to.have.property("_id").that.is.a("string");
        expect(document).to.have.property("name").that.is.a("string");
        expect(document).to.have.property("description").that.is.a("string");
        expect(document)
          .to.have.property("user")
          .that.equals("64ef676669eaf6370c11429c");
        expect(document)
          .to.have.property("branch")
          .that.equals("64fcb4e8944cf215d8d32f95");
        expect(document)
          .to.have.property("enrollment")
          .that.equals("6523d8d71eab265c60cf30ce");
        expect(document).to.have.property("attachment").that.is.an("array");
        expect(document).to.have.property("comments").that.is.an("array").and.is
          .empty;
        expect(document)
          .to.have.property("createdAt")
          .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(document)
          .to.have.property("updatedAt")
          .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });

      if (documents.length > 0) {
        const firstDocument = documents[0];
        expect(firstDocument._id).to.eq("68064581ff069200190ac18c");
        expect(firstDocument.name).to.eq("Test Upload");
        expect(firstDocument.description).to.eq("");
        expect(firstDocument.attachment).to.deep.eq([null]);
      }

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
