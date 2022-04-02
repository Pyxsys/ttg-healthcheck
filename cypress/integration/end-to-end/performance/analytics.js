/* eslint-disable jest/expect-expect */
Cypress.env();
import checkPageLoadTime from "./common/checkPageLoadTime";
import {
  lighthouseThreshold,
  lighthouseConfig
} from "./common/lighthouseThresholds";
import { runLogin } from "./common/runLogin";
import { loginAndNavigate } from "./common/loginAndNavigate";

const testUser = {
  name: "test23",
  password: Cypress.env("test_password"),
  email: "cypress@gmail.com"
};

describe("1. LightHouse", () => {
  it("1.1 dashboard Page", () => {
    cy.visit("/");
    runLogin();
    cy.visit("/dashboard");
    cy.lighthouse(lighthouseThreshold, lighthouseConfig);
  });
});

describe("2. Check to ensure that the various pages related to login load in a reasonable amount of time.", () => {
  it("2.1 Checks to ensure that the dashboard loads in in under 3000 milliseconds.", () => {
    loginAndNavigate("/analytics")
      .its("performance")
      .then(performance => {
        cy.viewport(1920, 1200);
        cy.get(".gx-4 > :nth-child(1)")
          .find("input")
          .should("be.visible");
        cy.get(".gx-4 > :nth-child(1)")
          .find("table")
          .should("be.visible")
          .contains("223ECC81-7069-45F9-9309-C641EBA776C8")
          .should("be.visible");
        cy.get(".gx-4 > :nth-child(1)")
          .contains("Overworked CPU Devices")
          .should("be.visible");

        cy.get(".gx-4 > :nth-child(2)")
          .find("input")
          .should("be.visible");
        cy.get(".gx-4 > :nth-child(2)")
          .find("table")
          .should("be.visible")
          .contains("223ECC81-7069-45F9-9309-C641EBA776C8")
          .should("be.visible");
        cy.get(".gx-4 > :nth-child(2)")
          .contains("Overworked Memory Devices")
          .should("be.visible");

        cy.get(".gx-4 > :nth-child(3)")
          .find("input")
          .should("be.visible");
        cy.get(".gx-4 > :nth-child(3)")
          .find("table")
          .should("be.visible")
          .contains("223ECC81-7069-45F9-9309-C641EBA776C8")
          .should("be.visible");
        cy.get(".gx-4 > :nth-child(3)")
          .contains("Network Speed Monitoring")
          .should("be.visible");

        cy.get(".analytics-details-wrapper").scrollTo("bottom");

        cy.get(".analytics-accordion.analytics-accordion-padding")
          .find(".graph-accordion-body > :nth-child(1) > :nth-child(1)")
          .find(".settings-body-wrapper > :nth-child(2)")
          .should("be.visible");

        cy.get(".analytics-accordion.analytics-accordion-padding")
          .find(".graph-accordion-body > :nth-child(1) > :nth-child(1)")
          .find(".settings-body-wrapper > :nth-child(4)")
          .should("be.visible");

        cy.get(".analytics-accordion.analytics-accordion-padding")
          .find(".graph-accordion-body > :nth-child(1) > :nth-child(1)")
          .find(".settings-body-wrapper > :nth-child(6)")
          .should("be.visible");

        cy.get(".analytics-accordion.analytics-accordion-padding")
          .find(".graph-accordion-body > :nth-child(1) > :nth-child(2)")
          .should("be.visible");

        cy.get(".analytics-accordion.analytics-accordion-padding")
          .find(
            ".graph-accordion-body > :nth-child(2) > .analytics-accordion-padding"
          )
          .should("be.visible")

          .then(() => performance.mark("end-loading"))
          .then(() => {
            checkPageLoadTime(performance, 3000);
          });
      });
  });
});
