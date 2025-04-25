describe("Get Event Details API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully fetch a single event by ID", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/v2/calendar/event/details/67fb9c8c05bf7b0019cce90d",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("event").that.is.an("object");

      const event = response.body.event;
      expect(event)
        .to.have.property("_id")
        .that.equals("67fb9c8c05bf7b0019cce90d");
      expect(event)
        .to.have.property("title")
        .that.equals("hello this is event");
      expect(event).to.have.property("type").that.equals("event");
      expect(event).to.have.property("status").that.equals("confirmed");
      expect(event).to.have.property("priority").that.equals("medium");
      expect(event).to.have.property("description").that.equals("test");
      expect(event).to.have.property("isAllDay").that.equals(false);
      expect(event).to.have.property("timeZone").that.equals("Asia/Dhaka");
      expect(event)
        .to.have.property("startTime")
        .that.equals("2025-04-13T18:00:00.000Z");
      expect(event)
        .to.have.property("endTime")
        .that.equals("2025-04-13T18:15:00.000Z");
      expect(event).to.have.property("eventColor").that.equals("#e60000");
      expect(event)
        .to.have.property("organization")
        .that.equals("64fcb2e60d2f877aaccb3b26");
      expect(event)
        .to.have.property("branch")
        .that.equals("64fcb4e8944cf215d8d32f95");
      expect(event)
        .to.have.property("createdAt")
        .that.equals("2025-04-13T11:14:20.512Z");
      expect(event)
        .to.have.property("updatedAt")
        .that.equals("2025-04-13T11:16:45.312Z");
      expect(event).to.have.property("__v").that.equals(1);
      expect(event)
        .to.have.property("myResponseStatus")
        .that.equals("proposedNewTime");
      expect(event).to.have.property("attendeeCount").that.equals(3);

      expect(event).to.have.property("permissions").that.is.an("object");
      expect(event.permissions).to.deep.eq({
        modifyEvent: false,
        inviteOthers: false,
        seeGuestList: false,
      });

      expect(event).to.have.property("location").that.is.an("object");
      expect(event.location).to.deep.eq({
        type: "meet",
        link: "https://meet.google.com/fgz-ijjd-hjp",
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
      expect(event.recurrence).to.have.property("endRecurrence").that.is.null;

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

      expect(event).to.have.property("organizer").that.is.an("object");
      expect(event.organizer)
        .to.have.property("_id")
        .that.equals("64f6239ac137da40e427e73e");
      expect(event.organizer)
        .to.have.property("email")
        .that.equals("shimul186@gmail.com");
      expect(event.organizer).to.have.property("firstName").that.equals("md");
      expect(event.organizer)
        .to.have.property("lastName")
        .that.equals("shimul2");
      expect(event.organizer)
        .to.have.property("fullName")
        .that.equals("md shimul2");
      expect(event.organizer)
        .to.have.property("profilePicture")
        .that.equals("");

      expect(event).to.have.property("attendeeStatistics").that.is.an("object");
      expect(event.attendeeStatistics).to.deep.eq({
        proposedNewTime: 1,
        needsAction: 1,
        accepted: 1,
      });

      expect(event).to.have.property("attachments").that.is.an("array").and.is
        .empty;

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
