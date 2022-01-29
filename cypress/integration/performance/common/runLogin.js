
const testUser = {
    name: "test2",
    password: Cypress.env("test_password"),
    email: "cypress@gmail.com"
  };
  
const runLogin = () => {
    cy.get("input[name=email1]").type(testUser.email);
    cy.get("input[name=password1]").type(testUser.password);
    cy.get("button[type=submit]").click();
    cy.get("div[class=hamburger-react]").click();
};

export default runLogin
