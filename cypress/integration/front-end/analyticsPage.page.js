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
  it("1.1 After successful login, navigate to the analytics page and ensure the thresholds function properly", () => {
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
  it("1.2 After successful login, navigate to the analytics page and ensure the graphs function properly", () => {
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
});
