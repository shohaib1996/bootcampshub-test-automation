import LoginPage from '../page/login';

describe("Login Page Test Flow with POM", () => {
  let credentials;

  beforeEach(() => {
    cy.fixture("userInformation.json").then((data) => {
      credentials = data;
    });

    cy.on("uncaught:exception", (err) => {
      if (err.message.includes("Minified React error #418")) {
        return false;
      }
    });
  });

  it("should login successfully and navigate to dashboard using POM", () => {
    const { email, password } = credentials;

    LoginPage.visit();
    LoginPage.clickLoginButton();
    LoginPage.verifyLoginPageUrl();
    LoginPage.enterCredentials(email, password);
    LoginPage.clickSignIn();
    LoginPage.verifyDashboardLoaded();
    LoginPage.switchProgram();
    LoginPage.goToBootcamp();
  });
});
