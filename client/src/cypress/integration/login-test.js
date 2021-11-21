/* eslint-disable jest/expect-expect */

// Sample Test.
describe('login', () => {
  it('Sample test', () => {
    cy.visit('/');
    cy.contains('LOGIN').should('be.visible');
  });
});
