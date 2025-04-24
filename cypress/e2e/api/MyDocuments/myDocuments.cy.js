describe("My Documents API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully fetch my documents", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/document/mydocuments?page=1&limit=10",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an("object");

      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("documents").that.is.an("array");
      expect(response.body).to.have.property("pagination").that.is.an("object");

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
