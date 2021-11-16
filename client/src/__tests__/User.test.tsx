import {Builder, WebDriver, By, until, Key} from 'selenium-webdriver';
const chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;

chrome.setDefaultService(new chrome.ServiceBuilder(path).build());
let driver: WebDriver;
beforeEach(async () => {
  driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(
          new chrome.Options().addArguments(['--headless', '--no-sandbox']),
      )
      .build();
  await driver.get('http://localhost:3000');
});
afterEach(async () => {
  await driver.close();
});
afterAll(async () => {
  await driver.quit();
});

describe('login test', () => {
  it('log in user with credentials and click submit then verify we are in /dashboard page', async () => {
    await driver.wait(
        until.elementLocated(By.className('text-center')),
        5 * 1000,
    );
    await driver.findElement(By.name('email')).sendKeys('selenium@gmail.com');
    await driver.findElement(By.name('password')).sendKeys('test');
  });
});
