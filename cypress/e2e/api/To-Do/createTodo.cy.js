describe("Create Todo Task API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully create a new todo task", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    const payload = {
      title: "Test todo task",
      priority: "low",
      startTime: "2025-04-29T18:03:00.000Z",
      endTime: "2025-04-29T18:18:00.000Z",
      isAllDay: false,
      reminders: [
        {
          chatGroups: [],
          methods: ["push"],
          offsetMinutes: 15,
        },
      ],
      description: "test details",
      type: "task",
      timeZone: "Asia/Dhaka",
    };

    cy.request({
      method: "POST",
      url: "/v2/calendar/event/create",
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
      expect(response.body).to.have.property("instancesCount").that.equals(0);

      const event = response.body.event;
      expect(event).to.have.property("_id").that.is.a("string");
      expect(event).to.have.property("title").that.equals("Test todo task");
      expect(event).to.have.property("type").that.equals("task");
      expect(event).to.have.property("status").that.equals("todo");
      expect(event).to.have.property("priority").that.equals("low");
      expect(event).to.have.property("description").that.equals("test details");

      expect(event).to.have.property("permissions").that.is.an("object");
      expect(event.permissions).to.deep.eq({
        modifyEvent: false,
        inviteOthers: false,
        seeGuestList: true,
      });

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

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
