describe("Get My Notes API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully fetch all notes", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/content/note/mynotes",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("notes").that.is.an("array");
      expect(response.body).to.have.property("pagination").that.is.an("object");

      const pagination = response.body.pagination;
      expect(pagination).to.have.property("total").that.equals(8);
      expect(pagination).to.have.property("currentPage").that.equals(1);
      expect(pagination).to.have.property("totalPages").that.equals(1);
      expect(pagination).to.have.property("hasNext").that.equals(false);
      expect(pagination).to.have.property("hasPrev").that.equals(false);
      expect(pagination).to.have.property("limit").that.equals(30);

      const notes = response.body.notes;
      expect(notes).to.have.length.greaterThan(0);

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
