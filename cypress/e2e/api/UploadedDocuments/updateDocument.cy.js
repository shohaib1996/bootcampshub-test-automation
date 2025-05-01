describe("Update User Document API", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should update user document successfully", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    const payload = {
      description:
        '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"new test update documents ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
      name: "new test update documents",
      tags: [],
      thumbnail: "",
      attachments: [],
      priority: "low",
    };

    cy.request({
      method: "PATCH",
      url: "/document/userdocument/update/6633fda2a4de160019bf3cdc",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
      },
      body: payload,
    }).then((response) => {
      expect(response.status).to.eq(200);

      // Verify response structure
      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("document").that.is.an("object");

      // Verify response headers
      expect(response.headers)
        .to.have.property("content-type")
        .that.includes("application/json");
    });
  });
});
