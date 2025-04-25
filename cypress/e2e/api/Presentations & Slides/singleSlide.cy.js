describe("Get Single Slide API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully fetch a single slide by ID", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/slide/single/67f815615172bb001992802b",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("slide").that.is.an("object");

      const slide = response.body.slide;
      expect(slide)
        .to.have.property("_id")
        .that.equals("67f815615172bb001992802b");
      expect(slide).to.have.property("title").that.equals("asfaf -copy");
      expect(slide).to.have.property("programs").that.is.an("array").and.is
        .empty;
      expect(slide).to.have.property("sessions").that.is.an("array").and.is
        .empty;
      expect(slide)
        .to.have.property("branches")
        .that.is.an("array")
        .and.deep.equals(["64fcb4e8944cf215d8d32f95"]);
      expect(slide).to.have.property("slides").that.is.an("array");
      expect(slide)
        .to.have.property("organization")
        .that.equals("64fcb2e60d2f877aaccb3b26");
      expect(slide)
        .to.have.property("createdAt")
        .that.equals("2025-04-10T19:00:49.826Z");
      expect(slide)
        .to.have.property("updatedAt")
        .that.equals("2025-04-10T19:00:49.826Z");
      expect(slide).to.have.property("__v").that.equals(0);

      const nestedSlides = slide.slides;
      expect(nestedSlides).to.have.length(1);
      expect(nestedSlides[0])
        .to.have.property("_id")
        .that.equals("67dea030e4e7290019e80da5");
      expect(nestedSlides[0]).to.have.property("content").that.equals("");
      expect(nestedSlides[0]).to.have.property("title").that.equals("");

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
