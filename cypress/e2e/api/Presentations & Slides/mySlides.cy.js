describe("My Slides API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully fetch slides with pagination", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/slide/myslides?page=1&limit=10",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("slides").that.is.an("array");
      expect(response.body).to.have.property("count").that.is.a("number");

      const slides = response.body.slides;
      expect(slides).to.have.length.within(0, 10);

      slides.forEach((slide) => {
        expect(slide).to.have.property("_id").that.is.a("string");
        expect(slide).to.have.property("title").that.is.a("string");
        expect(slide).to.have.property("slides").that.is.an("array");
        expect(slide)
          .to.have.property("createdAt")
          .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(slide)
          .to.have.property("updatedAt")
          .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

        slide.slides.forEach((nestedSlide) => {
          expect(nestedSlide).to.have.property("_id").that.is.a("string");
          expect(nestedSlide).to.have.property("content").that.is.a("string");
          expect(nestedSlide).to.have.property("title").that.is.a("string");
        });
      });

      if (slides.length > 0) {
        const firstSlide = slides[0];
        expect(firstSlide._id).to.eq("67f815615172bb001992802b");
        expect(firstSlide.title).to.eq("asfaf -copy");
        expect(firstSlide.slides).to.have.length(1);
        expect(firstSlide.slides[0])
          .to.have.property("_id")
          .that.equals("67dea030e4e7290019e80da5");
        expect(firstSlide.slides[0])
          .to.have.property("content")
          .that.equals("");
        expect(firstSlide.slides[0]).to.have.property("title").that.equals("");
      }

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
