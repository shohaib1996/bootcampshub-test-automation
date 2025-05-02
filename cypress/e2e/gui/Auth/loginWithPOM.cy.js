import LoginPage from "../page/login";

describe("Login Page", () => {
    it("should login with valid credentials", () => {
        const loginPage = new LoginPage();
        loginPage.visit();
        loginPage.enterEmail()
        loginPage.enterPassword()
    });
});

