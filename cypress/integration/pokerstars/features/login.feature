Feature: Login Pokerstars Home page

    Scenario: Login with regular user
        Given Pokerstars home page is open
        When the user enters valid credentials and press Login
        Then the user is logged in successfully