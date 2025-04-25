describe("My Events API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully fetch events within the specified date range", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    // Make API request
    cy.request({
      method: "GET",
      url: "/v2/calendar/event/myevents?from=2025-03-31T18:00:00.000Z&to=2025-04-30T17:59:59.999Z",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("events").that.is.an("array");
      expect(response.body).to.have.property("count").that.is.a("number");

      const events = response.body.events;
      expect(events).to.have.length.at.least(0);

      events.forEach((event) => {
        expect(event).to.have.property("_id").that.is.a("string");
        expect(event)
          .to.have.property("permissions")
          .that.is.an("object")
          .and.includes.all.keys("modifyEvent", "inviteOthers", "seeGuestList");
        expect(event).to.have.property("isAllDay").that.is.a("boolean");
        expect(event).to.have.property("timeZone").that.is.a("string");
        expect(event)
          .to.have.property("type")
          .that.is.a("string")
          .and.is.oneOf(["event", "task"]);

        expect(event)
          .to.have.property("priority")
          .that.is.a("string")
          .and.is.oneOf(["notdefined", "low", "medium", "high"]);
        expect(event).to.have.property("title").that.is.a("string");
        expect(event).to.have.property("description").that.is.a("string");
        expect(event)
          .to.have.property("startTime")
          .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(event)
          .to.have.property("endTime")
          .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

        expect(event)
          .to.have.property("recurrence")
          .that.is.an("object")
          .and.includes.all.keys(
            "isRecurring",
            "frequency",
            "interval",
            "daysOfWeek"
          );
        expect(event).to.have.property("reminders").that.is.an("array");
        expect(event).to.have.property("organization").that.is.a("string");
        expect(event)
          .to.have.property("organizer")
          .that.is.an("object")
          .and.includes.all.keys(
            "profilePicture",
            "lastName",
            "_id",
            "firstName",
            "fullName"
          );
        expect(event).to.have.property("attachments").that.is.an("array");
        expect(event).to.have.property("branch").that.is.a("string");
        expect(event)
          .to.have.property("createdAt")
          .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(event)
          .to.have.property("updatedAt")
          .that.matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(event).to.have.property("__v").that.is.a("number");
        expect(event).to.have.property("attendeeCount").that.is.a("number");

        expect(event.permissions)
          .to.have.property("modifyEvent")
          .that.is.a("boolean");
        expect(event.permissions)
          .to.have.property("inviteOthers")
          .that.is.a("boolean");
        expect(event.permissions)
          .to.have.property("seeGuestList")
          .that.is.a("boolean");

        if (event.location) {
          expect(event.location).to.have.property("type").that.is.a("string");
          expect(event.location).to.have.property("link").that.is.a("string");
        }

        expect(event.recurrence)
          .to.have.property("isRecurring")
          .that.is.a("boolean");
        expect(event.recurrence)
          .to.have.property("frequency")
          .that.is.a("string");
        expect(event.recurrence)
          .to.have.property("interval")
          .that.is.a("number");
        expect(event.recurrence)
          .to.have.property("daysOfWeek")
          .that.is.an("array");

        event.reminders.forEach((reminder) => {
          expect(reminder).to.have.property("methods").that.is.an("array");
          expect(reminder).to.have.property("crowds").that.is.an("array");
          expect(reminder)
            .to.have.property("offsetMinutes")
            .that.is.a("number");
        });

        if (event.purpose) {
          expect(event.purpose)
            .to.have.property("category")
            .that.is.a("string");
          expect(event.purpose)
            .to.have.property("resourceId")
            .that.is.a("string");
        }
      });

      if (events.length > 0) {
        const firstEvent = events[0];
        expect(firstEvent._id).to.eq("67fb9ae405bf7b0019cce8e6");
        expect(firstEvent.title).to.eq("jahid");
        expect(firstEvent.type).to.eq("event");
        expect(firstEvent.status).to.eq("confirmed");
        expect(firstEvent.startTime).to.eq("2025-04-13T18:00:00.000Z");
        expect(firstEvent.endTime).to.eq("2025-04-13T18:15:00.000Z");
        expect(firstEvent.timeZone).to.eq("Asia/Dhaka");
        expect(firstEvent.isAllDay).to.eq(false);
        expect(firstEvent.permissions).to.deep.eq({
          modifyEvent: false,
          inviteOthers: false,
          seeGuestList: false,
        });
        expect(firstEvent.location).to.deep.eq({
          type: "meet",
          link: "https://meet.google.com/fgz-ijjd-hjp",
        });
        expect(firstEvent.recurrence)
          .to.have.property("isRecurring")
          .that.equals(false);
        expect(firstEvent.reminders).to.have.length(1);
        expect(firstEvent.reminders[0])
          .to.have.property("offsetMinutes")
          .that.equals(15);
        expect(firstEvent.organizer)
          .to.have.property("_id")
          .that.equals("64ef676669eaf6370c11429c");
        expect(firstEvent.organizer)
          .to.have.property("fullName")
          .that.equals("Ashraful Shimul");
        expect(firstEvent.organization).to.eq("64fcb2e60d2f877aaccb3b26");
        expect(firstEvent.branch).to.eq("64fcb4e8944cf215d8d32f95");
        expect(firstEvent.purpose).to.deep.eq({
          category: "lesson",
          resourceId: "67d282e9f3b2e0001a050ca1",
        });
        expect(firstEvent.attachments).to.be.empty;
        expect(firstEvent.attendeeCount).to.eq(2);
        expect(firstEvent.myResponseStatus).to.eq("accepted");
      }

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
