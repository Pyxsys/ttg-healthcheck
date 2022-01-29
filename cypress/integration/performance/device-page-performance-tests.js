/* eslint-disable jest/expect-expect */
Cypress.env();
const testUser = {
  name: "test2",
  password: Cypress.env("test_password"),
  email: "cypress@gmail.com"
};

// These can be changed per case directly in the function call
const lighthouseThreshold = {
  performance: 70,
  accessibility: 90,
  "best-practices": 85,
  seo: 85,
  pwa: 60
};

const lighthouseConfig = {
  formFactor: "desktop",
  screenEmulation: {
    mobile: false,
    disabled: true
  }
};

describe("1. LightHouse Tests", () => {
  it("1.1 Landing Page", () => {
    cy.visit("/");
    cy.lighthouse(lighthouseThreshold, lighthouseConfig);
  });
  it("1.2 Devices Page", () => {
    cy.visit("/");

    cy.get("input[name=email1]").type(testUser.email);
    cy.get("input[name=password1]").type(testUser.password);
    cy.get("button[type=submit]").click();
    cy.get("div[class=hamburger-react]").click();
    cy.get('a[href*="/devices"]').click();

    cy.lighthouse(lighthouseThreshold, lighthouseConfig);
  });
  it("1.3 Landing Page", () => {
    cy.visit("/");

    cy.get("input[name=email1]").type(testUser.email);
    cy.get("input[name=password1]").type(testUser.password);
    cy.get("button[type=submit]").click();
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
describe("Test 1: Check to ensure that the various components on the device page are properly loaded.", () => {
  it("Test 1.1: Checks to ensure that the devices table loads in under 4000 milliseconds.", () => {
    // Go to login page
    cy.visit("/", {
      onBeforeLoad: win => {
        win.performance.mark("start-loading");
      }
    })
      .its("performance")
      .then(performance => {
        cy.get("input[name=email1]").type(testUser.email);
        cy.get("input[name=password1]").type(testUser.password);
        cy.get("button[type=submit]").click();
        cy.get("div[class=hamburger-react]").click();
      });

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
          .then(() => {
            performance.measure("pageLoad", "start-loading", "end-loading");
            const measure = performance.getEntriesByName("pageLoad")[0];
            const duration = measure.duration;
            assert.isAtMost(duration, 4000);
          });
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
      .then(performance => {
        cy.get("input[name=email1]").type(testUser.email);
        cy.get("input[name=password1]").type(testUser.password);
        cy.get("button[type=submit]").click();
        cy.get("div[class=hamburger-react]").click();
      });

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
          .then(() => {
            performance.measure("pageLoad", "start-loading", "end-loading");
            const measure = performance.getEntriesByName("pageLoad")[0];
            const duration = measure.duration;
            assert.isAtMost(duration, 4000);
          });
      });
  });
});
