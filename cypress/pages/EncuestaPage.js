class EncuestaPage {
  selectores = {
    linkResponder: 'a[href*="mod/questionnaire/complete.php"]',
    linkMisRespuestas: 'a[href*="mod/questionnaire/myreport.php"]',
    formulario: 'form#phpesp_response, form[action*="mod/questionnaire/complete.php"]',
    contenedorPregunta: '.qn-container, fieldset',
    botonEnviar: '[name="submit"]',
  }

  preguntas = {
    cypressEsE2E: 'Es Cypress una herramienta para escribir test E2E',
    tercerElemento: 'puedes seleccionar el tercer elemento de la lista',
  }

  // Si la encuesta tiene un mensaje de agradecimiento personalizado, ajustar acá
  mensajeGracias = /gracias|thank you/i

  pregunta(texto) {
    return cy.contains(texto).closest(this.selectores.contenedorPregunta)
  }

  verificarQueEstaAbierta() {
    cy.get('h1, h2').should('be.visible')
    cy.title().should('not.be.empty')
  }

  comenzar() {
    cy.get('body').then(($body) => {
      const $link = $body.find(this.selectores.linkResponder)

      if (!$link.length) {
        throw new Error(
          'No aparece el link para responder la encuesta. Probablemente ya fue ' +
          'respondida con este usuario o está cerrada.'
        )
      }

      cy.wrap($link.first()).click()
    })

    cy.get(this.selectores.formulario).should('be.visible')
  }

  // Pregunta 1: opción SI / NO
  responderCypressEsE2E(respuesta) {
    this.pregunta(this.preguntas.cypressEsE2E).within(() => {
      cy.contains('label', new RegExp(`^\\s*${respuesta}\\s*$`, 'i')).click()
      cy.get('input[type="radio"]:checked').should('have.length', 1)
    })
  }

  // Pregunta 2: elegir el elemento de la lista según su posición (1 = primero).
  // Funciona tanto si la lista es un desplegable como si son radios.
  responderTercerElemento(posicion) {
    this.pregunta(this.preguntas.tercerElemento).then(($pregunta) => {
      const $select = $pregunta.find('select')

      if ($select.length) {
        // Se descarta la opción vacía "Elegir..." que Moodle pone al principio
        const opciones = $select.find('option').toArray().filter((o) => o.value !== '')
        const elegida = opciones[posicion - 1]

        cy.wrap($select).select(elegida.value)
        cy.wrap($select).should('have.value', elegida.value)
      } else {
        cy.wrap($pregunta).find('input[type="radio"]').eq(posicion - 1).check({ force: true })
        cy.wrap($pregunta).find('input[type="radio"]').eq(posicion - 1).should('be.checked')
      }
    })
  }

  enviar() {
    cy.get(this.selectores.formulario).find(this.selectores.botonEnviar).first().click()
  }

  verificarEnvio(idEncuesta) {
    // Si faltó algo obligatorio Moodle vuelve a mostrar el formulario con el error
    cy.get(this.selectores.formulario).should('not.exist')
    cy.contains(this.mensajeGracias).should('be.visible')

    // Al volver a la encuesta tiene que aparecer el link para ver mi respuesta
    cy.visit(`/mod/questionnaire/view.php?id=${idEncuesta}`)
    cy.get(this.selectores.linkMisRespuestas).should('exist')
  }
}

export default new EncuestaPage()

