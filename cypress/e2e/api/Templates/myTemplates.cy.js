describe("My Templates API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully fetch templates and categories", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/template/mytemplates",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      console.log(response);
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("templates").that.is.an("array");
      expect(response.body).to.have.property("categories").that.is.an("array");

      const templates = response.body.templates;
      expect(templates).to.have.length.at.least(0);

      templates.forEach((template) => {
        expect(template).to.have.property("_id").that.is.a("string");
        expect(template).to.have.property("title").that.is.a("string");
        expect(template).to.have.property("category").that.is.a("string");
        expect(template).to.have.property("createdBy").that.is.a("string");
        expect(template).to.have.property("organization").that.is.a("string");
        // expect(template).to.have.property("description").that.is.a("string");
        expect(template).to.have.property("attachments").that.is.an("array");
        expect(template).to.have.property("programs").that.is.an("array");
        expect(template).to.have.property("sessions").that.is.an("array");
        expect(template).to.have.property("users").that.is.an("array");
        expect(template).to.have.property("isActive").that.is.a("boolean");
        expect(template).to.have.property("branches").that.is.an("array");
        expect(template).to.have.property("discussions").that.is.an("array");
        expect(template)
          .to.have.property("createdAt")
          .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(template)
          .to.have.property("updatedAt")
          .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(template).to.have.property("__v").that.is.a("number");
      });

      const categories = response.body.categories;
      expect(categories).to.have.length.at.least(0);
      categories.forEach((category) => {
        expect(category).to.be.a("string");
      });

      if (templates.length > 0) {
        const firstTemplate = templates[0];
        expect(firstTemplate._id).to.eq("662a21525410ed0020dc6e11");
        expect(firstTemplate.title).to.eq("Test Template ");
        expect(firstTemplate.category).to.eq("test");
        expect(firstTemplate.createdBy).to.eq("64ef676669eaf6370c11429c");
        expect(firstTemplate.organization).to.eq("64fcb2e60d2f877aaccb3b26");
        expect(firstTemplate.description).to.eq(
          "This is test template\n\n1. one \n2. two\n3. three"
        );
        expect(firstTemplate.isActive).to.eq(true);
        expect(firstTemplate.attachments).to.deep.eq([
          "https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/document-sending/1715021780684-Screenshot_20.png",
        ]);
        expect(firstTemplate.programs).to.deep.eq([
          "64fcb957b0cf6e9ae43d126d",
          "6501f8b21c01cf0019303d0b",
          "6518fcfa8e86b35c04b6625d",
        ]);
        expect(firstTemplate.sessions).to.deep.eq([
          "64fcb5250879f342bcc00a7e",
          "65fa05454cb61000200f99a8",
        ]);
        expect(firstTemplate.users).to.deep.eq([
          "650a93e1f1155f7be0e24a96",
          "652a08f18dd0360019927459",
        ]);
        expect(firstTemplate.branches).to.deep.eq(["64fcb4e8944cf215d8d32f95"]);
        expect(firstTemplate.discussions).to.be.empty;
      }

      expect(categories).to.include.members([
        "Interview",
        "SQA",
        "SQA_API Testing",
        "Test",
        "Test-1",
        "test",
      ]);

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});

// pagination is not working
