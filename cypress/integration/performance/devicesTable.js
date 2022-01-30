/* eslint-disable jest/expect-expect */
Cypress.env();
import runLogin from './common/runLogin'
import checkPageLoadTime from './common/checkPageLoadTime'
import {lighthouseThreshold, lighthouseConfig} from './common/lighthouseThresholds'
import { loginAndNavigate } from './common/loginAndNavigate';

describe("1. LightHouse", () => {
  it("1.1 Devices Page", () => {
    cy.visit("/");

    runLogin();
    cy.get("div[class=hamburger-react]").click();
    cy.get('a[href*="/devices"]').click();

    cy.lighthouse(lighthouseThreshold, lighthouseConfig);
  });
});

// Check to ensure that the various components on the device page are properly loaded.
describe("2. Check to ensure that the various components on the device page are properly loaded.", () => {
  it("2.1 Checks to ensure that the devices table loads in under 4000 milliseconds.", () => {
    loginAndNavigate("/devices")
      .its("performance")
      .then(performance => {
        cy.get("table")
          .should(
            "have.class",
            "cerebellum-table table-striped text-white overflow-auto w-100 m-1"
          )
          .should("be.visible")
          .find("tr")
          .should("be.visible")
          .then(() => performance.mark("end-loading"))
          .then(() => { checkPageLoadTime(performance,4000)});
      });
  });
});
