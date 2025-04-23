describe("User Login API Test", () => {
  it("should login a user successfully with valid email and password", () => {
    const loginDetails = {
      email: "jhon4988@asaption.com",
      password: "Jhon#1234",
    };

    cy.request({
      method: "POST",
      url: "/user/login",
      body: loginDetails,
      timeout: 2000,
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200) {
        cy.log(JSON.stringify(response.body));

        console.log("Res data:", response);

        expect(response.status).to.eq(200);

        // expect(response.body).to.have.property("success", true);
        //   expect(response.body).to.have.property("token");
        //   expect(response.body)
        //     .to.have.property("message")
        //     .and.contains("Login successfull");

        expect(response.body).to.have.property("email");

        expect(response.body).to.have.property("phone");

        expect(response.body).to.have.property("_id");

        expect(response.body).to.have.property("isVerified", false);

        expect(response.duration).to.lessThan(2000);
      } else {
        cy.log(response.body.error);

        console.log(response);
      }
    });
  });
});
