Cypress.env();
const testUser = {
  name: "test8",
  password: Cypress.env("test_password"),
  email: "cypress@gmail.com",
};

const loginAndDevicesPage = () => {
  cy.visit("/");

  cy.get("input[name=email1]").type(testUser.email);
  cy.get("input[name=password1]").type(testUser.password);
  cy.get("button[type=submit]").click();
  cy.get('div[class="hamburger-react"]').click();
  cy.get('a[href*="/devices"]').click();
};

describe("Devices Page", () => {
  // add a device before testing the device page
  it("After successful login, navigate to the device detail page", () => {
    loginAndDevicesPage();
    cy.wait(500);
    // navigate to device detail page
    cy.get('a[href*="/device"]').eq(1).click("left");

    // check that you are on the device page
    cy.url().should("include", "device");

    // check if card headers are present
    cy.contains("Device").should("be.visible");
    cy.contains("CPU").should("be.visible");
    cy.contains("Memory").should("be.visible");
    cy.contains("Disk").should("be.visible");
  });
});
