import cursoPage from '../pages/CursoPage'
import encuestaPage from '../pages/EncuestaPage'

describe('Encuesta final - Ingeniería de Software Aplicada', () => {
  const curso = Cypress.expose('curso')
  const encuestaId = Cypress.expose('encuestaId')

  beforeEach(() => {
    cy.login()
    cy.fixture('respuestas').as('respuestas')
  })

  it('responde la encuesta y la envía correctamente', function () {
    // 1. Ingresar a la materia
    cursoPage.buscar(curso)
    cursoPage.entrar(curso)

    // 2. Ingresar a la encuesta
    cursoPage.abrirEncuesta(encuestaId)
    encuestaPage.verificarQueEstaAbierta()

    // 3. Responder las preguntas
    encuestaPage.comenzar()
    encuestaPage.responderCypressEsE2E(this.respuestas.cypressEsE2E)
    encuestaPage.responderTercerElemento(this.respuestas.posicionEnLista)
    encuestaPage.enviar()

    // 4. Comprobar que el formulario se envió
    encuestaPage.verificarEnvio(encuestaId)
  })
})
