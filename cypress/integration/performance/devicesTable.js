/* eslint-disable jest/expect-expect */
Cypress.env();
import runLogin from './common/runLogin'
import checkPageLoadTime from './common/checkPageLoadTime'
import {lighthouseThreshold, lighthouseConfig} from './common/lighthouseThresholds'

const testUser = {
  name: "test2",
  password: Cypress.env("test_password"),
  email: "cypress@gmail.com"
};



describe("1. LightHouse", () => {
  it("1.1 Devices Page", () => {
    cy.visit("/");

    cy.get("input[name=email1]").type(testUser.email);
    cy.get("input[name=password1]").type(testUser.password);
    cy.get("button[type=submit]").click();
    cy.get("div[class=hamburger-react]").click();
    cy.get('a[href*="/devices"]').click();

    cy.lighthouse(lighthouseThreshold, lighthouseConfig);
  });
});

// Check to ensure that the various components on the device page are properly loaded.
describe("Test 1: Check to ensure that the various components on the device page are properly loaded.", () => {
  it("Test 1.1: Checks to ensure that the devices table loads in under 4000 milliseconds.", () => {
    // Go to login page
    cy.visit("/", {
      onBeforeLoad: win => {
        win.performance.mark("start-loading");
      }
    })
      .its("performance")
      .then(performance => {runLogin()});

    cy.visit("/devices", {
      onBeforeLoad: win => {
        win.performance.mark("start-loading");
      }
    })
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

  it("Test 1.1: Checks to ensure that a devices table loads in under 4000 milliseconds.", () => {
    // Go to login page
    cy.visit("/", {
      onBeforeLoad: win => {
        win.performance.mark("start-loading");
      }
    })
      .its("performance")
      .then(performance => {runLogin()});

    cy.visit("/devices", {
      onBeforeLoad: win => {
        win.performance.mark("start-loading");
      }
    })
      .its("performance")
      .then(performance => {
        cy.get(
          ":nth-child(1) > :nth-child(1) > .devices-uuid-text > .text-white"
        )
          .click("left")
          .get(':nth-child(1) > [style="font-style: italic;"]')
          .should("be.visible")
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
          .then(() => {checkPageLoadTime(performance, 4000)});
      });
  });
});
