describe("Update User Image API", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should upload a user profile image successfully", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.fixture("sample.jpg", "binary").then((image) => {
      const blob = Cypress.Buffer.from(image, "binary").buffer;
      const formData = new FormData();
      formData.append(
        "image",
        new File([blob], "sample.jpg", { type: "image/jpeg" })
      );

      cy.request({
        method: "PATCH",
        url: "/user/updateimage",
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
        // Verify status code
        expect(response.status).to.eq(200);

        // Verify response headers
        expect(response.headers)
          .to.have.property("content-type")
          .that.includes("application/json");
        expect(response.headers)
          .to.have.property("access-control-allow-origin")
          .that.equals("*");
      });
    });
  });
});
