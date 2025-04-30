describe("Shared Notes API", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should retrieve a specific shared note successfully", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/content/note/get/6810daf390751d0019fd284b",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      // Verify status code
      expect(response.status).to.eq(200);

      // Verify response structure
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("note").that.is.an("object");

      // Verify note details
      const note = response.body.note;
      expect(note).to.have.property("purpose").that.is.an("object");
      expect(note)
        .to.have.property("_id")
        .that.equals("6810daf390751d0019fd284b");
    });
  });
});
