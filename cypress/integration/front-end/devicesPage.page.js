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
  it("1.2 Check to ensure only the one device that matches the UUID filter is displayed.", () => {
    login();

    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/devices"]').click();

    // check that you are on the device page
    cy.url().should("include", "devices");

    // Type into the filter box so that only the Test1 device is displayed
    cy.get("input[type=text]").type(testInputs.oneTestDevices);
    cy.wait(1000);
    // Make sure TEST1 device is displayed
    cy.get(":nth-child(1) > :nth-child(1) > .devices-uuid-text").contains(
      "a",
      "TEST1"
    );
    // Make sure only one device is displayed
    cy.get("table")
      .get("tbody")
      .find("tr")
      .should("have.length", 1);
  });
  it("1.3 Check to ensure only devices that match the UUID filter are displayed.", () => {
    login();

    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/devices"]').click();

    // check that you are on the device page
    cy.url().should("include", "devices");

    // Type into the filter box so that only the Test1 device is displayed
    cy.get("input[type=text]").type(testInputs.allTestDevices);
    cy.wait(1000);

    // Make sure all 3 test devices are displayed
    cy.get("table")
      .get("tbody")
      .find("tr")
      .should("have.length", 3);

    // Make sure all three of these displayed devices are Test devices
    cy.get(":nth-child(1) > :nth-child(1) > .devices-uuid-text").contains(
      "a",
      "TEST"
    );

    cy.get(":nth-child(2) > :nth-child(1) > .devices-uuid-text").contains(
      "a",
      "TEST"
    );

    cy.get(":nth-child(3) > :nth-child(1) > .devices-uuid-text").contains(
      "a",
      "TEST"
    );
  });
  it("1.4 Check to ensure that if less than 10 devices are loaded that the next page button is disabled.", () => {
    login();

    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/devices"]').click();

    // check that you are on the device page
    cy.url().should("include", "devices");

    cy.get('button[class="btn next"]').should("have.attr", "disabled");
  });
  it("1.5 Check to ensure that the order carret works for uuid devices", () => {
    // For this test only Test devices will be displayed in order to better check if device order is respected
    // So to initalize this test the same steps will be taken as 1.3
    login();

    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/devices"]').click();

    // check that you are on the device page
    cy.url().should("include", "devices");

    // Type into the filter box so that only the Test1 device is displayed
    cy.get("input[type=text]").type(testInputs.allTestDevices);
    cy.wait(1000);

    // Make sure all 3 test devices are displayed
    cy.get("table")
      .get("tbody")
      .find("tr")
      .should("have.length", 3);

    // Click on carret so that the order should descend
    cy.get('i[class="caret"]')
      .eq(0)
      .click();

    // Make sure they are in descending order
    cy.get(":nth-child(1) > :nth-child(1) > .devices-uuid-text")
      .contains("a", "TEST3")
      .get(":nth-child(2) > :nth-child(1) > .devices-uuid-text")
      .contains("a", "TEST2")
      .get(":nth-child(3) > :nth-child(1) > .devices-uuid-text")
      .contains("a", "TEST1");

    // Click on carret so that the order should ascend
    cy.get('i[class="caret"]')
      .eq(0)
      .click();

    // Make sure they are in ascending order
    cy.get(":nth-child(1) > :nth-child(1) > .devices-uuid-text")
      .contains("a", "TEST1")
      .get(":nth-child(2) > :nth-child(1) > .devices-uuid-text")
      .contains("a", "TEST2")
      .get(":nth-child(3) > :nth-child(1) > .devices-uuid-text")
      .contains("a", "TEST3");
  });
});
