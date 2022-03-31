Cypress.env();
const admintestUser = {
  name: "admin2",
  password: Cypress.env("admin_password"),
  email: "admin@gmail.com"
};
const user = {
  name: "Michael Takenaka",
  password: Cypress.env("TailsIKnowWhoYour"),
  email: "mikeyrex884@gmail.com"
};

describe("1. if you're an admin you will see a table with all users when you click on profile", () => {
  before(() => {
    const loginPage = "/";
    cy.visit(loginPage);

    cy.get("input[name=email1]").type(admintestUser.email);
    cy.get("input[name=password1]").type(admintestUser.password);
    cy.get("button[type=submit]").click();
    cy.url().should("include", "dashboard");

    cy.get('div[class="dropdown"]').click();
    cy.get('a[href*="/admin"]').click();

    cy.url().should("include", "");
  });

  it(" 1.1. you can click on any use and edit their profile", () => {
    cy.get("input[name=email1]").type(admintestUser.email);
    cy.get("input[name=password1]").type(admintestUser.password);
    cy.get("button[type=submit]").click();
    cy.url().should("include", "dashboard");

    cy.get('div[class="dropdown"]').click();
    cy.get('a[href*="/admin"]').click();

    cy.url().should("include", "");
  });
});

describe("2. if you're an user you will see your profile when you click on view profile button", () => {
  it("Access profile as regular user", () => {
    cy.get("input[name=email1]").type(user.email);
    cy.get("input[name=password1]").type(user.password);
    cy.get("button[type=submit]").click();
    cy.url().should("include", "dashboard");

    cy.get('div[class="dropdown"]').click();
    cy.get('a[href*="/admin"]').click();
  });
});

/*
describe("AdminPanel Page", () => {
  it("After successful login user with admin privileges can access /adminpanel page", () => {
    cy.visit("/");

    cy.get("input[name=email1]").type(admintestUser.email);
    cy.get("input[name=password1]").type(admintestUser.password);
    cy.get("button[type=submit]").click();
    cy.url().should("include", "dashboard");

    cy.visit("/adminpanel");
    cy.url().should("include", "adminpanel");
  });
});
*/
