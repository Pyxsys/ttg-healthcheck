Cypress.env();
const testUser = {
  name: "test",
  password: Cypress.env("test_password"),
  email: "cypress@gmail.com",
  role: "user",
};

describe("Login Page", () => {
  it("1 Given valid email and password, should redirect to /dashboard on syccessful login", () => {
    // open the landing page
    cy.visit("/");

    cy.get("input[name=email1]").type(testUser.email);
    cy.get("input[name=password1]").type(testUser.password);
    cy.get("button[type=submit]").click();

    // assert we are in /dashboard
    cy.url().should("include", "dashboard");
  });

  it("2.1 Given invalid password, should throw a 'Invalid Email or Password!' error", () => {
    // open the landing page
    cy.visit("/");

    cy.get("input[name=email1]").type(testUser.email);
    cy.get("input[name=password1]").type("123454634");
    cy.get("button[type=submit]").click();

    // Error Message should pop up
    cy.contains(
      "Invalid Email or Password! Either the email or password you have entered is invalid!"
    ).should("be.visible");
  });

  it("2.2 Given empty password, should throw a 'Invalid Password!' error", () => {
    // open the landing page
    cy.visit("/");

    cy.get("input[name=email1]").type(testUser.email);
    cy.get("button[type=submit]").click();

    // Error Message should pop up
    cy.contains(
      "Invalid Password! The password you have entered is either empty or too long!"
    ).should("be.visible");
  });

  it("2.3 Given a password of lenght > 45, should throw a 'Invalid Password!' error", () => {
    const longPassword = "r".repeat(45);
    // open the landing page
    cy.visit("/");

    cy.get("input[name=email1]").type(testUser.email);
    cy.get("input[name=password1]").type(longPassword);
    cy.get("button[type=submit]").click();

    // Error Message should pop up
    cy.contains(
      "Invalid Password! The password you have entered is either empty or too long!"
    ).should("be.visible");
  });

  it("3.1 Given non valid email, should throw a 'Invalid Email or Password!' error", () => {
    // open the landing page
    cy.visit("/");

    cy.get("input[name=email1]").type("invalid@email.com");
    cy.get("input[name=password1]").type(testUser.password);
    cy.get("button[type=submit]").click();

    // Error Message should pop up
    cy.contains(
      "Invalid Email or Password! Either the email or password you have entered is invalid!"
    ).should("be.visible");
  });

  it("3.2 Given empty email, should throw a 'Invalid Email!' error", () => {
    // open the landing page
    cy.visit("/");

    cy.get("input[name=password1]").type(testUser.password);
    cy.get("button[type=submit]").click();

    // Error Message should pop up
    cy.contains(
      "Invalid Email! The email you have entered is either empty or too long!"
    ).should("be.visible");
  });

  it("3.3 Given an email of lenght > 80, should throw a 'Invalid Email!' error", () => {
    const longEmail = "b".repeat(80) + "@example.com";
    // open the landing page
    cy.visit("/");

    cy.get("input[name=email1]").type(longEmail);
    cy.get("input[name=password1]").type(testUser.password);
    cy.get("button[type=submit]").click();

    // Error Message should pop up
    cy.contains(
      "Invalid Email! The email you have entered is either empty or too long!"
    ).should("be.visible");
  });
});
