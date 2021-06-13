/// <reference types="cypress" />

class PokerStarsHomePage {

    // Paga elements selectors
    loginButton = "#loginButton2";
    usernameField = "#psramusernamepopup";
    passwordField = ".body input[name='password']";
    submitLoginButton = ".body [type='submit']";

    navigateTo() {
        cy.getUrl().then((url) => cy.visit(url))
    }

    login() {

    }

    login(userId) {
        cy.get(this.loginButton).click();
        cy.get(this.usernameField).type(userId);
        const password = Cypress.env("password");
        if (typeof password !== 'string' || !password) {
            throw new Error('Missing password value, set using CYPRESS_password=...')
        }
        cy.get(this.passwordField).type(password, {log: false});
        cy.get(this.submitLoginButton).click();
    }
}

export default PokerStarsHomePage;