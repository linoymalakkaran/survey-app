// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  productionKey: 'devKey',
  odataApiUrl: 'http://10.0.131.21/MGSurvey/Api/',
  rootOdataUrl: 'http://10.0.131.21/MGSurvey/Api/',
  appBaseUrl: 'MGSurvey/Admin',
  authLoginUrl: 'http://10.0.131.21/MamarPh2/mamarapi/api/token/GetTokenWithRole',
  appHomeRelativePath: 'survey/list',
  // odataApiUrl: 'https://localhost:44369/',
  // rootOdataUrl: 'https://localhost:44369/',
};
