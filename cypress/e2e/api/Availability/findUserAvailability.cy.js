describe("Find User Availability API", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should retrieve user availability successfully", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/calendar/schedule/find/64ef676669eaf6370c11429c",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      console.log(response);
      expect(response.status).to.eq(200);

      // Verify response structure
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("schedule").that.is.an("object");

      // Verify schedule details
      const schedule = response.body.schedule;
      expect(schedule)
        .to.have.property("_id")
        .that.equals("658b2d300e8b2153646d05b3");
      expect(schedule).to.have.property("name").that.equals("eeee");
      expect(schedule).to.have.property("timeZone").that.equals("Asia/Dhaka");
      expect(schedule)
        .to.have.property("createdBy")
        .that.equals("64ef676669eaf6370c11429c");
      expect(schedule)
        .to.have.property("createdAt")
        .that.equals("2023-12-26T19:44:48.857Z");
      expect(schedule).to.have.property("updatedAt").that.is.a("string");
      expect(schedule).to.have.property("__v").that.equals(0);

      // Verify availability array
      const availability = schedule.availability;
      expect(availability).to.have.length(7);

      expect(response.headers)
        .to.have.property("content-type")
        .that.includes("application/json");
    });
  });
});
