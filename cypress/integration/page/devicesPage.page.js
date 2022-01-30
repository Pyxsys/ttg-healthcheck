Cypress.env();
const testUser = {
  name: "test7",
  password: Cypress.env("test_password"),
  email: "cypress@gmail.com",
};

const login = () => {
  cy.visit("/");

  cy.get("input[name=email1]").type(testUser.email);
  cy.get("input[name=password1]").type(testUser.password);
  cy.get("button[type=submit]").click();
};

describe("Devices Page", () => {
  // add a device before testing the device page
  it("After successful login, navigate to the devices page containing a table with all available devices", () => {
    login();

    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/devices"]').click();

    // check that you are on the device page
    cy.url().should("include", "devices");

    // check the table is visible
    cy.get("table").should("be.visible");

    // check if devices table is populated
    cy.get('a[href*="/device"]').its('length').should('be.gte', 0);
  });
});
