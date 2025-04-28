describe("Update Todo Task API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully update an existing todo task", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    const payload = {
      updateOption: "thisEvent",
      changes: {
        title: "Test todo task update",
        priority: "low",
        startTime: "2025-04-29T18:03:00.000Z",
        endTime: "2025-04-29T18:18:00.000Z",
        recurrence: {
          isRecurring: false,
          interval: 1,
          daysOfWeek: [],
        },
        isAllDay: false,
        reminders: [
          {
            methods: ["push"],
            offsetMinutes: 15,
          },
        ],
        description: "test details",
      },
    };

    cy.request({
      method: "PATCH",
      url: "/v2/calendar/event/update/680fe85d0319320019b4357e",
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
      expect(response.body).to.have.property("event").that.is.an("object");

      const event = response.body.event;
      expect(event)
        .to.have.property("_id")
        .that.equals("680fe85d0319320019b4357e");
      expect(event)
        .to.have.property("title")
        .that.equals("Test todo task update");
      expect(event).to.have.property("type").that.equals("task");
      expect(event).to.have.property("status").that.equals("todo");
      expect(event).to.have.property("priority").that.equals("low");
      expect(event).to.have.property("description").that.equals("test details");
      expect(event).to.have.property("isAllDay").that.equals(false);
      expect(event).to.have.property("timeZone").that.equals("Asia/Dhaka");

      expect(event).to.have.property("permissions").that.is.an("object");
      expect(event.permissions).to.deep.eq({
        modifyEvent: false,
        inviteOthers: false,
        seeGuestList: true,
      });

      // Validate nested recurrence
      expect(event).to.have.property("recurrence").that.is.an("object");
      expect(event.recurrence)
        .to.have.property("isRecurring")
        .that.equals(false);
      expect(event.recurrence)
        .to.have.property("frequency")
        .that.equals("weekly");
      expect(event.recurrence).to.have.property("interval").that.equals(1);
      expect(event.recurrence)
        .to.have.property("daysOfWeek")
        .that.is.an("array").and.is.empty;

      // Validate nested reminders
      expect(event)
        .to.have.property("reminders")
        .that.is.an("array")
        .and.has.length(1);
      expect(event.reminders[0])
        .to.have.property("methods")
        .that.is.an("array")
        .and.deep.equals(["push"]);
      expect(event.reminders[0]).to.have.property("crowds").that.is.an("array")
        .and.is.empty;
      expect(event.reminders[0])
        .to.have.property("offsetMinutes")
        .that.equals(15);

      // Log response for debugging
      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
