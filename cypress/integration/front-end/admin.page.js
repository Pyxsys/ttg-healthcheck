Cypress.env();
const admintestUser = {
  name: "admin2",
  password: Cypress.env("admin_password"),
  email: "admin@gmail.com"
};

describe("AdminPanel Page", () => {
  it("1.1 After successful login user with admin privileges can access /adminpanel page", () => {
    cy.visit("/");

    cy.get("input[name=email1]").type(admintestUser.email);
    cy.get("input[name=password1]").type(admintestUser.password);
    cy.get("button[type=submit]").click();
    cy.url().should("include", "dashboard");

    cy.visit("/admin");
    cy.url().should("include", "admin");
  });
  it("1.2 Got to admin page and make sure table headers are correct", () => {
    cy.visit("/");

    cy.get("input[name=email1]").type(admintestUser.email);
    cy.get("input[name=password1]").type(admintestUser.password);
    cy.get("button[type=submit]").click();
    cy.url().should("include", "dashboard");

    cy.visit("/admin");
    cy.contains("Name").should("be.visible");
    cy.contains("Email").should("be.visible");
    cy.contains("role").should("be.visible");
    cy.contains("Icon").should("be.visible");
  });
});
