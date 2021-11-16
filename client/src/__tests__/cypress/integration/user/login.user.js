/* eslint-disable jest/expect-expect */
const testUser = {
  name: 'test',
  password: 'test',
  email: 'selenium@gmail.com',
  role: 'user',
};

describe('Landing Page Test', () => {
  it('open the landing page and verify the url', () => {
    // open the landing page
    cy.visit('/');

    // assert the url is correct
    cy.url().should('include', 'localhost:3000');
  });
});

describe('Login Page', () => {
  it('log in user with credentials and click submit then verify we are in /dashboard page', () => {
    // open the landing page
    cy.visit('/');

    cy.get('input[name=email]').type(testUser.email);
    cy.get('input[name=password]').type(testUser.password);
    cy.get('button[type=submit]').click();

    // assert we are in /dashboard
    cy.url().should('include', 'dashboard');

    //     await driver.wait(
    //         until.elementLocated(By.className('text-center')),
    //         5 * 1000,
    //     );
    //     await driver.findElement(By.name('email')).sendKeys('selenium@gmail.com');
    //     await driver.findElement(By.name('password')).sendKeys('test');
    //     await driver
    //         .findElement(By.css('Button[type=\'submit\']'))
    //         .sendKeys(Key.RETURN);
    //     await driver.wait(until.elementLocated(By.id('page-wrap')), 5 * 1000);
    //     const message = await driver.findElement(By.id('page-wrap')).getText();
    //     expect(message).toBe('dashboard');
  });
});
