Cypress.env();
const testUser = {
  name: "test8",
  password: Cypress.env("test_password"),
  email: "cypress@gmail.com"
};

const loginAndDevicesPage = () => {
  cy.visit("/");

  cy.get("input[name=email1]").type(testUser.email);
  cy.get("input[name=password1]").type(testUser.password);
  cy.get("button[type=submit]").click();
  cy.get('div[class="hamburger-react"]').click();
  cy.get('a[href*="/devices"]').click();
};

describe("1. Devices Page navigation", () => {
  // add a device before testing the device page
  it("1.1 After successful login, navigate to the device detail page", () => {
    loginAndDevicesPage();
    cy.wait(500);
    // navigate to device detail page
    cy.get('a[href*="/device"]')
      .eq(1)
      .click("left");

    // check that you are on the device page
    cy.url().should("include", "device");
  });
});

describe("2. Devices Page tabs.", () => {
  // add a device before testing the device page
  it("2.1 Make sure that all 5 device details tabs are being displayed.", () => {
    loginAndDevicesPage();
    cy.wait(500);
    // navigate to device detail page
    cy.get('a[href*="/device"]')
      .eq(1)
      .click("left");
    // let the device information load
    cy.wait(500);
    // check that you are on the device page
    cy.url().should("include", "device");

    // check if there are 5 tabs
    cy.get('div[class="device-details-tabs col"] > ul')
      .find("li")
      .should("have.length", 5);
    // make sure the tabs have the right labels and order
    cy.get('div[class="device-details-tabs col"] > ul > li')
      .eq(0)
      .contains("button", "CPU")
      .get('div[class="device-details-tabs col"] > ul > li')
      .eq(1)
      .contains("button", "Memory")
      .get('div[class="device-details-tabs col"] > ul > li')
      .eq(2)
      .contains("button", "Disk")
      .get('div[class="device-details-tabs col"] > ul > li')
      .eq(3)
      .contains("button", "Wifi")
      .get('div[class="device-details-tabs col"] > ul > li')
      .eq(4)
      .contains("button", "Processes");
  });
  it("2.2 Make sure that when the CPU tab is clicked on the relevant information cards are displayed.", () => {
    loginAndDevicesPage();
    cy.wait(500);
    // navigate to device detail page
    cy.get('a[href*="/device"]')
      .eq(1)
      .click("left");
    // let the device information load
    cy.wait(500);
    // check that you are on the device page
    cy.url().should("include", "device");

    // select CPU tab
    cy.get('div[class="device-details-tabs col"] > ul > li > button')
      .eq(0)
      .click();

    // make sure the proper div is active
    cy.get('div[class="tab-content"] > div')
      .eq(0)
      .should("have.class", "tab-pane active");

    // make sure all other divs aren't
    cy.get('div[class="tab-content"] > div')
      .not(".tab-pane.active")
      .should("have.length", 4);

    // make sure proper cards are shown
    cy.contains("CPU Usage Information").should("be.visible");
    cy.contains("Additional CPU Information").should("be.visible");
  });
  it("2.3 Make sure that when the Memory tab is clicked on the relevant information cards are displayed.", () => {
    loginAndDevicesPage();
    cy.wait(500);
    // navigate to device detail page
    cy.get('a[href*="/device"]')
      .eq(1)
      .click("left");
    // let the device information load
    cy.wait(500);
    // check that you are on the device page
    cy.url().should("include", "device");

    // select CPU tab
    cy.get('div[class="device-details-tabs col"] > ul > li > button')
      .eq(1)
      .click();

    // make sure the proper div is active
    cy.get('div[class="tab-content"] > div')
      .eq(1)
      .should("have.class", "tab-pane active");

    // make sure all other divs aren't
    cy.get('div[class="tab-content"] > div')
      .not(".tab-pane.active")
      .should("have.length", 4);

    // make sure proper cards are shown
    cy.contains("Memory Usage Information").should("be.visible");
    cy.contains("Additional Memory Information").should("be.visible");
  });
  it("2.4 Make sure that when the Disk tab is clicked on the relevant information cards are displayed.", () => {
    loginAndDevicesPage();
    cy.wait(500);
    // navigate to device detail page
    cy.get('a[href*="/device"]')
      .eq(1)
      .click("left");
    // let the device information load
    cy.wait(500);
    // check that you are on the device page
    cy.url().should("include", "device");

    // select CPU tab
    cy.get('div[class="device-details-tabs col"] > ul > li > button')
      .eq(2)
      .click();

    // make sure the proper div is active
    cy.get('div[class="tab-content"] > div')
      .eq(2)
      .should("have.class", "tab-pane active");

    // make sure all other divs aren't
    cy.get('div[class="tab-content"] > div')
      .not(".tab-pane.active")
      .should("have.length", 4);

    // make sure proper cards are shown
    cy.contains("Disk Usage Information").should("be.visible");
    cy.contains("Additional Disk Information").should("be.visible");
  });
  it("2.5 Make sure that when the Wifi tab is clicked on the relevant information cards are displayed.", () => {
    loginAndDevicesPage();
    cy.wait(500);
    // navigate to device detail page
    cy.get('a[href*="/device"]')
      .eq(1)
      .click("left");
    // let the device information load
    cy.wait(500);
    // check that you are on the device page
    cy.url().should("include", "device");

    // select CPU tab
    cy.get('div[class="device-details-tabs col"] > ul > li > button')
      .eq(3)
      .click();

    // make sure the proper div is active
    cy.get('div[class="tab-content"] > div')
      .eq(3)
      .should("have.class", "tab-pane active");

    // make sure all other divs aren't
    cy.get('div[class="tab-content"] > div')
      .not(".tab-pane.active")
      .should("have.length", 4);

    // make sure proper cards are shown
    cy.contains("Wifi Usage Information").should("be.visible");
    cy.contains("Additional Wifi Information").should("be.visible");
  });
  it("2.6 Make sure that when the Processes tab is clicked on the table is displayed.", () => {
    loginAndDevicesPage();
    cy.wait(500);
    // navigate to device detail page
    cy.get('a[href*="/device"]')
      .eq(1)
      .click("left");
    // let the device information load
    cy.wait(500);
    // check that you are on the device page
    cy.url().should("include", "device");

    // select CPU tab
    cy.get('div[class="device-details-tabs col"] > ul > li > button')
      .eq(4)
      .click();

    // make sure the proper div is active
    cy.get('div[class="tab-content"] > div')
      .eq(4)
      .should("have.class", "tab-pane active");

    // make sure all other divs aren't
    cy.get('div[class="tab-content"] > div')
      .not(".tab-pane.active")
      .should("have.length", 4);

    // make sure proper table headers are shown
    cy.get("table").should("be.visible");
  });
});
