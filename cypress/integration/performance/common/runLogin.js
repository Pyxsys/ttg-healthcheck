
export default runLogin = () => {
    cy.get("input[name=email1]").type(testUser.email);
    cy.get("input[name=password1]").type(testUser.password);
    cy.get("button[type=submit]").click();
    cy.get("div[class=hamburger-react]").click();
  };