describe("Get Single Lab Content API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully fetch a single lab content by ID", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/content/singlecontent/67ff6b8fff069200190a97a7",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("comments").that.is.an("array").and
        .is.empty;
      expect(response.body).to.have.property("content").that.is.an("object");

      const content = response.body.content;
      expect(content)
        .to.have.property("_id")
        .that.equals("67ff6b8fff069200190a97a7");
      expect(content).to.have.property("category").that.equals("other");
      expect(content).to.have.property("tags").that.is.an("array").and.is.empty;
      expect(content)
        .to.have.property("programs")
        .that.is.an("array")
        .and.deep.equals([
          "6518fcfa8e86b35c04b6625d",
          "64fcb957b0cf6e9ae43d126d",
        ]);
      expect(content)
        .to.have.property("sessions")
        .that.is.an("array")
        .and.deep.equals(["66491689e44f020019e08e4f"]);
      expect(content).to.have.property("courses").that.is.an("array").and.is
        .empty;
      expect(content).to.have.property("dependencies").that.is.an("array").and
        .is.empty;
      expect(content).to.have.property("attachments").that.is.an("array").and.is
        .empty;
      expect(content).to.have.property("groups").that.is.an("array").and.is
        .empty;
      expect(content).to.have.property("isFree").that.equals(false);
      expect(content).to.have.property("isPublished").that.equals(true);
      expect(content)
        .to.have.property("branches")
        .that.is.an("array")
        .and.deep.equals(["64fcb4e8944cf215d8d32f95"]);
      expect(content)
        .to.have.property("name")
        .that.equals("Escalope de Veau lul");
      expect(content)
        .to.have.property("description")
        .that.equals(
          "Hello this is Shimul sending this document from branch to test"
        );
      expect(content)
        .to.have.property("slide")
        .that.equals("65637b0853757b8334607b96");
      expect(content)
        .to.have.property("createdBy")
        .that.equals("64ef676669eaf6370c11429c");
      expect(content)
        .to.have.property("thumbnail")
        .that.equals(
          "https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/document-sending/1744792454842-desktop-402213.jpg"
        );
      expect(content)
        .to.have.property("organization")
        .that.equals("64fcb2e60d2f877aaccb3b26");
      expect(content)
        .to.have.property("createdAt")
        .that.equals("2025-04-16T08:34:23.567Z");
      expect(content)
        .to.have.property("updatedAt")
        .that.equals("2025-04-18T11:08:07.063Z");
      expect(content).to.have.property("__v").that.equals(0);

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
