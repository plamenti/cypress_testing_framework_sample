# POC - Basic Test Automation Project with Cypress

### **PREREQUISITES**: Installed Node.js. It can be downloaded from [the official Node.js website](https://nodejs.org/en/download/).

## **Table of Contents**:
1. [Setup new npm package](#setup-new-npm-package)
1. [Install Cypress](#install-cypress)
1. [Disable outputting XHR messages in test runner log](#disable-xhr-messages)
1. [Create environment configuration files](#create-configurations)
1. [Setup Cucumber support](#setup-cucumber-support)
1. [Run Cypress](#run-cypress)
1. [Cypress from the command line](https://docs.cypress.io/guides/guides/command-line)
1. [Page Object Model pattern implementation](#pom-implementation)
1. [Clear local storage and cookies](#clear-local-storage-and-cookies)
1. [Keep passwords secret](#keep-passwords-secret)
1. [Reporting](#reporting)
1. [Official Cypress Documentation](#official-cypress-documentation)


<a id="setup-new-npm-package"></a>
## **Setup new npm package**
### Run in terminal: `npm init`

<a id="install-cypress"></a>
## **Install Cypress**
**Run in terminal**: `npm install cypress --save-dev`
or short version: `npm i cypress --save-dev`

**IMPORTANT**: This will install the latest version of Cypress. If you want to install some specific version **run in terminal**: `npm i cypress@6.5.0`

<a id="disable-xhr-messages"></a>
## **Disable outputting XHR messages in test runner log**
In cypress/support/index.js file paste:
```javascript
// Disable outputting XHR messages in test runner log
Cypress.Server.defaults({
    ignore: (xhr) => {
        // handle custom logic for whitelisting
        return true;
      }
})
```

<a id="create-configurations"></a>
## **Create environment configuration files**
Steps:

1. Create `cypress\config` folder
1. In config folder create a json configuration file - e.g. qa.json, uat.json
1. In cypress/plugins/index.js file paste (over the existing code under the comments):
```javascript
const fs = require('fs-extra')
const path = require('path')

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('cypress', 'config', `${file}.json`)

  if(!fs.existsSync(pathToConfigFile)) {
    console.log('No custom config found!');
    return {};
  }

  return fs.readJson(pathToConfigFile)
}

// plugins file
module.exports = (on, config) => {
  // accept a configFile value or use qa by default
  const file = config.env.configFile

  return getConfigurationByFile(file)
}
```
4. In the configuration file add required values - e.g. "baseUrl": "https://ram.qa.pyr/"

[Read more about how to Switch between multiple configuration files.](https://docs.cypress.io/api/plugins/configuration-api#Switch-between-multiple-configuration-files)

<a id="run-cypress"></a>
## **Run Cypress**
- by npx - **run in terminal**: `npx cypress open`
- by using the full path - **run in terminal**: `./node_modules/.bin/cypress open`
- by adding (updating runtime) environment varialbels - **run in terminal**: `npx cypress open --env configFile=uat,env_type=RAM1,license=COM`
- by custom scripts - `npm run test-run-qa-bg`
- by custom script and by tag - `npm run test-run-qa-bg -- 'TAGS=@focus'`

<a id="setup-cucumber-support"></a>
## **Setup Cucumber support**
https://www.npmjs.com/package/cypress-cucumber-preprocessor

To setup generating of cucumber-json report add in `package.json`:

```javascript
"cypress-cucumber-preprocessor": {
    "nonGlobalStepDefinitions": false,
    "cucumberJson": {
      "generate": true,
      "outputFolder": "cypress/cucumber-json",
      "filePrefix": "",
      "fileSuffix": ".cucumber"
    }
  }
```

<a id="pom-implementation"></a>
## **Page Object Model pattern implementation**
Create folder `cypress\support\pages`. Inside `pages` folder create loder `pokerstars` and folder `cashier`.

Inside `pokerstars` folder create page object `PokerStarsHomePage.js`.

Inside `cashier` folder create page object `CashierHomePage.js`.

<a id="create-custom-commands"></a>
## **Create Custom commands**
There are several common functionalities that should be extracted as custom command. In this way they will be easily used on demand.

Example of good candidate is getting the specific for test environment, environment type and license URL.
Because custom command is a promise, we should use `cy.wrap` which if the object is a promise yield its resolved value.
```javascript
Cypress.Commands.add('getUrl', () => {
    const license = Cypress.env("license");
    const env_type = Cypress.env("env_type");
    const url = Cypress.env(env_type)[license];
    cy.log("Found URL:", url);

    return cy.wrap(url);
})
```
Other example - get Admin url:
```javascript
Cypress.Commands.add('getAdminUrl', () => {
    const url = Cypress.env("admin_page_base");
    cy.log("Found Admin URL:", url);

    return cy.wrap(url);
})
```
Other example - get regular user:
```javascript
Cypress.Commands.add('getRegularUser', () => {
    const license = Cypress.env("license");
    const user = Cypress.env("regular_user")[license];
    cy.log("Found user:", user);

    return cy.wrap(user);
})
```

<a id="clear-local-storage-and-cookies"></a>
## **Clear local storage and cookies**
This is good to done before each test execution.
In beforeEach hook add:
```javascript
beforeEach(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
    })
```

<a id="keep-passwords-secret"></a>
## **Keep passwords secret**
Allways consider the best practices of how to pass passwords and tokens during Cypress tests to avoid accidentally revealing them in screenshots, videos and logs.
For more information read [THIS](https://glebbahmutov.com/blog/keep-passwords-secret-in-e2e-tests/) blog.

Example to secure run from terminal: `npx cypress open --env configFile=qa,env_type=RAM1,license=COM,password=MyTest123`

IMPORTANT: Substitute password value with provided by credentials manager in Jenkins (for example)

<a id="reporting"></a>
## **Reporting**
1. nstall multiple reporters **run in terminal**: `npm install --save-dev cypress-multi-reporters mocha-junit-reporter`
1. Specify your reporter and reporterOptions in your configuration file (cypress.json by default)
```javascript
{
  "reporter": "cypress-multi-reporters",
  "reporterOptions": {
    "configFile": "reporter-config.json"
  }
}
```
3. Add the separate reporter-config.json file (defined in your configuration) to enable spec and junit reporters and direct the junit reporter to save separate XML files
```javascript
{
  "reporterEnabled": "spec, mocha-junit-reporter",
  "mochaJunitReporterReporterOptions": {
    "mochaFile": "cypress/results/results-[hash].xml"
  }
}
```
4. To combine  generated XML files into a single one, [junit-report-merger](https://www.npmjs.com/package/junit-report-merger) can be added. For example, to combine all files into cypress/results/combined-report.xml the combine:reports script can be added.
```javascript
{
  "scripts": {
    "delete:reports": "rm cypress/results/* || true",
    "combine:reports": "jrm cypress/results/junit/combined-report.xml \"cypress/results/junit/*.xml\"",
    "prereport": "npm run delete:reports",
    "report": "cypress run --reporter cypress-multi-reporters --reporter-options configFile=reporter-config.json",
    "postreport": "npm run combine:reports"
  }
}
```

5. To use Mochawesome JSON reports:

**Run in terminal:** `npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator`


6. Configure the reporter-config.json file to skip the HTML report generation and save each individual JSON file in the cypress/results folder.

```javascript
{
    "reporterEnabled": "spec, mochawesome, mocha-junit-reporter",
    "mochaJunitReporterReporterOptions": {
      "mochaFile": "cypress/results/junit/results-[hash].xml"
    },
    "mochawesomeReporterOptions": {
        "reportDir": "cypress/results/mochawesome",
        "overwrite": false,
        "html": false,
        "json": true
      }
}
```

7. Merge generated Mochawesome JSON reports:

**Run in terminal:** `npx mochawesome-merge cypress/results/mochawesome/*.json > mochawesome.json && npx marge mochawesome.json`

For more information check [HERE](https://docs.cypress.io/guides/tooling/reporters#Multiple-reporters).

<a id="official-cypress-documentation"></a>
## **Official Cypress Documentation** - https://docs.cypress.io/

