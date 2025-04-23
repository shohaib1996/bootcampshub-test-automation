describe("User Registration API Test", () => {
  it("should register a user successfully with valid details", () => {
    const uniqueTimestamp = Date.now();

    const userDetails = {
      firstName: "Jhon",
      lastName: "Doe",
      email: `jhon${uniqueTimestamp.toString().slice(-4)}@asaption.com`,
      phone: `+8801${uniqueTimestamp.toString().slice(-9)}`,
      password: "Jhon#1234",
      confirm: "Jhon#1234",
    };

    cy.request({
      method: "POST",
      url: "/user/register",
      body: userDetails,
      failOnStatusCode: false,
      timeout: 2000,
    }).then((response) => {
      if (response.status === 200) {
        cy.log(JSON.stringify(response.body));

        console.log("Register data:", response.body);

        expect(response.status).to.eq(200);

        expect(response.body).to.have.property("success", true);

        expect(response.body).to.have.property("email");

        expect(response.body).to.have.property("phone");

        expect(response.body).to.have.property("_id");

        expect(response.duration).to.lessThan(2000);
      } else {
        cy.log(response.body.error);

        console.log(response);
      }
    });
  });
});
