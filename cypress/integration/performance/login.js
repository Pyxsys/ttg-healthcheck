/* eslint-disable jest/expect-expect */
Cypress.env();
import runLogin from './common/runLogin'
import checkPageLoadTime from './common/checkPageLoadTime'
import {lighthouseThreshold, lighthouseConfig} from './common/lighthouseThresholds'


describe("1. LightHouse", () => {
  it("1.1 Landing Page", () => {
    cy.visit("/");
    cy.lighthouse(lighthouseThreshold, lighthouseConfig);
  });
});

// Check to ensure that the various pages related to login load in a reasonable amount of time.
describe("2. Check to ensure that the various pages related to login load in a reasonable amount of time.", () => {
  it("2.1 Make sure that the login page load in under 3000ms.", () => {
    // Go to login page
    cy.visit("/", {
      onBeforeLoad: win => {
        win.performance.mark("start-loading");
      }
    })
      .its("performance")
      .then(performance => {
        //Ensure all appropriate fields have loaded
        cy.get("input[name=email1]").should("be.visible");
        cy.get("input[name=password1]").should("be.visible");
        cy.get("button")
          .contains("Login")
          .should("be.visible");
        cy.get("button")
          .contains("Register")
          .should("be.visible")

          .then(() => performance.mark("end-loading"))
          .then(() => {
            performance.measure("pageLoad", "start-loading", "end-loading");
            const measure = performance.getEntriesByName("pageLoad")[0];
            const duration = measure.duration;
            assert.isAtMost(duration, 3000);
          });
      });
  });
});
