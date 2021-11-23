/* eslint-disable jest/expect-expect */
const testUser = {
  name: 'test2',
  password: 'test',
  email: 'selenium@gmail.com',
};

// See if certain headers and labels and buttons are visible.
describe('Test 1: See if certain headers and labels and buttons are visible.', () => {
  it('Test 1.1: Check to see if the header \'SIGNUP\' is visible in the application.', () => {
    // Go to login page
    cy.visit('/signup');

    // Assert that the following writing can be seen by the user.
    cy.contains('SIGNUP').should('be.visible');
  });
  it('Test 1.2: Check to see if the Label \'Email Address\' is visible in the application', () => {
    // Go to login page
    cy.visit('/signup');

    // Assert that the following writing can be seen by the user.
    cy.contains('Email Address').should('be.visible');
  });
  it('Test 1.3: Check to see if the Label \'Password\' is visible in the application', () => {
    // Go to login page
    cy.visit('/signup');

    // Assert that the following writing can be seen by the user.
    cy.contains('Password').should('be.visible');
  });
  it('Test 1.4: Check to see if the button \'Signup\' is visible in the application', () => {
    // Go to login page
    cy.visit('/signup');

    // Assert that the following writing can be seen by the user.
    cy.contains('Signup').should('be.visible');
  });
  it('Test 1.5: Check to see if the button \'Back\' is visible in the application', () => {
    // Go to login page
    cy.visit('/signup');

    // Assert that the following writing can be seen by the user.
    cy.contains('Back').should('be.visible');
  });
});
