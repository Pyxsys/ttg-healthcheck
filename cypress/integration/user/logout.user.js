const testUser = {
    name: 'test2',
    password: 'test',
    email: 'selenium@gmail.com',
  };
  
  describe('Logout', () => {
    it('Upon successful Logout, redirect to /', () => {
      // open the landing page
      cy.visit('/');
  
      cy.get('input[name=email]').type(testUser.email);
      cy.get('input[name=password]').type(testUser.password);
      cy.get('button[type=submit]').click();
      cy.get('button[id="react-burger-menu-btn"]').click()
      cy.get('a[href*="/logout"]').click();
  
      // assert we are in /dashboard
      cy.url().should('include', '/');
    });
  });
  