import loginPage from '../pages/LoginPage'

// Login por API, sin pasar por la pantalla de login (como recomienda la
// documentación de Cypress). El JavaScript del formulario del campus vacía el
// campo de contraseña mientras carga, así que escribir en él no es confiable.
//
// Moodle exige un logintoken que viene en la página de login, así que primero
// lo leemos y después hacemos el POST del formulario. Las cookies de sesión que
// devuelve Moodle quedan guardadas en el navegador de Cypress.
Cypress.Commands.add('login', () => {
  cy.env(['usuario', 'password']).then(({ usuario, password }) => {
    if (!usuario || !password) {
      throw new Error('Faltan credenciales: copiar cypress.env.example.json a cypress.env.json y completarlo')
    }

    cy.session(
      usuario,
      () => {
        cy.request('/login/index.php').then(({ body }) => {
          const pagina = new DOMParser().parseFromString(body, 'text/html')
          const logintoken = pagina.querySelector('input[name="logintoken"]')?.value

          cy.request({
            method: 'POST',
            url: '/login/index.php',
            form: true,
            body: { username: usuario, password, logintoken, anchor: '' },
            log: false,
          }).then((respuesta) => {
            const resultado = new DOMParser().parseFromString(respuesta.body, 'text/html')
            const error = resultado.querySelector('#loginerrormessage, .loginerrors')

            if (error) {
              throw new Error(`Moodle rechazó el login: ${error.textContent.trim()}`)
            }
          })
        })

        loginPage.verificarIngreso()
      },
      {
        validate() {
          cy.visit('/my/')
          cy.url().should('not.include', '/login/index.php')
        },
        cacheAcrossSpecs: true,
      }
    )
  })
})
