/* eslint-disable jest/expect-expect */
Cypress.env();
import checkPageLoadTime from "./common/checkPageLoadTime";
import {
  lighthouseThreshold,
  lighthouseConfig
} from "./common/lighthouseThresholds";
import { runLogin } from "./common/runLogin";
import { loginAndNavigate } from "./common/loginAndNavigate";

describe("1. LightHouse", () => {
  it("1.1 Device Detail Page", () => {
    cy.visit("/");
    runLogin();

    cy.get("div[class=hamburger-react]").click();
    cy.get('a[href*="/devices"]').click();
    cy.wait(1000);
    cy.get('a[href*="/device"]')
      .eq(1)
      .click("left");

    cy.lighthouse(lighthouseThreshold, lighthouseConfig);
  });
});

// Check to ensure that the various components on the device page are properly loaded.
describe("2 Check to ensure that the various components on the device detail page are properly loaded.", () => {
  it("2.1 Checks to ensure that the devices detail page loads in under 5000 milliseconds.", () => {
    loginAndNavigate("/devices")
      .its("performance")
      .then(performance => {
        cy.get(
          ":nth-child(1) > :nth-child(1) > .devices-uuid-text > .text-white"
        )
          .click("left")
          .get(":nth-child(1) > svg")
          .should("be.visible")
          .get(":nth-child(2) > svg")
          .should("be.visible")
          .get(":nth-child(3) > svg")
          .should("be.visible")
          .get(":nth-child(4) > svg")
          .should("be.visible")
          .get(".device-details-tabs")
          .should("be.visible")
          .then(() => performance.mark("end-loading"))
          .then(() => {
            checkPageLoadTime(performance, 5000);
          });
      });
  });
});
