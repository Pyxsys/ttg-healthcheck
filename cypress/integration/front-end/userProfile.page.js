Cypress.env();
const admintestUser = {
  name: "admin2",
  password: Cypress.env("admin_password"),
  email: "admin@gmail.com"
};
const user = {
  name: "A Name",
  password: "test",
  email: "a@gmail.com"
};

describe("1. if you're an admin you will see a table with all users when you click on profile", () => {
  before(() => {
    const loginPage = "/";
    cy.visit(loginPage);

    cy.get("input[name=email1]").type(admintestUser.email);
    cy.get("input[name=password1]").type(admintestUser.password);
    cy.get("button[type=submit]").click();

    cy.get('div[class="dropdown"]').click();
    cy.get('a[href*="/admin"]').click();

    cy.get(".devices-content > .flex-column").should("be.visible"); //visible
  });

  it(" 1.1. you can click on any use and edit their profile", () => {
    cy.get(".devices-content > .flex-column")
      .contains("logtestuser1234")
      .click();
    cy.get(
      ":nth-child(1) > :nth-child(1) > tbody > tr > :nth-child(2) > .btn"
    ).click();
    cy.get(
      "#account-info-form > table > tbody > :nth-child(1) > td > .input-group > .user-profile-input"
    )
      .clear()
      .type("ChangedName");
    cy.get(":nth-child(3) > .btn").click();

    cy.get('div[class="dropdown"]').click();
    cy.get('a[href*="/admin"]').click();
    cy.get(".devices-content > .flex-column").contains("ChangedName");
  });

  after(() => {
    cy.get(".devices-content > .flex-column")
      .contains("ChangedName")
      .click();
    cy.get(
      ":nth-child(1) > :nth-child(1) > tbody > tr > :nth-child(2) > .btn"
    ).click();
    cy.get(
      "#account-info-form > table > tbody > :nth-child(1) > td > .input-group > .user-profile-input"
    )
      .clear()
      .type("logtestuser1234");
    cy.get(":nth-child(3) > .btn").click();
  });
});

describe("2. if you're an user you will see your profile when you click on view profile button", () => {
  it("User profile page", () => {
    const loginPage = "/";
    cy.visit(loginPage);

    cy.get("input[name=email1]").type(user.email);
    cy.get("input[name=password1]").type(user.password);
    cy.get("button[type=submit]").click();

    cy.get('div[class="dropdown"]').click();
    cy.get(
      '[href="/user-profile?Id=623ac85285aadcd23d52f26e"] > .nav-right-font'
    ).click();

    cy.get(".user-profile-content > .flex-column").should("be.visible");
  });
});
