Cypress.env();
const testUser = {
  name: "test7",
  password: Cypress.env("test_password"),
  email: "cypress@gmail.com"
};

const login = () => {
  cy.visit("/");
  cy.get("input[name=email1]").type(testUser.email);
  cy.get("input[name=password1]").type(testUser.password);
  cy.get("button[type=submit]").click();
};

describe("1. Check to ensure the Devices Page's components behave appropriately.", () => {
  it("1.1  Anlytics page, ensure the thresholds function properly", () => {
    login();

    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/analytics"]').click();

    cy.get(
      ":nth-child(1) > .analytics-accordion > .accordion > .analytics-accordion-item > .accordion-collapse > .flex-grow-1 > .flex-column > :nth-child(1) > .border-bottom > .form-control"
    )
      .clear()
      .type("50");
    cy.get(
      ":nth-child(1) > .analytics-accordion > .accordion > .analytics-accordion-item > .accordion-collapse > .flex-grow-1 > .flex-column > .mb-2 > .border-bottom"
    ).contains('Devices Above 50');

    cy.get(
      ":nth-child(2) > .analytics-accordion > .accordion > .analytics-accordion-item > .accordion-collapse > .flex-grow-1 > .flex-column > :nth-child(1) > .border-bottom > .form-control"
    )
      .clear()
      .type("50");
    cy.get(
      ":nth-child(2) > .analytics-accordion > .accordion > .analytics-accordion-item > .accordion-collapse > .flex-grow-1 > .flex-column > .mb-2 > .border-bottom"
    ).contains('Devices Above 50');

    cy.get(
      ":nth-child(3) > .analytics-accordion > .accordion > .analytics-accordion-item > .accordion-collapse > .flex-grow-1 > .flex-column > :nth-child(1) > .border-bottom > .form-control"
    )
      .clear()
      .type("50");
    cy.get(
      ":nth-child(3) > .analytics-accordion > .accordion > .analytics-accordion-item > .accordion-collapse > .flex-grow-1 > .flex-column > .mb-2 > .border-bottom"
    ).contains('Devices Above 50');
  });
  it("1.2  Anlytics page, ensure the graphs function properly", () => {
    login();

    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/analytics"]').click();

    cy.get(".settings-body-wrapper > :nth-child(2)").select(1);
    cy.get(".settings-body-wrapper > :nth-child(4)").select(1);
    cy.get(".settings-body-wrapper > :nth-child(6)").select(1);
    cy.get(".analytics-details-wrapper").scrollTo("bottom");
    cy.get("svg")
      .find(".bx--cc--line")
      .should("be.visible");
  });
  it("1.3  Anlytics page, ensure Selected Metric works for all options.", () => {
    login();

    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/analytics"]').click();

    cy.get(".settings-body-wrapper > :nth-child(4)").select(1);
    cy.get(".analytics-details-wrapper").scrollTo("bottom");
    cy.get('p[class="title"]')
      .contains("CPU Usage")
      .should("be.visible");

    cy.get(".settings-body-wrapper > :nth-child(4)").select(2);
    cy.get(".analytics-details-wrapper").scrollTo("bottom");
    cy.get('p[class="title"]')
      .contains("Memory Usage")
      .should("be.visible");
  });
  it("1.4 Anlytics page, ensure Overworked CPU Devices works well.", () => {
    login();

    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/analytics"]').click();

    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(1)')
      .contains('Change Threshold').should("be.visible");
    
    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(1)')
      .contains('Devices Above').should("be.visible");
    
    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(1)')
      .contains('Name').should("be.visible");

    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(1)')
      .contains('aggregatedPercentage').should("be.visible");

    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(1)')
      .find('input')
      .clear()
      .type('100')

    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(1)')
      .contains('100').should("be.visible");

    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(1)')
      .contains('0').should("be.visible");

  });
  it("1.5 Anlytics page, ensure Overworked Memory Devices works well.", () => {
    login();

    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/analytics"]').click();

    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(2)')
      .contains('Change Threshold').should("be.visible");
    
    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(2)')
      .contains('Devices Above').should("be.visible");
    
    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(2)')
      .contains('Name').should("be.visible");

    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(2)')
      .contains('aggregatedPercentage').should("be.visible");

    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(2)')
      .find('input')
      .clear()
      .type('100')

    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(2)')
      .contains('100').should("be.visible");

    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(2)')
      .contains('0').should("be.visible");

  });
  it("1.6  Anlytics page, ensure Nerwork Speed Monitoring works well.", () => {
    login();

    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/analytics"]').click();

    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(3)')
      .contains('Change Threshold').should("be.visible");
    
    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(3)')
      .contains('Devices Above').should("be.visible");
    
    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(3)')
      .contains('Name').should("be.visible");

    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(3)')
      .contains('sendSpeed').should("be.visible");

    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(3)')
      .find('input')
      .clear()

    cy.get("div[class=analytics-details-wrapper]")
      .find('div[class=col] > :nth-child(1) > :nth-child(3)')
      .contains('0').should("be.visible");

  });
  it("1.7 After successful login, navigate to the analytics page and ensure all widget headers are visible.", () => {
    login();

    // open navbar
    cy.get('div[class="hamburger-react"]').click();

    // navigate to device detail page
    cy.get('a[href*="/analytics"]').click();

    cy.contains("Overworked CPU Devices")
      .should("be.visible");
    cy.contains("Overworked Memory Devices")
    .should("be.visible");
    cy.contains("Network Speed Monitoring")
      .should("be.visible");
  });
});
