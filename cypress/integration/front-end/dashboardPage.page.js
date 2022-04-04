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

const addModal = index => {
  cy.get(
    'div[class="d-flex justify-content-center dashboard-dashed-box"]'
  ).click("left");
  cy.get("select").select(index);
  cy.get(".modal-footer > :nth-child(2)")
    .contains("Save")
    .click();
  cy.get(
    'div[class="d-flex justify-content-center dashboard-dashed-box"]'
  ).click("left");
  cy.get("select").select(index);
  cy.get(".pt-2 > select").select(2);
  cy.get(".modal-footer > :nth-child(2)")
    .contains("Save")
    .click();
};

describe("1. Check to ensure the Dashboard Page's components behave appropriately.", () => {
  // add a device before testing the device page
  it("1.1 After successful login, navigate to the Dashboard page and CPU widgets", () => {
    login();
    addModal(1);
    cy.contains("Usage").should("be.visible");
    cy.contains("Number of Processes").should("be.visible");
    cy.contains("Threads Sleeping").should("be.visible");
    cy.contains("Timestamp").should("be.visible");
    cy.get(".ms-3")
      .contains("Clear Dashboard")
      .click();
  });
  it("1.2 After successful login, navigate to the Dashboard page and Additional CPU widgets", () => {
    login();
    addModal(2);
    cy.contains("Base Speed").should("be.visible");
    cy.contains("Number Of Cores").should("be.visible");
    cy.contains("Number Of Processors").should("be.visible");
    cy.contains("Number Of Sockets").should("be.visible");
    cy.get(".ms-3")
      .contains("Clear Dashboard")
      .click();
  });
  it("1.3 After successful login, navigate to the Dashboard page and Memory widgets", () => {
    login();
    addModal(3);
    cy.contains("In Use").should("be.visible");
    cy.contains("Available").should("be.visible");
    cy.contains("Cached").should("be.visible");
    cy.contains("Timestamp").should("be.visible");
    cy.get(".ms-3")
      .contains("Clear Dashboard")
      .click();
  });
  it("1.4 After successful login, navigate to the Dashboard page and Additional Memory widgets", () => {
    login();
    addModal(4);
    cy.contains("Max Size").should("be.visible");
    cy.contains("Form Factor").should("be.visible");
    cy.get(".ms-3")
      .contains("Clear Dashboard")
      .click();
  });
  it("1.5 After successful login, navigate to the Dashboard page and Disk widgets", () => {
    login();
    addModal(5);
    cy.contains("Partition Path").should("be.visible");
    cy.contains("Partition Percentage").should("be.visible");
    cy.contains("Reponse Time").should("be.visible");
    cy.contains("Read Time").should("be.visible");
    cy.contains("Write Time").should("be.visible");
    cy.contains("Timestamp").should("be.visible");
    cy.get(".ms-3")
      .contains("Clear Dashboard")
      .click();
  });
  it("1.6 After successful login, navigate to the Dashboard page and Disk widgets", () => {
    login();
    addModal(6);
    cy.contains("Capacity").should("be.visible");
    cy.contains("Type").should("be.visible");
    cy.contains("Model").should("be.visible");
    cy.contains("Size").should("be.visible");
    cy.get(".ms-3")
      .contains("Clear Dashboard")
      .click();
  });
  it("1.7 After successful login, navigate to the Dashboard page and Disk widgets", () => {
    login();
    addModal(7);
    cy.contains("Send Speed").should("be.visible");
    cy.contains("Receive Speed").should("be.visible");
    cy.contains("Signal Strength").should("be.visible");
    cy.contains("Timestamp").should("be.visible");
    cy.get(".ms-3")
      .contains("Clear Dashboard")
      .click();
  });
  it("1.8 After successful login, navigate to the Dashboard page and Disk widgets", () => {
    login();
    addModal(8);
    cy.contains("Adapter Name").should("be.visible");
    cy.contains("SSID").should("be.visible");
    cy.contains("Connection Type").should("be.visible");
    cy.contains("IPV4 Address").should("be.visible");
    cy.contains("IPV6 Address").should("be.visible");
    cy.get(".ms-3")
      .contains("Clear Dashboard")
      .click();
  });
});
