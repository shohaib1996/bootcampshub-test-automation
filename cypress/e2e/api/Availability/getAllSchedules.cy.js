describe("Get All Schedules API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully fetch all schedules", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/calendar/schedule/all",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("schedules").that.is.an("array");

      const schedule = response.body.schedules[0];
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
      expect(schedule)
        .to.have.property("updatedAt")
        .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(schedule).to.have.property("__v").that.equals(0);

      expect(schedule)
        .to.have.property("availability")
        .that.is.an("array")
        .and.has.length(7);

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
