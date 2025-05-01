describe("Upload User Document File API", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should upload a PDF document successfully", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.fixture("sample.pdf", "binary").then((pdf) => {
      const blob = Cypress.Buffer.from(pdf, "binary").buffer;
      const formData = new FormData();
      formData.append(
        "file",
        new File([blob], "sample.pdf", { type: "application/pdf" })
      );

      cy.request({
        method: "POST",
        url: "/document/userdocumentfile",
        headers: {
          Authorization: authToken,
          Enrollment: enrollmentId,
          Organization: organizationId,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
        encoding: "binary",
      }).then((response) => {
        console.log(response);
        expect(response.status).to.eq(200);

        // Verify response headers
        expect(response.headers)
          .to.have.property("content-type")
          .that.includes("application/json");
      });
    });
  });
});
