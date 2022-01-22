Cypress.env();
const testUser = {
  name: "test",
  password: Cypress.env("test_password"),
  email: "cypress@gmail.com",
  role: "user"
};

describe("Login Page", () => {
  it("Given valid email and password, redirect to /dashboard on syccessful login", () => {
    // open the landing page
    cy.visit("/");

    cy.get("input[name=email1]").type(testUser.email);
    cy.get("input[name=password1]").type(testUser.password);
    cy.get("button[type=submit]").click();

    // assert we are in /dashboard
    cy.url().should("include", "dashboard");
  });
});
