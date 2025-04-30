describe("Change Password API", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should change user password successfully", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    const payload = {
      currentPassword: "Ashraful186@@",
      newPassword: "Ashraful186@@",
      confirmPassword: "Ashraful186@@",
    };

    cy.request({
      method: "PATCH",
      url: "/user/changepassword",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
        "Content-Type": "application/json",
      },
      body: payload,
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body)
        .to.have.property("message")
        .that.equals("password changed successfuly");
    });
  });
});
