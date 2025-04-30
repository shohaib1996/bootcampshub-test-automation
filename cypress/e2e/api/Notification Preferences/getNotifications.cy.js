describe("Get Notification Preferences API", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should retrieve all notification preferences successfully", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "GET",
      url: "/notification/preference/getall",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.have.property("notiRoles").that.is.an("array");
      expect(response.body).to.have.property("preferences").that.is.an("array");

      const notiRoles = response.body.notiRoles;
      expect(notiRoles).to.have.length(23);
      expect(notiRoles[0])
        .to.have.property("_id")
        .that.equals("66c2616ecaab8cad8c53e141");
      expect(notiRoles[0]).to.have.property("id").that.equals("changePassword");
      expect(notiRoles[0])
        .to.have.property("title")
        .that.equals("Notification of password change.");
      expect(notiRoles[0])
        .to.have.property("channels")
        .that.deep.equals(["web", "chat", "email"]);
      expect(notiRoles[1]).to.have.property("id").that.equals("updateProfile");
      expect(notiRoles[1])
        .to.have.property("channels")
        .that.deep.equals(["push", "web", "chat", "email"]);

      const preferences = response.body.preferences;
      expect(preferences).to.have.length(23);
      expect(preferences[0])
        .to.have.property("_id")
        .that.equals("66cb3bc324e209cf61f1a4bd");
      expect(preferences[0])
        .to.have.property("id")
        .that.equals("changePassword");
      expect(preferences[0])
        .to.have.property("channels")
        .that.deep.equals(["push", "sms", "email", "web", "chat"]);
      expect(preferences[1])
        .to.have.property("id")
        .that.equals("updateProfile");
      expect(preferences[1])
        .to.have.property("channels")
        .that.deep.equals(["sms", "web", "push", "email", "chat"]);
    });
  });
});
