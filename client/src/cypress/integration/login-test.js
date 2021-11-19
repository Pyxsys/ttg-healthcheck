/* eslint-disable jest/expect-expect */

describe('login', () => {
  it('Sample test', () => {
    // Mount login component
    cy.visit('/');
    cy.contains('LOGIN').should('be.visible');
  });
});
