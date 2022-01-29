/* eslint-disable jest/expect-expect */
Cypress.env();
import runLogin from './common/runLogin'
import checkPageLoadTime from './common/checkPageLoadTime'
import {lighthouseThreshold, lighthouseConfig} from './common/lighthouseThresholds'


describe("1. LightHouse", () => {
    it("1.1 dashboard Page", () => {
      cy.visit("/");

      cy.get("input[name=email1]").type(testUser.email);
      cy.get("input[name=password1]").type(testUser.password);
      cy.get("button[type=submit]").click();
      cy.visit("/dashboard");


      cy.lighthouse(lighthouseThreshold, lighthouseConfig);
    });
});

describe("2. Check to ensure that the various pages related to login load in a reasonable amount of time.", () => {
    it("2.1 Checks to ensure that the dashboard loads in in under 2000 milliseconds.", () => {
        // Go to login page
        cy.visit("/", {
          onBeforeLoad: win => {
            win.performance.mark("start-loading");
          }
        })
          .its("performance")
          .then(performance => {runLogin()});
    
        cy.visit("/dashboard", {
          onBeforeLoad: win => {
            win.performance.mark("start-loading");
          }
        })
          .its("performance")
          .then(performance => {
            cy.get("div")
              .contains("dashboard", { matchCase: false })
    
              .then(() => performance.mark("end-loading"))
              .then(() => {checkPageLoadTime(performance, 2000)});
          });
      });
});
