// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

Cypress.Commands.add('getUrl', () => {
    const license = Cypress.env("license");
    const env_type = Cypress.env("env_type");
    const url = Cypress.env(env_type)[license];
    cy.log("Found URL:", url);

    return cy.wrap(url);
})

Cypress.Commands.add('getAdminUrl', () => {
    const url = Cypress.env("admin_page_base");
    cy.log("Found Admin URL:", url);

    return cy.wrap(url);
})

Cypress.Commands.add('getRegularUser', () => {
    const license = Cypress.env("license");
    const user = Cypress.env("regular_user")[license];
    cy.log("Found user:", user);

    return cy.wrap(user);
})

Cypress.Commands.add('getIframe', (iframe) => {
    return cy.get(iframe)
        .its('0.contentDocument.body')
        .should('be.visible')
        .then(cy.wrap);
})

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
