Cypress.env();
const testUser = {
  name: "test8",
  password: Cypress.env("test_password"),
  email: "cypress@gmail.com",
};

const login = () => {
    cy.visit("/");
    cy.get("input[name=email1]").type(testUser.email);
    cy.get("input[name=password1]").type(testUser.password);
    cy.get("button[type=submit]").click();
  };

describe("1. Ensure that a user can navigate to his profile page and that all components work properly .", () => {
    // add a device before testing the device page
    it("1.1 After successful login, navigate to the profile page containing the users information.", () => {
      login();
  
      // open right nav
      cy.get('div[class="dropdown"]').click();
  
      // navigate to profile page
      cy.get('a[class="dropdown-item"]').eq(0).click();

      // check that you are on the profile page
      cy.url().should("include", "user-profile");

      // check if the profile page has all expected headers
      cy.contains("ACCOUNT NAME").should("be.visible");
      cy.contains("EMAIL ADDRESS").should("be.visible");
      cy.contains("AVATAR").should("be.visible");
      cy.contains("ROLE").should("be.visible");
      cy.contains("OLD PASSWORD").should("exist");
      cy.contains("NEW PASSWORD").should("exist");
      cy.contains("RE-ENTER PASSWORD").should("exist");
      cy.contains("Log history").should("exist");
      cy.contains("Delete").should("exist");
    });

    it("1.2 After successful login, navigate to the profile page, and then to user logs.", () => {
        login();
    
        // open right nav
        cy.get('div[class="dropdown"]').click();
    
        // navigate to profile page
        cy.get('a[class="dropdown-item"]').eq(0).click();
  
        // check that you are on the profile page
        cy.url().should("include", "user-profile");
  
        // click the user logs page and navigate there
        cy.contains("button", "Log history").click();

        // check that you are on the profile page
        cy.url().should("include", "user-logs");

        // Make sure user log table is there with csv export
        cy.get("table").should("exist")
        cy.contains("button", "Export as CSV").should("exist")
    });
});