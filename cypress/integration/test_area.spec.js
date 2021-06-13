import PokerStarsHomePage from '../support/pages/pokerstars/PokerStarsHomePage'
/// <reference types="cypress" />

describe("Test Area", () => {
    before(() => {
        cy.log("Before all!");
    })

    beforeEach(() => {
        cy.log("Before each!");
    })

    it("Test getting different configurations", () => {
        cy.log(Cypress.env("license"));
        cy.log(Cypress.env("env_type"));

        // Test getting url
        cy.getUrl().then((url) => cy.log(url));
        cy.getAdminUrl().then(url => cy.log(url));

        // Test getting regular user
        cy.getRegularUser().then(user => cy.log(user));
    })

    it.only("Test navigation to home page", () => {
        const page = new PokerStarsHomePage();
        page.navigateTo();
        page.login("wc2_com_001");
    });
})