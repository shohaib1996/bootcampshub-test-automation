describe("Update Notification Preferences API", () => {
  let credentials;
  let notificationPayload;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
    cy.fixture("notificationPreferences.json").then((data) => {
      notificationPayload = data;
    });
  });

  it("should update notification preferences successfully", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    cy.request({
      method: "PATCH",
      url: "/notification/preference/update",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
        "Content-Type": "application/json",
      },
      body: notificationPayload,
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body)
        .to.have.property("preferences")
        .that.is.an("object");
      expect(response.body.preferences)
        .to.have.property("_id")
        .that.equals("66c4f8f29c50dd51352a7f48");
      expect(response.body.preferences)
        .to.have.property("user")
        .that.equals("64ef676669eaf6370c11429c");
      expect(response.body.preferences)
        .to.have.property("student")
        .that.is.an("array");
      expect(response.body.preferences)
        .to.have.property("branch")
        .that.is.an("array");
      expect(response.body.preferences)
        .to.have.property("company")
        .that.is.an("array");
      expect(response.body.preferences)
        .to.have.property("operation")
        .that.is.an("array");
      expect(response.body.preferences)
        .to.have.property("createdAt")
        .that.is.a("string");
      expect(response.body.preferences)
        .to.have.property("updatedAt")
        .that.is.a("string");
      expect(response.body.preferences).to.have.property("__v").that.equals(0);

      const studentPrefs = response.body.preferences.student;
      expect(studentPrefs).to.have.length(23);
      expect(studentPrefs[0])
        .to.have.property("id")
        .that.equals("changePassword");
      expect(studentPrefs[0])
        .to.have.property("channels")
        .that.deep.equals(["push", "sms", "email", "web", "chat"]);
      expect(studentPrefs[0])
        .to.have.property("_id")
        .that.equals("66cb3bc324e209cf61f1a4bd");
      expect(studentPrefs[1])
        .to.have.property("id")
        .that.equals("updateProfile");
      expect(studentPrefs[1])
        .to.have.property("channels")
        .that.deep.equals(["sms", "web", "push", "email", "chat"]);
      expect(studentPrefs[1])
        .to.have.property("_id")
        .that.equals("66cb3bc324e209cf61f1a4be");

      const branchPrefs = response.body.preferences.branch;
      expect(branchPrefs).to.have.length(6);
      expect(branchPrefs[0])
        .to.have.property("id")
        .that.equals("createShowAndTell");
      expect(branchPrefs[0])
        .to.have.property("channels")
        .that.deep.equals(["web", "chat"]);
      expect(branchPrefs[0])
        .to.have.property("_id")
        .that.equals("66c4f8f29c50dd51352a7f5f");

      const companyPrefs = response.body.preferences.company;
      expect(companyPrefs).to.have.length(3);
      expect(companyPrefs[0])
        .to.have.property("id")
        .that.equals("branchStatusChange");
      expect(companyPrefs[0])
        .to.have.property("channels")
        .that.deep.equals(["web", "push", "chat", "sms", "email"]);
      expect(companyPrefs[0])
        .to.have.property("_id")
        .that.equals("66c4f8f29c50dd51352a7f65");

      const operationPrefs = response.body.preferences.operation;
      expect(operationPrefs).to.have.length(2);
      expect(operationPrefs[0])
        .to.have.property("id")
        .that.equals("organizationApply");
      expect(operationPrefs[0])
        .to.have.property("channels")
        .that.deep.equals(["web", "push", "chat", "email"]);
      expect(operationPrefs[0])
        .to.have.property("_id")
        .that.equals("66c4f8f29c50dd51352a7f68");
    });
  });
});
