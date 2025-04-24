describe("Lab Content API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully fetch lab contents with pagination", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/content/labcontent?page=1&limit=10",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("contents").that.is.an("array");
      expect(response.body).to.have.property("count").that.is.a("number");

      const contents = response.body.contents;
      expect(contents).to.have.length.within(0, 10);

      contents.forEach((content) => {
        expect(content).to.have.property("_id").that.is.a("string");
        expect(content).to.have.property("groups").that.is.an("array");
        expect(content).to.have.property("isFree").that.is.a("boolean");
        expect(content).to.have.property("name").that.is.a("string");
        expect(content).to.have.property("thumbnail").that.is.a("string");
        expect(content)
          .to.have.property("createdAt")
          .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(content).to.have.property("isLocked").that.is.a("boolean");
      });

      if (contents.length > 0) {
        const firstContent = contents[0];
        expect(firstContent._id).to.eq("6802337dff069200190ab216");
        expect(firstContent.name).to.eq("MD Mizanur Rahman ");
        expect(firstContent.isFree).to.eq(false);
        expect(firstContent.thumbnail).to.eq("");
        expect(firstContent.groups).to.deep.eq([]);
        expect(firstContent.isLocked).to.eq(false);
      }

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
