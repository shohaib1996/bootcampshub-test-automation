describe("Filter Users API", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should filter users successfully", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    const payload = {
      query: "",
      global: true,
    };

    cy.request({
      method: "POST",
      url: "/user/filter",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
      body: payload,
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("users").that.is.an("array");

      const users = response.body.users;
      // Verify first user
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
      expect(users[0]).to.have.property("phone").that.equals("1234567890");
      expect(users[0])
        .to.have.property("profilePicture")
        .that.equals(
          "https://ts4uportal-all-files-upload.nyc3.digitaloceanspaces.com/1746130633064-sample.jpg"
        );
    });
  });
});
