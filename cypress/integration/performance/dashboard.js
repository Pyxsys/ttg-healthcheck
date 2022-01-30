/* eslint-disable jest/expect-expect */
Cypress.env();
import runLogin from './common/runLogin'
import checkPageLoadTime from './common/checkPageLoadTime'
import {lighthouseThreshold, lighthouseConfig} from './common/lighthouseThresholds'
import {loginAndNavigate} from './common/loginAndNavigate';

const testUser = {
    name: "test23",
    password: Cypress.env("test_password"),
    email: "cypress@gmail.com"
  };
  
describe("1. LightHouse", () => {
    it("1.1 dashboard Page", () => {
      cy.visit("/");
      runLogin()
      cy.visit("/dashboard");
      cy.lighthouse(lighthouseThreshold, lighthouseConfig);
      
    });
});

describe("2. Check to ensure that the various pages related to login load in a reasonable amount of time.", () => {
    it("2.1 Checks to ensure that the dashboard loads in in under 2000 milliseconds.", () => {
      loginAndNavigate("/dashboard")
          .its("performance")
          .then(performance => {
            cy.get("div")
              .contains("dashboard", { matchCase: false })
    
              .then(() => performance.mark("end-loading"))
              .then(() => {checkPageLoadTime(performance, 2000)});
          });
      });
});
