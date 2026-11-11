class CursoPage {
  elementos = {
    resultadoBusqueda: (nombre) => cy.contains('.coursename a', new RegExp(nombre, 'i')),
    linkEncuesta: (id) => cy.get(`a[href*="mod/questionnaire/view.php?id=${id}"]`),
  }

  buscar(nombreCurso) {
    cy.visit(`/course/search.php?search=${encodeURIComponent(nombreCurso)}`)
  }

  entrar(nombreCurso) {
    this.elementos.resultadoBusqueda(nombreCurso).click()
    cy.url().should('include', '/course/view.php')
  }

  abrirEncuesta(idEncuesta) {
    // En Moodle 4 las secciones del curso pueden estar colapsadas y el link
    // queda oculto, por eso tomamos el href y navegamos en lugar de hacer click
    this.elementos.linkEncuesta(idEncuesta)
      .first()
      .invoke('attr', 'href')
      .then((href) => cy.visit(href))

    cy.url().should('include', `mod/questionnaire/view.php?id=${idEncuesta}`)
  }
}

export default new CursoPage()
