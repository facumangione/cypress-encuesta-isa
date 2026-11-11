import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'https://virtual.um.edu.ar',
    viewportWidth: 1440,
    viewportHeight: 900,
    // Moodle a veces tarda en responder, sobre todo en horario de clases
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
  },
  video: false,
  // Valores públicos, se leen con Cypress.expose().
  // Usuario y contraseña van en cypress.env.json y se leen con cy.env()
  expose: {
    curso: 'Software Aplicada',
    encuestaId: 210589,
  },
})
