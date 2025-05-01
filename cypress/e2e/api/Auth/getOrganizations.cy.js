describe("Get User Organizations API", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should retrieve user organizations successfully", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/organization/user-organizations",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log(response);
      expect(response.status).to.eq(200);

      // Verify response structure
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body)
        .to.have.property("organizations")
        .that.is.an("array");

      // Verify organizations array
      const organizations = response.body.organizations;
      expect(organizations).to.have.length(3);
    });
  });
});
