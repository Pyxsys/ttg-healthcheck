Cypress.env();
const admintestUser = {
  name: "admin2",
  password: Cypress.env("admin_password"),
  email: "admin@gmail.com",
};

describe("AdminPanel Page", () => {
  it("After successful login user with admin privileges can access /adminpanel page", () => {
    cy.visit('/');

    cy.get("input[name=email1]").type(admintestUser.email);
    cy.get("input[name=password1]").type(admintestUser.password);
    cy.get("button[type=submit]").click();
    cy.url().should("include", "dashboard");

    
    cy.visit('/adminpanel');
    cy.url().should("include", "adminpanel");
  })
})