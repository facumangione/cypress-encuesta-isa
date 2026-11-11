class LoginPage {
  elementos = {
    // Moodle 4 usa #user-menu-toggle, Moodle 3 usa .usermenu
    menuUsuario: () => cy.get('#user-menu-toggle, .usermenu'),
  }

  // Después del login entramos al área personal y confirmamos que no nos
  // devolvió a la pantalla de login y que aparece el menú del usuario
  verificarIngreso() {
    cy.visit('/my/')
    cy.url().should('not.include', '/login/index.php')
    this.elementos.menuUsuario().should('exist')
  }
}

export default new LoginPage()
