describe("Update Event Invitation Response API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully update the invitation response for an event", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    const payload = {
      responseStatus: "accepted",
      responseOption: "thisEvent",
      proposedTime: null,
    };

    // Make API request
    cy.request({
      method: "POST",
      url: "/v2/calendar/event/invitation/response/680fdcfd0319320019b43546",
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

      expect(event).to.have.property("type").that.equals("event");
      expect(event).to.have.property("status").that.equals("confirmed");
      expect(event).to.have.property("priority").that.equals("high");
      expect(event).to.have.property("description").that.is.a("string");
      expect(event).to.have.property("isAllDay").that.equals(false);
      expect(event).to.have.property("timeZone").that.equals("Asia/Dhaka");

      expect(event).to.have.property("permissions").that.is.an("object");
      expect(event.permissions).to.deep.eq({
        modifyEvent: false,
        inviteOthers: false,
        seeGuestList: false,
      });

      expect(event).to.have.property("location").that.is.an("object");

      expect(event).to.have.property("recurrence").that.is.an("object");

      expect(event)
        .to.have.property("attendees")
        .that.is.an("array")
        .and.has.length(2);

      expect(event)
        .to.have.property("reminders")
        .that.is.an("array")
        .and.has.length(1);

      expect(event).to.have.property("attachments").that.is.an("array").and.is
        .empty;

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
