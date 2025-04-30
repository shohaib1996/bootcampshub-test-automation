describe("Create Note API", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should create a new note successfully", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    const payload = {
      description:
        '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"test new create ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
      title: "new title test",
      tags: ["javascript"],
      attachments: [],
      purpose: {
        category: "chapter",
        resourceId: "67d282e9f3b2e0001a050c9d",
      },
    };

    cy.request({
      method: "POST",
      url: "/content/note/create",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
        "Content-Type": "application/json",
      },
      body: payload,
    }).then((response) => {
      expect(response.status).to.eq(201);

      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("note").that.is.an("object");

      const note = response.body.note;
      expect(note).to.have.property("tags").that.deep.equals(["javascript"]);
      expect(note).to.have.property("_id").that.is.a("string");
      expect(note).to.have.property("title").that.equals("new title test");
    });
  });
});
