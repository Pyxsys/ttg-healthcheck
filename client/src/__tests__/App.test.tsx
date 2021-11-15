import {Builder, WebDriver, By, Key, until} from 'selenium-webdriver';
const chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;

chrome.setDefaultService(new chrome.ServiceBuilder(path).build());

describe('LoginTest', () => {
  let driver: WebDriver;
  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });
  afterEach(async () => {
    await driver.close();
  });
  afterAll(async () => {
    await driver.quit();
  });
  it('go to google website, search webdriver', async () => {
    await driver.get('http://www.google.com/ncr');
    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  });
});
