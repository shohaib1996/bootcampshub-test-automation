describe("Delete Event API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully delete an event", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "DELETE",
      url: "/v2/calendar/event/delete/680c09220319320019b433eb?deleteOption=thisEvent",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body)
        .to.have.property("message")
        .that.equals("Event deleted");

      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
