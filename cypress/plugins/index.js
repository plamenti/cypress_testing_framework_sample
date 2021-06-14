/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const fs = require('fs-extra')
const path = require('path')

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('cypress', 'config', `${file}.json`)

  if (!fs.existsSync(pathToConfigFile)) {
    console.log('No custom config found!');
    return {};
  }

  return fs.readJson(pathToConfigFile)
}

const cucumber = require('cypress-cucumber-preprocessor').default

// plugins file
module.exports = (on, config) => {
  on('file:preprocessor', cucumber())

  // accept a configFile value or use qa by default
  const file = config.env.configFile

  return getConfigurationByFile(file)
}