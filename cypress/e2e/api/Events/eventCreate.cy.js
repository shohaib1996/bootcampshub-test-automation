describe("Create Event API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully create a new event", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    // Define the request payload
    const payload = {
      title: "Api test event create",
      priority: "low",
      attendees: [
        {
          _id: "650e70e7165fc20019352988",
          fullName: "Mitul Das",
        },
      ],
      startTime: "2025-04-26T18:00:00.000Z",
      endTime: "2025-04-26T18:15:00.000Z",
      isAllDay: false,
      reminders: [
        {
          chatGroups: [],
          methods: ["push"],
          offsetMinutes: 5,
        },
      ],
      location: {
        type: "meet",
        link: "",
      },
      description: "Api test event create description",
      eventColor: "",
      permissions: {
        modifyEvent: false,
        inviteOthers: false,
        seeGuestList: false,
      },
      timeZone: "Asia/Dhaka",
    };

    // Make API request
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
      expect(response.body)
        .to.have.property("instancesCount")
        .that.is.a("number");

      const event = response.body.event;
      expect(event).to.have.property("_id").that.is.a("string");

      expect(event).to.have.property("type").that.equals("event");
      expect(event).to.have.property("status").that.equals("confirmed");
      expect(event).to.have.property("priority").that.equals("low");

      expect(event).to.have.property("isAllDay").that.equals(false);
      expect(event).to.have.property("timeZone").that.equals("Asia/Dhaka");
      expect(event)
        .to.have.property("startTime")
        .that.equals("2025-04-26T18:00:00.000Z");
      expect(event)
        .to.have.property("endTime")
        .that.equals("2025-04-26T18:15:00.000Z");
      expect(event).to.have.property("eventColor").that.equals("");
      expect(event)
        .to.have.property("organization")
        .that.equals("64fcb2e60d2f877aaccb3b26");
      expect(event)
        .to.have.property("organizer")
        .that.equals("64ef676669eaf6370c11429c");
      expect(event)
        .to.have.property("branch")
        .that.equals("64fcb4e8944cf215d8d32f95");
      expect(event)
        .to.have.property("createdAt")
        .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(event)
        .to.have.property("updatedAt")
        .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(event).to.have.property("__v").that.equals(0);

      // Validate nested permissions
      expect(event).to.have.property("permissions").that.is.an("object");
      expect(event.permissions).to.deep.eq({
        modifyEvent: false,
        inviteOthers: false,
        seeGuestList: false,
      });

      // Validate nested location
      expect(event).to.have.property("location").that.is.an("object");
      expect(event.location).to.deep.eq({
        type: "meet",
        link: "",
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

      // Validate nested attendees
      expect(event)
        .to.have.property("attendees")
        .that.is.an("array")
        .and.has.length(2);
      expect(event.attendees[0])
        .to.have.property("user")
        .that.equals("650e70e7165fc20019352988");
      expect(event.attendees[0])
        .to.have.property("responseStatus")
        .that.equals("needsAction");
      expect(event.attendees[1])
        .to.have.property("user")
        .that.equals("64ef676669eaf6370c11429c");
      expect(event.attendees[1])
        .to.have.property("responseStatus")
        .that.equals("accepted");

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
        .that.equals(5);

      // Validate attachments
      expect(event).to.have.property("attachments").that.is.an("array").and.is
        .empty;

      // Log response for debugging
      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
