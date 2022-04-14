Cypress.env();

describe("Reset Password Page", () => {
  it("1.1 After visiting the reset password page, display key has expired", () => {
    cy.visit("/reset-password");

    cy.get("h1.pt-5.text-white > span").contains('Your link has expired')
  });
});
