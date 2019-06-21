import React, { useEffect } from 'react'
import 'typeface-roboto';

import GoogleTasksService from '../services/GoogleTasks';
import Home from './Home';
import Welcome from './Welcome';


const App: React.FC = () => {
  const [googleLoaded, setGoogleLoaded] = React.useState(false);
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  useEffect(() => {
    GoogleTasksService.authorize().then(() => {
      setGoogleLoaded(true);

      if (!isSignedIn)
        GoogleTasksService.subscribeSigninStatus(updateSigninStatus);
    });
  });

  function updateSigninStatus(isSignedIn: boolean) {
    setIsSignedIn(isSignedIn);
  }

  function signIn() {
    GoogleTasksService.signIn()
  }

  if (!googleLoaded) {
    return (<div>Loading...</div>);
  }

  if (GoogleTasksService.isSignedIn()) {
    return (<Home />)
  } else {
    return (<Welcome signIn={signIn} />)
  }
}

export default App;
