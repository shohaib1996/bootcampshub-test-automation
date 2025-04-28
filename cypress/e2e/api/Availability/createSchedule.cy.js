describe("Create Schedule API Test", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should successfully create a new schedule", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    const payload = {
      name: "eeeeee",
    };

    cy.request({
      method: "POST",
      url: "/v2/calendar/schedule/create",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
      body: payload,
    }).then((response) => {
      console.log(response);

      // Log response for debugging
      cy.log("Response:", JSON.stringify(response.body));
    });
  });
});
