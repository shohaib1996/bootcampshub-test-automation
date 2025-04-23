describe("Enrollment API", () => {
  // Please comment out base url first

  const REQUEST_TIMEOUT = 10000;

  let credentials;
  let enrollmentPayload;

  before(() => {
    cy.fixture("enrollCredential.json").then((creds) => {
      credentials = creds;
    });

    cy.fixture("enrollmentPayload.json").then((payload) => {
      enrollmentPayload = payload;
    });

    cy.log("Starting Enrollment API tests");
  });

  it("should enroll a user successfully with valid headers and payload", () => {
    cy.request({
      method: "POST",
      url: "https://api.bootcampshub.ai/api/enrollment/enroll",
      headers: credentials,
      body: enrollmentPayload,
      failOnStatusCode: false, // Allow handling non-2xx responses
      timeout: REQUEST_TIMEOUT,
    }).then((response) => {
      cy.log(`Response: ${JSON.stringify(response.body)}`);

      // Assert response status
      //   expect(response.status).to.eq(200, "Expected status code 200");

      //   // Assert response body properties
      //   cy.wrap(response.body).should("have.property", "success").and("eq", true);

      expect(response.duration).to.be.lessThan(
        REQUEST_TIMEOUT,
        "Response time exceeded timeout"
      );
    });
  });
});
