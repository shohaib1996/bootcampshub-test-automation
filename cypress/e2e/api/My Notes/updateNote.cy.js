describe("Update Note API", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("loginCredential.json").then((data) => {
      credentials = data;
    });
  });

  it("should update an existing note successfully", () => {
    const {
      Authorization: authToken,
      Enrollment: enrollmentId,
      Organization: organizationId,
    } = credentials;

    const payload = {
      description:
        '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"test new create update ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
      title: "new title test update",
      tags: ["javascript"],
      thumbnail: "",
      attachments: [],
      purpose: {
        category: "chapter",
        resourceId: "67d282e9f3b2e0001a050c9d",
      },
    };

    cy.request({
      method: "PATCH",
      url: "/content/note/edit/6812818cbdcf2a001a3a15fc",
      headers: {
        Authorization: authToken,
        Enrollment: enrollmentId,
        Organization: organizationId,
        "Content-Type": "application/json",
      },
      body: payload,
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.have.property("success").that.equals(true);
      expect(response.body).to.have.property("note").that.is.an("object");

      // Verify note details
      const note = response.body.note;
      expect(note).to.have.property("purpose").that.is.an("object");
      expect(note.purpose).to.have.property("category").that.equals("chapter");
      expect(note).to.have.property("tags").that.deep.equals(["javascript"]);
      expect(note)
        .to.have.property("_id")
        .that.equals("6812818cbdcf2a001a3a15fc");
    });
  });
});
