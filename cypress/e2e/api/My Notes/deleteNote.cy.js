describe("Delete Note API", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should delete a note successfully", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "DELETE",
      url: "/content/note/delete/6812818cbdcf2a001a3a15fc",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.have.property("success").that.equals(true);
    });
  });
});
