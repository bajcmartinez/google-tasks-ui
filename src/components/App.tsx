import React, { useEffect } from 'react'
import 'typeface-roboto';
import { ThemeProvider } from '@material-ui/styles';
import lightTheme from '../themes/light';
import darkTheme from '../themes/dark';

import GoogleTasksService from '../services/GoogleTasks';
import Home from './Home';
import Welcome from './Welcome';
import { CssBaseline } from '@material-ui/core'

const App: React.FC = () => {
  const [googleLoaded, setGoogleLoaded] = React.useState(false);
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  const [settings, setSettings] = React.useState({
    darkMode: localStorage.getItem("settings.darkMode") === "true"
  });

  // Initialize google gapi only on the first load
  useEffect(() => {
    GoogleTasksService.authorize().then(() => {
      setGoogleLoaded(true);

      GoogleTasksService.subscribeSigninStatus(updateSigninStatus);
    });
  }, []);

  function updateSigninStatus(isSignedIn: boolean) {
    console.log('updateSigninStatus', isSignedIn);
    setIsSignedIn(isSignedIn);
  }

  function signIn() {
    GoogleTasksService.signIn()
  }

  function signOut() {
    GoogleTasksService.signOut()
  }

  function switchDarkMode() {
    localStorage.setItem("settings.darkMode", (!settings.darkMode).toString());
    setSettings({
      darkMode: !settings.darkMode
    })
  }

  let render;

  if (!googleLoaded) {
    render = (<div>Loading...</div>);
  } else {
    if (isSignedIn) {
      render = (<Home
        switchDarkMode={switchDarkMode}
        signOut={signOut}
      />)
    } else {
      render = (<Welcome signIn={signIn}/>)
    }
  }

  return (
    <ThemeProvider theme={settings.darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {render}
    </ThemeProvider>
  )
}

export default App;
