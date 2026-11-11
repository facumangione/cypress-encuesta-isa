# Test E2E - Encuesta de Ingeniería de Software Aplicada

Test en Cypress que entra al campus virtual de la UM, abre la materia Ingeniería de Software Aplicada, responde la encuesta final y verifica que se haya enviado.

Usa el patrón Page Object: cada pantalla de Moodle tiene su clase en `cypress/pages`.

## Estructura

```
cypress/
├── e2e/encuesta.cy.js       # el test
├── pages/
│   ├── LoginPage.js         # login del campus
│   ├── CursoPage.js         # búsqueda del curso y link a la encuesta
│   └── EncuestaPage.js      # responder y enviar la encuesta
├── fixtures/respuestas.json # textos usados para las preguntas abiertas
└── support/
    ├── commands.js          # cy.login con cy.session
    └── e2e.js
cypress.config.js            # baseUrl, curso e id de la encuesta
cypress.env.example.json     # plantilla de credenciales
```

## Cómo correrlo

```bash
npm install
cp cypress.env.example.json cypress.env.json   # completar usuario y contraseña
npm run cy:open                                # modo interactivo
npm test                                       # modo headless
```

`cypress.env.json` está en el `.gitignore`, así que las credenciales no se suben al repo.

## Cómo responde las preguntas

La página no depende de las preguntas puntuales de la encuesta. Recorre el formulario y completa lo que encuentra:

- Radios (opción única, sí/no, escalas): marca la primera opción de cada grupo
- Checkboxes: marca la primera opción de cada pregunta
- Desplegables: elige la primera opción real (saltea "Elegir...")
- Texto corto / numérico: usa los valores de `fixtures/respuestas.json`
- Texto largo: escribe en el textarea o en el editor de Moodle (TinyMCE o Atto)

Si la encuesta tiene varias páginas, va apretando "Siguiente" hasta llegar a "Enviar".

## Verificación

El envío se considera correcto cuando:

1. El formulario ya no está en pantalla (si faltara una respuesta obligatoria, Moodle lo vuelve a mostrar)
2. Aparece el mensaje de agradecimiento
3. Al volver a la encuesta aparece el link para ver la respuesta enviada

## Observaciones

- Si la encuesta permite una sola respuesta por alumno, el test funciona la primera vez. En las siguientes corridas falla con un mensaje que lo aclara.
- Si el docente cambió el mensaje de agradecimiento, hay que ajustar `mensajeGracias` en `EncuestaPage.js`.
