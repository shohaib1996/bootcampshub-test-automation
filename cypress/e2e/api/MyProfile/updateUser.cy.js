describe("Update User API", () => {
  let credentials;
  let userPayload;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
    cy.fixture("userPayload.json").then((data) => {
      userPayload = data;
    });
  });

  it("should update user profile successfully", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "PATCH",
      url: "/user/updateuser",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
        "Content-Type": "application/json",
      },
      body: userPayload,
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("user").that.is.an("object");
      expect(response.body)
        .to.have.property("message")
        .that.equals("Image updated successfully");

      // Verify user details
      const user = response.body.user;
      expect(user).to.have.property("phone").that.equals("1234567890");
      expect(user)
        .to.have.property("email")
        .that.equals("186mdshimul@gmail.com");
      expect(user).to.have.property("firstName").that.equals("Ashraful");
      expect(user).to.have.property("lastName").that.equals("Shimul");
      expect(user).to.have.property("fullName").that.equals("Ashraful Shimul");
      expect(user)
        .to.have.property("about")
        .that.equals("I am Ashraful Islam ");
      expect(user).to.have.property("gender").that.equals("male");
      expect(user)
        .to.have.property("_id")
        .that.equals("64ef676669eaf6370c11429c");
      expect(user).to.have.property("personalData").that.is.an("object");
      expect(user.personalData.address)
        .to.have.property("street")
        .that.equals("   Princeton   ");
      expect(user.personalData.address)
        .to.have.property("city")
        .that.equals("Cumilla    ");
      expect(user.personalData.address)
        .to.have.property("state")
        .that.equals("ny");
      expect(user.personalData.address)
        .to.have.property("country")
        .that.equals("bd");
      expect(user.personalData.socialMedia)
        .to.have.property("facebook")
        .that.equals("https://www.facebook.com/profile.php?id=100027585996757");
      expect(user.personalData.socialMedia)
        .to.have.property("linkedin")
        .that.equals(
          "https://www.linkedin.com/in/mahfuzur-rahman-shabbir-0496752a4/"
        );
      expect(user.personalData.socialMedia)
        .to.have.property("instagram")
        .that.equals("https://www.instagram.com");
      expect(user.personalData.socialMedia)
        .to.have.property("github")
        .that.equals("https://github.com/mahfuzrahman99");
      expect(user)
        .to.have.property("createdAt")
        .that.equals("2023-08-30T15:59:34.948Z");
      expect(user).to.have.property("updatedAt").that.is.a("string");
      expect(user).to.have.property("__v").that.equals(0);
    });
  });
});
