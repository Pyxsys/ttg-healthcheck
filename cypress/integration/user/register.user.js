Cypress.env();
const testUser = {
  name: "test5",
  password: Cypress.env("test_password"),
  email: "register_test@gmail.com"
};

const adminUser = {
  name: "admin",
  password: Cypress.env("admin_password"),
  email: "admin@gmail.com"
};

// register a user and get redirected to the dashboard
describe("Register", function() {
  // login as admin and delete test user first
  before(function() {
    cy.request("POST", "http://localhost:5000/api/user/login", {
      email: adminUser.email,
      password: adminUser.password
    }).then(() => {
      cy.request(
        "DELETE",
        `http://localhost:5000/api/user/delete/${testUser.email}`
      );
      cy.request("GET", `http://localhost:5000/api/user/logout`);
    });
  });
  it("Register a user with proper credentials, redirect to /dashboard", () => {
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
});
