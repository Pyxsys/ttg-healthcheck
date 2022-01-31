Cypress.env();

const testCredentials = {
  passwordInput: 'input[name="password"]',
  passwordValue: 'Password',
  passwordInpute2: 'input[name="password2"]',
  passwordValue: 'Confirm Password',
};

const validatePlaceholder = (input, term) => {
  cy.get(`${input}`)
    .invoke("attr", "placeholder")
    .should("contain", `${term}`);
};

// See if certain headers and labels and buttons are visible.
describe("1. See if certain headers and labels and buttons are visible.", () => {
  before(() => {
    const signupPage = "/signup";
    cy.visit(signupPage);
  });

  it("1.1 Check to see if the placeholder 'Full Name' is visible in the application", () => {
    const nameInput = 'input[name="name"]';
    const nameValue = "Full Name";
    // Assert that the following writing can be seen by the user.
    validatePlaceholder(nameInput, nameValue);
  });
  it("1.2 Check to see if the placeholder 'Email' is visible in the application", () => {
    const emailInput = 'input[name="email"]';
    const emailValue = "Email";
    // Assert that the following writing can be seen by the user.
    validatePlaceholder(emailInput, emailValue);
  });
  it("1.3 Check to see if the placeholder 'Choose Password' is visible in the application", () => {
    const passwordInput = testCredentials.passwordInput;
    const passwordValue = testCredentials.passwordValue;
    // Assert that the following writing can be seen by the user.
    validatePlaceholder(passwordInput, passwordValue);
  });
  it("1.4 Check to see if the placeholder 'Confirm Password' is visible in the application", () => {
    const password2Input = testCredentials.passwordInput2;
    const password2Value = testCredentials.passwordValue2;
    // Assert that the following writing can be seen by the user.
    validatePlaceholder(password2Input, password2Value);
  });
  it("1.5 Check to see if the button 'Register' is visible in the application", () => {
    const registerButton = "Register";
    // Assert that the following writing can be seen by the user.
    cy.contains(registerButton).should("be.visible");
  });
  it("1.6 Check to see if the button 'Back' is visible in the application", () => {
    const backButton = "Back";
    // Assert that the following writing can be seen by the user.
    cy.contains(backButton).should("be.visible");
  });
});
