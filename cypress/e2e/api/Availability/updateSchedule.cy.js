describe("Update Schedule API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully update an existing schedule", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    const payload = {
      name: "eeee",
      availability: [
        {
          _id: "67f9ffd105bf7b0019ccddf2",
          type: "wady",
          intervals: [],
          wday: "sunday",
        },
        {
          _id: "658b2e0f0e8b2153646d05bc",
          type: "wady",
          intervals: [
            {
              _id: "86c2a8e4e52f361c8ae7d9b0",
              from: "20:00",
              to: "05:00",
            },
          ],
          wday: "monday",
        },
        {
          _id: "658bf962f89a3a7314b913fb",
          type: "wady",
          intervals: [
            {
              _id: "86c2a8e4e52f361c8ae7d9b0",
              from: "20:00",
              to: "05:00",
            },
          ],
          wday: "tuesday",
        },
        {
          _id: "658bf962f89a3a7314b913ff",
          type: "wady",
          intervals: [
            {
              _id: "86c2a8e4e52f361c8ae7d9b0",
              from: "20:00",
              to: "05:00",
            },
          ],
          wday: "wednesday",
        },
        {
          _id: "658bf962f89a3a7314b91403",
          type: "wady",
          intervals: [
            {
              _id: "86c2a8e4e52f361c8ae7d9b0",
              from: "20:00",
              to: "05:00",
            },
          ],
          wday: "thursday",
        },
        {
          _id: "658bf962f89a3a7314b91407",
          type: "wady",
          intervals: [
            {
              _id: "86c2a8e4e52f361c8ae7d9b0",
              from: "20:00",
              to: "05:00",
            },
          ],
          wday: "friday",
        },
        {
          _id: "66a4aa543102ed0019b4eaee",
          type: "wady",
          intervals: [],
          wday: "saturday",
        },
      ],
      timeZone: "Asia/Dhaka",
    };

    // Make API request
    cy.request({
      method: "PATCH",
      url: "/calendar/schedule/update/658b2d300e8b2153646d05b3",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
      body: payload,
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("schedule").that.is.an("object");

      // Specific schedule property validations
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
      expect(schedule)
        .to.have.property("updatedAt")
        .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(schedule).to.have.property("__v").that.equals(0);

      // Validate nested availability
      expect(schedule)
        .to.have.property("availability")
        .that.is.an("array")
        .and.has.length(7);

      // Log response for debugging
      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
