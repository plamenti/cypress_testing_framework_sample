/// <reference types="cypress" />

const locators = {
    loginButton: "#loginButton2",
    usernameField: "#psramusernamepopup",
    passwordField: ".body input[name='password']",
    submitLoginButton: ".body [type='submit']",
}

class PokerStarsHomePage {

    // Page elements selectors
    loginButton = "#loginButton2";
    usernameField = "#psramusernamepopup";
    passwordField = ".body input[name='password']";
    submitLoginButton = ".body [type='submit']";
    username = ".username span"

    navigateTo() {
        cy.getUrl().then((url) => cy.visit(url))
    }

    login() {
        cy.getRegularUser().then(userId => this.loginWithSpecificUser(userId));
    }

    loginWithSpecificUser(userId) {
        cy.get(locators.loginButton).click();
        cy.get(locators.usernameField).type(userId);
        const password = Cypress.env("password");
        if (typeof password !== 'string' || !password) {
            throw new Error('Missing password value, set using CYPRESS_password=...')
        }
        cy.get(locators.passwordField).type(password, {log: false});
        cy.get(locators.submitLoginButton).click();
    }

    openAccount() {
        cy.get(locators.username).click();
    }
}

export default PokerStarsHomePage;