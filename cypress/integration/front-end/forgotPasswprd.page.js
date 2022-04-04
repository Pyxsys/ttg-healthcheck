/* eslint-disable jest/expect-expect */
Cypress.env();

const validatePlaceholder = (input, term) => {
  cy.get(`${input}`)
    .invoke("attr", "placeholder")
    .should("contain", `${term}`);
};

// See if certain headers and labels and buttons are visible.
describe("1. See if certain headers and labels and buttons are visible.", () => {
  before(() => {
    const forgotPassword = "/forgot-password";
    cy.visit(signupPage);
  });

  it("1.1 Check to see if all labels are present.", () => {
    // Assert that the following writing can be seen by the user.
    cy.contains("Send an email to reset you password")
    .should("be.visible");
    cy.contains("Email")
    .should("be.visible");
    cy.contains("Send Email")
      .should("be.visible");
    cy.contains("Back")
      .should("be.visible");
  });
});
