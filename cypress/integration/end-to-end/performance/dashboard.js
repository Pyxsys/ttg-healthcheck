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

const addModal = index => {
  cy.get(
    'div[class="d-flex justify-content-center dashboard-dashed-box"]'
  ).click("left");
  cy.get("select").select(index);
  cy.get("input").type("38D3C9E3-AA46-9148-8470-63F469DB661B");
  cy.get(".modal-footer > :nth-child(2)")
    .contains("Save")
    .click();
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
  it("2.1 Checks to ensure that the dashboard loads in in under 2000 milliseconds.", () => {
    loginAndNavigate("/dashboard")
      .its("performance")
      .then(performance => {
        cy.get("div")
          .contains("dashboard", { matchCase: false })

          .then(() => performance.mark("end-loading"))
          .then(() => {
            checkPageLoadTime(performance, 2000);
          });
      });
  });
  it("2.2 After successful login, navigate to the Dashboard page and ensure that the CPU widgets loads in in under 2000 milliseconds.", () => {
    loginAndNavigate("/dashboard")
      .its("performance")
      .then(performance => {
        addModal(1);
        cy.contains("Usage").should("be.visible");
        cy.contains("Number of Processes").should("be.visible");
        cy.contains("Threads Sleeping").should("be.visible");
        cy.contains("Timestamp").should("be.visible");
        cy.get(".ms-3")
          .contains("Clear Dashboard")
          .click()
          .then(() => performance.mark("end-loading"))
          .then(() => {
            checkPageLoadTime(performance, 2000);
          });
      });
  });
  it("2.3 After successful login, navigate to the Dashboard page and ensure that the Additional CPU widgets loads in in under 2000 milliseconds.", () => {
    loginAndNavigate("/dashboard")
      .its("performance")
      .then(performance => {
        addModal(2);
        cy.contains("Base Speed").should("be.visible");
        cy.contains("Number Of Cores").should("be.visible");
        cy.contains("Number Of Processors").should("be.visible");
        cy.contains("Number Of Sockets").should("be.visible");
        cy.get(".ms-3")
          .contains("Clear Dashboard")
          .click()
          .then(() => performance.mark("end-loading"))
          .then(() => {
            checkPageLoadTime(performance, 2000);
          });
      });
  });
  it("2.4 After successful login, navigate to the Dashboard page and ensure that the Memory widgets loads in in under 2000 milliseconds.", () => {
    loginAndNavigate("/dashboard")
      .its("performance")
      .then(performance => {
        addModal(3);
        cy.contains("inUse").should("be.visible");
        cy.contains("Available").should("be.visible");
        cy.contains("Cached").should("be.visible");
        cy.contains("Timestamp").should("be.visible");
        cy.get(".ms-3")
          .contains("Clear Dashboard")
          .click()
          .then(() => performance.mark("end-loading"))
          .then(() => {
            checkPageLoadTime(performance, 2000);
          });
      });
  });
  it("2.5 After successful login, navigate to the Dashboard page and ensure that the Additional Memory widgets loads in in under 2000 milliseconds.", () => {
    loginAndNavigate("/dashboard")
      .its("performance")
      .then(performance => {
        addModal(4);
        cy.contains("Max Size").should("be.visible");
        cy.contains("Form Factor").should("be.visible");
        cy.get(".ms-3")
          .contains("Clear Dashboard")
          .click()
          .then(() => performance.mark("end-loading"))
          .then(() => {
            checkPageLoadTime(performance, 2000);
          });
      });
  });
  it("2.6 After successful login, navigate to the Dashboard page and ensure that the Disk widgets loads in in under 2000 milliseconds.", () => {
    loginAndNavigate("/dashboard")
      .its("performance")
      .then(performance => {
        addModal(5);
        cy.contains("Partition Path").should("be.visible");
        cy.contains("Partition Percentage").should("be.visible");
        cy.contains("Reponse Time").should("be.visible");
        cy.contains("Read Time").should("be.visible");
        cy.contains("Write Time").should("be.visible");
        cy.contains("Timestamp").should("be.visible");
        cy.get(".ms-3")
          .contains("Clear Dashboard")
          .click()
          .then(() => performance.mark("end-loading"))
          .then(() => {
            checkPageLoadTime(performance, 2000);
          });
      });
  });
  it("2.7 After successful login, navigate to the Dashboard page and ensure that the Additional Disk widgets loads in in under 2000 milliseconds.", () => {
    loginAndNavigate("/dashboard")
      .its("performance")
      .then(performance => {
        addModal(6);
        cy.contains("Capacity").should("be.visible");
        cy.contains("Type").should("be.visible");
        cy.contains("Model").should("be.visible");
        cy.contains("Size").should("be.visible");
        cy.get(".ms-3")
          .contains("Clear Dashboard")
          .click()
          .then(() => performance.mark("end-loading"))
          .then(() => {
            checkPageLoadTime(performance, 2000);
          });
      });
  });
  it("2.8 After successful login, navigate to the Dashboard page and ensure that the Network widgets loads in in under 2000 milliseconds.", () => {
    loginAndNavigate("/dashboard")
      .its("performance")
      .then(performance => {
        addModal(7);
        cy.contains("Send Speed").should("be.visible");
        cy.contains("Receive Speed").should("be.visible");
        cy.contains("Signal Strength").should("be.visible");
        cy.contains("Timestamp").should("be.visible");
        cy.get(".ms-3")
          .contains("Clear Dashboard")
          .click()
          .then(() => performance.mark("end-loading"))
          .then(() => {
            checkPageLoadTime(performance, 2000);
          });
      });
  });
  it("2.9 After successful login, navigate to the Dashboard page and ensure that the Additional Network widgets loads in in under 2000 milliseconds.", () => {
    loginAndNavigate("/dashboard")
      .its("performance")
      .then(performance => {
        addModal(8);
        cy.contains("Adapter Name").should("be.visible");
        cy.contains("SSID").should("be.visible");
        cy.contains("Connection Type").should("be.visible");
        cy.contains("IPV4 Address").should("be.visible");
        cy.contains("IPV6 Address").should("be.visible");
        cy.get(".ms-3")
          .contains("Clear Dashboard")
          .click()
          .then(() => performance.mark("end-loading"))
          .then(() => {
            checkPageLoadTime(performance, 2000);
          });
      });
  });
});
