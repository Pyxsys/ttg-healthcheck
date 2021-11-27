/* eslint-disable jest/expect-expect */
Cypress.env();
const testUser = {
  name: "test2",
  password: Cypress.env("test_password"),
  email: "selenium@gmail.com"
};

// Check to ensure that the various pages related to login load in a reasonable amount of time.
describe("Test 1: Check to ensure that the various pages related to login load in a reasonable amount of time.", () => {
  it("Test 1.1: Make sure that the login page load in under 3000ms.", () => {
    // Go to login page
    cy.visit("/", {
      onBeforeLoad: win => {
        win.performance.mark("start-loading");
      }
    })
      .its("performance")
      .then(performance => {
        //Ensure all appropriate fields have loaded
        cy.contains("Email Address").should("be.visible");
        cy.contains("Password").should("be.visible");
        cy.contains("Login").should("be.visible");
        cy.contains("Signup")
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

  it("Test 1.2: Checks to ensure that the devices loads in in under 2000 milliseconds.", () => {
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
        cy.get("button[id=react-burger-menu-btn]").click();
      });

    cy.visit("/devices", {
      onBeforeLoad: win => {
        win.performance.mark("start-loading");
      }
    })
      .its("performance")
      .then(performance => {
        cy.get("table")
          .should("have.class", "table table-bordered")
          .should("be.visible")

          .then(() => performance.mark("end-loading"))
          .then(() => {
            performance.measure("pageLoad", "start-loading", "end-loading");
            const measure = performance.getEntriesByName("pageLoad")[0];
            const duration = measure.duration;
            assert.isAtMost(duration, 2000);
          });
      });
  });

  it("Test 1.3: Checks to ensure that the dashboard loads in in under 2000 milliseconds.", () => {
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
        cy.get("button[id=react-burger-menu-btn]").click();
      });

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
          .then(() => {
            performance.measure("pageLoad", "start-loading", "end-loading");
            const measure = performance.getEntriesByName("pageLoad")[0];
            const duration = measure.duration;
            assert.isAtMost(duration, 2000);
          });
      });
  });
});
