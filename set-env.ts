//import { writeFile } from 'fs';
var fs = require('fs');
// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.staging.ts';
// Load node modules
const colors = require('colors');
require('dotenv').config();
// `environment.ts` file structure
console.log(`Process.env --->  ${process.env}`);
const envConfigFile = `export const environment = {
    production: true,
    productionKey: 'devKey',
    odataApiUrl: '${process.env.API_BASE_URL_FOR_SURVEY_ADMIN}',
    rootOdataUrl: '${process.env.API_BASE_URL_FOR_SURVEY_ADMIN}',
    appBaseUrl: 'MGSurvey/Admin',
    authLoginUrl: '${process.env.API_BASE_URL_FOR_MAMAR_AUTH_TOKEN}',
    appHomeRelativePath: 'survey/list'
};
`;
console.log(colors.magenta('The file `environment.ts` will be written with the following content: \n'));
console.log(colors.grey(envConfigFile));
fs.writeFile(targetPath, envConfigFile, function(err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(colors.magenta(`Angular environment.ts file generated correctly at ${targetPath} \n`));
  }
});
