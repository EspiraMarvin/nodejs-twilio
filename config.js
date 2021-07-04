/*
create and export configuration variables
 */

// container for all the environments
var environments = {

};

// staging {default} environment

environments.staging = {
    'port': 3000,
    'envName': 'staging'
}

// production {default} environment

environments.production = {
    'port': 5000,
    'envName': 'production'
}

// Determine which environment was passes at the command line argument
let currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

// check that the current env is one of the environments above, if not default to staging
let environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging

// export the module
module.exports = environmentToExport
