# [Google Tasks UI](https://googletasksui.com) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/bajcmartinez/google-tasks-ui/blob/master/LICENSE) [![Build Status](https://travis-ci.org/bajcmartinez/google-tasks-ui.svg?branch=master)](https://travis-ci.org/bajcmartinez/google-tasks-ui) [![Coverage Status](https://coveralls.io/repos/github/bajcmartinez/google-tasks-ui/badge.svg?branch=master)](https://coveralls.io/github/bajcmartinez/google-tasks-ui?branch=master)

Open source UI that connects to your Google Tasks account and it's intended to be an additional interface for the service for desktop applications, and to bring a full web experience over Google Tasks. It's not intended to replace existing Google Tasks solutions but to complement them.

This app is not affiliated, sponsored or developed by Google by any means, it's a hobby project that some people seem to be liking and using. I do not plan on charging, nor collecting metrics or any type of data from the use of this app.
This app connects to the Google Tasks API which privacy policies can be found here [Google API Privacy Policy](https://developers.google.com/terms/api-services-user-data-policy).
Our servers only host the front-end application and you browser does not send any of your private information to our servers, all communications are done directly from the browser to the Google APIs.

[View it in action](https://googletasksui.com)

## Features

* Web and Electron app UI for Google Tasks
* All tasks view
* Multiple view modes
  * Due date group / List
  * Dense / Comfort
* Support for subtasks
* Auto save
* Dark mode support
* ... More coming soon!

## Gallery
| Light Mode | Dark Mode |
------|------
![All Tasks](assets/demo-light.png) | ![All Tasks](assets/demo-dark.png)
![All Tasks](assets/demo-light-2.png) | ![All Tasks](assets/demo-dark-2.png)
![All Tasks](assets/demo-light-3.png) | ![All Tasks](assets/demo-dark-3.png)


This application is undergoing heavy development and any contributions are welcomed!

## Contributions

Please feel free to ask for new features by creating issues, or to work on features by creating pull requests.
I'm currently working hard to make this app amazing, it's already in working conditions and improving all the time.

If you find any errors or strange behaviors, please report them by creating an issue.

## Desktop app through release or dev mode configuration

It is necessary for your to configure your Google API keys, as they cannot be distributed securely with the app.

For that follow up the next steps:

1. Setup your [OAuth consent screen](https://console.developers.google.com/apis/credentials/consent) in Google API Console

2. In Google API Console [Credentials](https://console.developers.google.com/apis/credentials) section.
   Create credentials => OAuth client ID => Other => Create. After, you should get a json file like this.

```json
{
  "installed": {
    "client_id": "...",
    "project_id": "...",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "...",
    "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]
  }
}
```

3. Rename the file to `google-tasks-ui.json` or `.google-tasks-ui.json` 

4. Copy the file into one of the following locations, the app will take and use the first coincidence
    1. User's home directory
    2. User's documents folder 
    3. User's desktop

## Run the app

### Web interface 
  
`npm run react-start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the c`onsole.

### Electron app 

`npm run start`

Runs the electron app in the development mode.

### Run Tests 

`npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

To learn React, check out the [React documentation](https://reactjs.org/).
