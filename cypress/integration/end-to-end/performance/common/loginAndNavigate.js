import { runLogin } from "./runLogin";

export const loginAndNavigate = endpoint => {
  // Go to login page
  cy.visit("/", {
    onBeforeLoad: win => {
      win.performance.mark("start-loading");
    }
  })
    .its("performance")
    .then(() => {
      runLogin();
      cy.get("div[class=hamburger-react]").click();
    });
  return cy.visit(endpoint, {
    onBeforeLoad: win => {
      win.performance.mark("start-loading");
    }
  });
};
