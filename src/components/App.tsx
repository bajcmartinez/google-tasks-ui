import React, { useEffect } from 'react'
import 'typeface-roboto';
import { ThemeProvider } from '@material-ui/styles';
import lightTheme from '../themes/light';
import darkTheme from '../themes/dark';
import { ISettings } from '../types';

import GoogleTasksService from '../services/GoogleTasks';
import Home from './Home';
import Welcome from './Welcome';
import { CssBaseline } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';

const App: React.FC = () => {
  const [googleLoaded, setGoogleLoaded] = React.useState(false);
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  const [settings, setSettings] = React.useState<ISettings>({
    darkMode: localStorage.getItem("settings.darkMode") === "true",
    comfortView: localStorage.getItem("settings.comfortView") === "true",
    taskView: localStorage.getItem("settings.taskView") || "DueDateView",
  });

  // Initialize google gapi only on the first load
  useEffect(() => {
    GoogleTasksService.load(updateSigninStatus);
    setGoogleLoaded(true);

    updateSigninStatus(GoogleTasksService.isSignedIn());
  }, []);

  function updateSigninStatus(isSignedIn: boolean) {
    setIsSignedIn(isSignedIn);
  }

  function signIn() {
    GoogleTasksService.signIn();
  }

  function signOut() {
    GoogleTasksService.signOut();
  }

  const switchDarkMode = () => {
    localStorage.setItem("settings.darkMode", (!settings.darkMode).toString());
    setSettings({
      ...settings,
      darkMode: !settings.darkMode
    });
  }

  const switchSetting = (key: string, value: any) => {
    localStorage.setItem(`settings.${key}`, (value).toString());
    setSettings({
      ...settings,
      [key]: value
    });
  };

  let render;

  if (!googleLoaded) {
    render = (<div>Loading...</div>);
  } else {
    if (isSignedIn) {
      render = (
        <Home
          settings={settings}
          switchDarkMode={switchDarkMode}
          switchSetting={switchSetting}
          signOut={signOut}
        />
      )
    } else {
      render = (<Welcome signIn={signIn}/>)
    }
  }

  return (
    <ThemeProvider theme={settings.darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={1000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        {render}
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App;
