/* eslint-disable jest/expect-expect */
Cypress.env();
const testUser = {
  name: 'test2',
  password: Cypress.env('test_password'),
  email: 'selenium@gmail.com',
};
const invalidUser = {
  name: 'random',
  password: Cypress.env('test_password'),
  email: 'invalidemail@gmail.com',
};

const validatePlaceholder = (input, term) => {
  cy.get(`${input}`).invoke('attr', 'placeholder').should('contain', `${term}`);
};

// See if certain headers and labels and buttons are visible.
describe('Test 1: See if certain headers and labels and buttons are visible.', () => {
  beforeAll(() =>{
    const loginPage = '/';
    cy.visit(loginPage);
  });

  it('Test 1.1: Check to see if the header \'Log in to launch your dashboard\' is visible in the application.', () => {
    const dashHeader = 'Log in to launch your dashboard';
    // Assert that the following writing can be seen by the user.
    cy.contains(dashHeader).should('be.visible');
  });
  it('Test 1.2: Check to see if the placeholder \'Email\' is visible in the application', () => {
    const emailInput = 'input[name="email1"]';
    const emailValue = 'Email';
    // Assert that the following writing can be seen by the user.
    validatePlaceholder(emailInput, emailValue);
  });
  it('Test 1.3: Check to see if the placeholder \'Password\' is visible in the application', () => {
    const passwordInput = 'input[name="password1"]';
    const passwordValue = 'Password';
    // Assert that the following writing can be seen by the user.
    validatePlaceholder(passwordInput, passwordValue);
  });
  it('Test 1.4: Check to see if the button \'Login\' is visible in the application', () => {
    const loginButton = 'Login';
    // Assert that the following writing can be seen by the user.
    cy.contains(loginButton).should('be.visible');
  });
  it('Test 1.5: Check to see if the button \'Register\' is visible in the application', () => {
    const registerButton = 'Register';
    // Assert that the following writing can be seen by the user.
    cy.contains(registerButton).should('be.visible');
  });
});

// Check to see if the buttons try to redirect us to the proper urls.
describe('Test 2: Check to see if the buttons try to redirect us to the proper urls.', () => {
  it('Test 2.1: Click on Register button and see if it redirects us to Signup page.', () => {
    // Go to login page
    cy.visit('/');

    // Click Signup Button.
    cy.contains('button', 'Register').click();
    // Assert we are in /signup
    cy.url().should('equal', 'http://localhost:3000/signup');
  });
});

// Make sure error notifications show messages when needed and that the message is appropirate.
describe('Test 3: Make sure error notifications show messages when needed and that the message is appropirate.', () => {
  it('Test 3.1: Make sure that notifications are shown when empty emails are caught and that the message is accurate.', () => {
    // Go to login page
    cy.visit('/');
    // Initalize inputs with empty email and valid password.
    cy.get('input[name=password1]').type(testUser.password);
    // Click on Login.
    cy.get('button[type=submit]').click();

    // Make sure error notification popped up
    cy.contains(
        '.Toastify',
        'Invalid Email! The email you have entered is either empty or too long!',
    );
    // Assert we are in still in login
    cy.url().should('equal', 'http://localhost:3000/');
  });
  it('Test 3.2: Make sure that notifications are shown when empty passwords are caught and that the message is accurate.', () => {
    // Go to login page
    cy.visit('/');
    // Initalize inputs with valid email and empty password.
    cy.get('input[name=email1]').type(testUser.email);
    // Click on Login.
    cy.get('button[type=submit]').click();

    // Make sure error notification popped up
    cy.contains(
        '.Toastify',
        'Invalid Password! The password you have entered is either empty or too long!',
    );
    // Assert we are in still in login
    cy.url().should('equal', 'http://localhost:3000/');
  });
  it('Test 3.3: Make sure that notifications are shown when an invalid login attempt is made.', () => {
    // Go to login page
    cy.visit('/');
    // Initalize inputs with invalid email and password.
    cy.get('input[name=email1]').type(invalidUser.email);
    cy.get('input[name=password1]').type(invalidUser.password);
    // Click on Login.
    cy.get('button[type=submit]').click();

    // Make sure error notification popped up
    cy.contains(
        '.Toastify',
        'Invalid Email or Password! Either the email or password you have entered is invalid!',
    );
    // Assert we are in still in login
    cy.url().should('equal', 'http://localhost:3000/');
  });
});
