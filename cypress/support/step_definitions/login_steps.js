import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import PokerStarsHomePage from "../pages/pokerstars/PokerStarsHomePage"

const homePage = new PokerStarsHomePage();

Given('Pokerstars home page is open', () => {
  homePage.navigateTo();
})

When('the user enters valid credentials and press Login', () => {
  homePage.login();
})

Then('the user is logged in successfully', () => {
  cy.log("Then")
})
