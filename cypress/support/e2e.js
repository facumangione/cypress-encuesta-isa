import './commands'

// El JavaScript propio de Moodle a veces tira errores que no tienen que ver
// con el test (bloques, notificaciones, etc). Sin esto Cypress corta la ejecución.
Cypress.on('uncaught:exception', () => false)
