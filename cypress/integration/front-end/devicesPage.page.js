Cypress.env();
const testUser = {
  name: "test7",
  password: Cypress.env("test_password"),
  email: "cypress@gmail.com"
};

const testInputs = {
  oneTestDevices: "test1",
  allTestDevices: "test"
};

const login = () => {
  cy.visit("/");
  cy.get("input[name=email1]").type(testUser.email);
  cy.get("input[name=password1]").type(testUser.password);
  cy.get("button[type=submit]").click();
};

describe("1. Check to ensure the Devices Page's components behave appropriately.", () => {
  // add a device before testing the device page
  it("1.1 After successful login, navigate to the devices page containing a table with all available devices and all expected table headers", () => {
    login();

    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/devices"]').click();

    // check that you are on the device page
    cy.url().should("include", "devices");

    // check the table is visible
    cy.get("table").should("be.visible");

    // check if the devices table has all expected headers
    cy.contains("UUID").should("be.visible");
    cy.contains("Name").should("be.visible");
    cy.contains("CPU").should("be.visible");
    cy.contains("Memory").should("be.visible");
    cy.contains("Disk").should("be.visible");
    cy.contains("Network").should("be.visible");

    // check if devices table is populated
    cy.get('a[href*="/device"]')
      .its("length")
      .should("be.gte", 0);
  });
  it("1.2 Check to ensure that if less than 10 devices are loaded that the next page button is disabled.", () => {
    login();

    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/devices"]').click();

    // check that you are on the device page
    cy.url().should("include", "devices");

    cy.get('button[class="btn next"]').should("have.attr", "disabled");
  });
  it("1.3 Check to ensure that filter button works.", () => {
    login();

    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/devices"]').click();

    // check that you are on the device page
    cy.url().should("include", "devices");

    cy.get('div[class="app"] > :nth-child(1) > :nth-child(3) > :nth-child(1) > :nth-child(1) > :nth-child(1)')
      .click();

    cy.contains("Add Filter")
      .should("be.visible");

    cy.contains("Clear All")
      .should("be.visible");
  });
  it("1.4 Make sure the Export CSV button is there.", () => {
    login();
    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/devices"]').click();

    // check that you are on the device page
    cy.url().should("include", "devices");

    cy.contains("Export To CSV")
      .should("be.visible");
  });
  it("1.5 Make sure add filter button works.", () => {
    login();

    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/devices"]').click();

    // check that you are on the device page
    cy.url().should("include", "devices");

    cy.get('div[class="app"] > :nth-child(1) > :nth-child(3) > :nth-child(1) > :nth-child(1) > :nth-child(1)')
      .click();

    cy.get('div[class="app"] > :nth-child(1) > :nth-child(3) > :nth-child(1) > :nth-child(2) > :nth-child(1) > :nth-child(2) > :nth-child(1)')
      .click();

    cy.contains("Column")
      .should("be.visible");

    cy.contains("Equality")
      .should("be.visible");
    
    cy.contains("Value")
      .should("be.visible");
  });
});
