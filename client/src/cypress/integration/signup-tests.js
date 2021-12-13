/* eslint-disable jest/expect-expect */
Cypress.env();
const testUser = {
  name: 'test2',
  password: Cypress.env('test_password'),
  email: 'selenium@gmail.com',
};

// See if certain headers and labels and buttons are visible.
describe('Test 1: See if certain headers and labels and buttons are visible.', () => {
  it('Test 1.1: Check to see if the placeholder \'Full Name\' is visible in the application', () => {
    // Go to login page
    cy.visit('/signup');

    // Assert that the following writing can be seen by the user.
    cy.get('input[name="name"]')
        .invoke('attr', 'placeholder')
        .should('contain', 'Full Name');
  });
  it('Test 1.2: Check to see if the placeholder \'Email\' is visible in the application', () => {
    // Go to login page
    cy.visit('/signup');

    // Assert that the following writing can be seen by the user.
    cy.get('input[name="email"]')
        .invoke('attr', 'placeholder')
        .should('contain', 'Email');
  });
  it('Test 1.3: Check to see if the placeholder \'Choose Password\' is visible in the application', () => {
    // Go to login page
    cy.visit('/signup');

    // Assert that the following writing can be seen by the user.
    cy.get('input[name="password"]')
        .invoke('attr', 'placeholder')
        .should('contain', 'Choose Password');
  });
  it('Test 1.4: Check to see if the placeholder \'Confirm Password\' is visible in the application', () => {
    // Go to login page
    cy.visit('/signup');

    // Assert that the following writing can be seen by the user.
    cy.get('input[name="password2"]')
        .invoke('attr', 'placeholder')
        .should('contain', 'Confirm Password');
  });
  it('Test 1.3: Check to see if the button \'Register\' is visible in the application', () => {
    // Go to login page
    cy.visit('/signup');

    // Assert that the following writing can be seen by the user.
    cy.contains('Register').should('be.visible');
  });
  it('Test 1.5: Check to see if the button \'Back\' is visible in the application', () => {
    // Go to login page
    cy.visit('/signup');

    // Assert that the following writing can be seen by the user.
    cy.contains('Back').should('be.visible');
  });
});
