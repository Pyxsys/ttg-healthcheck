Cypress.env();
const testUser = {
  name: "test2",
  password: Cypress.env("test_password"),
  email: "cypress@gmail.com"
};

describe("Logout", () => {
  it("Upon successful Logout, redirect to /", () => {
    // Open the landing page
    cy.visit("/");

    cy.get("input[name=email1]").type(testUser.email);
    cy.get("input[name=password1]").type(testUser.password);
    cy.get("button[type=submit]").click();
    cy.get('div[class="dropdown"]').click();
    cy.get('div[id="logout"]').click();

    // Assert we are back on the landing page
    cy.url().should("include", "/");
  });
});
