describe("Get Single Templates API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully fetch a single template by ID", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/template/get/6640b4b4a009f3001952d751",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("template").that.is.an("object");

      const template = response.body.template;
      expect(template)
        .to.have.property("_id")
        .that.equals("6640b4b4a009f3001952d751");
      expect(template)
        .to.have.property("title")
        .that.equals('"Finding Inner Peace Through Meditation"');
      expect(template).to.have.property("category").that.equals("test");
      expect(template)
        .to.have.property("createdBy")
        .that.equals("64ef676669eaf6370c11429c");
      expect(template)
        .to.have.property("organization")
        .that.equals("64fcb2e60d2f877aaccb3b26");
      expect(template).to.have.property("description").that.equals("desc");
      expect(template).to.have.property("isActive").that.equals(true);
      expect(template)
        .to.have.property("attachments")
        .that.is.an("array")
        .and.deep.equals([
          "https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/document-sending/1715516564468-dummy.pdf",
          "https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/document-sending/1715516579042-1715445422961-Dashboard_mockup.png",
        ]);
      expect(template).to.have.property("programs").that.is.an("array");
      expect(template)
        .to.have.property("sessions")
        .that.is.an("array")
        .and.deep.equals(["64fcb5250879f342bcc00a7e"]);
      expect(template).to.have.property("users").that.is.an("array");
      expect(template)
        .to.have.property("branches")
        .that.is.an("array")
        .and.deep.equals(["64fcb4e8944cf215d8d32f95"]);
      expect(template).to.have.property("discussions").that.is.an("array").and
        .is.empty;
      expect(template)
        .to.have.property("createdAt")
        .that.equals("2024-05-12T12:23:16.211Z");
      expect(template)
        .to.have.property("updatedAt")
        .that.equals("2024-05-12T12:23:16.211Z");
      expect(template).to.have.property("__v").that.equals(0);

      const programs = template.programs;
      expect(programs).to.have.length(1);
      expect(programs[0])
        .to.have.property("_id")
        .that.equals("6501f8b21c01cf0019303d0b");
      expect(programs[0])
        .to.have.property("title")
        .that.equals("MERN Full-Stack Software test");

      const users = template.users;
      expect(users).to.have.length(2);
      expect(users[0])
        .to.have.property("_id")
        .that.equals("64ef676669eaf6370c11429c");
      expect(users[0])
        .to.have.property("email")
        .that.equals("186mdshimul@gmail.com");
      expect(users[0]).to.have.property("firstName").that.equals("Ashraful");
      expect(users[0]).to.have.property("lastName").that.equals("Shimul");
      expect(users[0])
        .to.have.property("fullName")
        .that.equals("Ashraful Shimul");
      expect(users[0])
        .to.have.property("profilePicture")
        .that.equals(
          "https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/1719380678611-Screenshot-2024"
        );
      expect(users[1])
        .to.have.property("_id")
        .that.equals("650a93e1f1155f7be0e24a96");
      expect(users[1])
        .to.have.property("email")
        .that.equals("shimul1866@gmail.com");
      expect(users[1]).to.have.property("firstName").that.equals("md");
      expect(users[1]).to.have.property("lastName").that.equals("shimul");
      expect(users[1]).to.have.property("fullName").that.equals("md shimul");
      expect(users[1]).to.have.property("profilePicture").that.equals("");

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
