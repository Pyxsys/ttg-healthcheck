Cypress.env();
const testUser = {
  name: "test5",
  password: Cypress.env("test_password"),
  email: "register_test@gmail.com",
};

const adminUser = {
  name: "admin",
  password: Cypress.env("admin_password"),
  email: "admin@gmail.com",
};

// register a user and get redirected to the dashboard
describe("All Register test", () => {
  // login as admin and delete test user first
  before(() => {
    cy.request("POST", "http://localhost:5000/api/user/login", {
      email: adminUser.email,
      password: adminUser.password,
    }).then(() => {
      cy.request(
        "DELETE",
        `http://localhost:5000/api/user/delete/${testUser.email}`
      );
      cy.request("GET", `http://localhost:5000/api/user/logout`);
    });
  });
  it("1. Register a user with proper credentials and redirect to /dashboard", () => {
    // open the signup page
    cy.visit("/signup");

    // enter signup information
    cy.get("input[name=name]").type(testUser.name);
    cy.get("input[name=email]").type(testUser.email);
    cy.get("input[name=password]").type(testUser.password);
    cy.get("input[name=password2]").type(testUser.password);

    // click on Signup
    cy.get("button[type=submit]").click();

    // assert we are in /dashboard
    cy.url().should("include", "/dashboard");
  });

  it("2.1 Register a user with non matching password should give 'password do not match!' error ", () => {
    // open the signup page
    cy.visit("/signup");

    // enter the signup information
    cy.get("input[name=name]").type(testUser.name);
    cy.get("input[name=email]").type(testUser.email);
    cy.get("input[name=password]").type(testUser.password);
    cy.get("input[name=password2]").type("test12");

    cy.get("button[type=submit]").click();
    // Error Message should pop up
    cy.contains("Passwords do not match!").should("be.visible");
  });

  it("2.2 Register a user with an empty password1 should give 'Invalid Password!' error", () => {
    // open the signup page
    cy.visit("/signup");

    // enter signup information
    cy.get("input[name=name]").type(testUser.name);
    cy.get("input[name=email]").type(testUser.email);
    cy.get("input[name=password2]").type(testUser.password);

    // click on Signup
    cy.get("button[type=submit]").click();
    // Error Message should pop up
    cy.contains(
      "Invalid Password! The password you have entered is either empty or too long!"
    ).should("be.visible");
    cy.contains("Passwords do not match!").should("be.visible");
  });

  it("2.3 Register a user with an empty password2 should give 'passwords doe not match!' error", () => {
    // open the signup page
    cy.visit("/signup");

    // enter signup information
    cy.get("input[name=name]").type(testUser.name);
    cy.get("input[name=email]").type(testUser.email);
    cy.get("input[name=password]").type(testUser.password);

    // click on Signup
    cy.get("button[type=submit]").click();
    // Error Message should pop up
    cy.contains("Passwords do not match!").should("be.visible");
  });

  it("2.4 Register a user with password1 of length > 45 should give 'password do not match!' error ", () => {
    const longPassword = "1".repeat(45);
    // open the signup page
    cy.visit("/signup");

    // enter the signup information
    cy.get("input[name=name]").type(testUser.name);
    cy.get("input[name=email]").type(testUser.email);
    cy.get("input[name=password]").type(longPassword);
    cy.get("input[name=password2]").type(longPassword);

    cy.get("button[type=submit]").click();
    // Error Message should pop up
    cy.contains(
      "Invalid Password! The password you have entered is either empty or too long!"
    ).should("be.visible");
  });

  it("3.1 Register a user with an existing email should give 'An account with the following email already exists!' error", () => {
    // open the signup page
    cy.visit("/signup");

    // enter signup information
    cy.get("input[name=name]").type(testUser.name);
    cy.get("input[name=email]").type(testUser.email);
    cy.get("input[name=password]").type(testUser.password);
    cy.get("input[name=password2]").type(testUser.password);

    // click on Signup
    cy.get("button[type=submit]").click();
    // Error Message should pop up
    cy.contains("An account with the following email already exists!").should(
      "be.visible"
    );
  });

  it("3.2 Register a user with an empty email should give 'Invalid Email!' error", () => {
    // open the signup page
    cy.visit("/signup");

    // enter signup information
    cy.get("input[name=name]").type(testUser.name);
    cy.get("input[name=password]").type(testUser.password);
    cy.get("input[name=password2]").type(testUser.password);

    // click on Signup
    cy.get("button[type=submit]").click();
    // Error Message should pop up
    cy.contains(
      "Invalid Email! The email you have entered is either empty or too long!"
    ).should("be.visible");
  });

  it("3.3 Register a user with an email of lenght > 80 should give 'Invalid Email!' error", () => {
    const longEmail = "a".repeat(80) + "@gmail.com";
    // open the signup page
    cy.visit("/signup");

    // enter signup information
    cy.get("input[name=name]").type(testUser.name);
    cy.get("input[name=email]").type(longEmail);
    cy.get("input[name=password]").type(testUser.password);
    cy.get("input[name=password2]").type(testUser.password);

    // click on Signup
    cy.get("button[type=submit]").click();
    // Error Message should pop up
    cy.contains(
      "Invalid Email! The email you have entered is either empty or too long!"
    ).should("be.visible");
  });

  it("4.1 Register a user with a non valid name should give 'Invalid Name!' error", () => {
    // open the signup page
    cy.visit("/signup");

    // enter signup information
    cy.get("input[name=name]").type("test!#2");
    cy.get("input[name=email]").type(testUser.email);
    cy.get("input[name=password]").type(testUser.password);
    cy.get("input[name=password2]").type(testUser.password);

    // click on Signup
    cy.get("button[type=submit]").click();
    // Error Message should pop up
    cy.contains(
      "Invalid Name! Name must not include symbols and the length must be less than 45 characters!"
    ).should("be.visible");
  });

  it("4.2 Register a user with a empty name should give 'Invalid Name!' error", () => {
    // open the signup page
    cy.visit("/signup");

    // enter signup information
    cy.get("input[name=email]").type(testUser.email);
    cy.get("input[name=password]").type(testUser.password);
    cy.get("input[name=password2]").type(testUser.password);

    // click on Signup
    cy.get("button[type=submit]").click();
    // Error Message should pop up
    cy.contains(
      "Invalid Name! Name must not include symbols and the length must be less than 45 characters!"
    ).should("be.visible");
  });

  it("4.3 Register a user with a name of lenght > 45 should give 'Invalid Name!' error", () => {
    const longName = "s".repeat(45);

    // open the signup page
    cy.visit("/signup");

    // enter signup information
    cy.get("input[name=name]").type(longName);
    cy.get("input[name=email]").type(testUser.email);
    cy.get("input[name=password]").type(testUser.password);
    cy.get("input[name=password2]").type(testUser.password);

    // click on Signup
    cy.get("button[type=submit]").click();
    // Error Message should pop up
    cy.contains(
      "Invalid Name! Name must not include symbols and the length must be less than 45 characters!"
    ).should("be.visible");
  });
});
