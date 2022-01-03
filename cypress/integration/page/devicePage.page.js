Cypress.env();
const testUser = {
    name: "test7",
    password: Cypress.env("test_password"),
    email: "selenium@gmail.com",
};

const login = () => {
    cy.visit('/');

    cy.get("input[name=email1]").type(testUser.email);
    cy.get("input[name=password1]").type(testUser.password);
    cy.get("button[type=submit]").click();
};

describe("Devices Page", () => {
  // add a device before testing the device page
  it("After successful login, navigate to the devices page containing a table with all available devices", () => {
    login();
    
    // open navbar
    cy.get('button[id="react-burger-menu-btn"]').click();

    // navigate to device detail page
    cy.get('a[href*="/devices"]').click();

    // check that you are on the device page
    cy.url().should("include", "devices");

    // check if the title is visible
    cy.contains("Devices").should('be.visible');

    // check the table is visible
    cy.get('table').should('be.visible');

    // check if the change page text is visible
    cy.contains("Change Page").should('be.visible');
  })
})
