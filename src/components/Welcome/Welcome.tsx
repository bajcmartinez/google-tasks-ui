import React, {useEffect, Fragment} from 'react';
import 'typeface-roboto';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, Container, Typography } from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import isMobile  from 'ismobilejs';

const useStyles = makeStyles(theme => ({
  logo: {
    maxWidth: 150,
    marginBottom: theme.spacing(2)
  },

  main: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  os: {
    marginTop: theme.spacing(8)
  }
}));

interface IProps {
  signIn: () => void
}

const Welcome: React.FC<IProps> = (props) => {
  const classes = useStyles();

  // Set the window title
  useEffect(() => {
    document.title = "Welcome to Google Tasks UI";
  }, []);

  const links = isMobile.apple.device ?
      'https://itunes.apple.com/us/app/google-tasks-get-things-done/id1353634006?mt=8' :
      'https://play.google.com/store/apps/details?id=com.google.android.apps.tasks';

  const mobileMessage = (
    <Fragment>
      <Typography variant="body1">
        Google offers an official app for iOS and Android, please use the official app when it's available.
      </Typography>

      <br /><br />

      <Button variant="contained" color="primary" href={links}>
        Click here to download the official Google Tasks app
      </Button>
    </Fragment>
  );

  const defaultMessage = (
    <Fragment>
      <Typography variant="body1">
        Google Tasks UI is an open source, 100% free application built to handle your Google Tasks. It has been built for ease of use and good look and feel.
      </Typography>

      <br /><br />

      <Button variant="contained" color="primary" onClick={() => props.signIn()}>
        Click here to Log In with your Google Account
      </Button>
    </Fragment>
  );

  const message = isMobile.any ? mobileMessage : defaultMessage;

  return (
    <Container component="main" maxWidth="md">
      <div className={classes.main}>
        <div>
          <img alt="Google Tasks" src="assets/logo.png" className={classes.logo} />
        </div>
        <Typography variant="h3" aria-label="Welcome to Google Tasks UI">
          Welcome to Google Tasks UI
        </Typography>

        <br />

        <Typography variant="h6">
          The unofficial UI application for Google Tasks.
        </Typography>

        <br />

        {message}
      </div>

      <div className={classes.os}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">
              Open Source
            </Typography>

            <br />

            <Typography variant="body1">
              Google Tasks UI is open-sourced on GitHub. Contributions and feedback are welcome!
            </Typography>

            <br />

            <Button variant="contained" color="secondary" href="https://github.com/bajcmartinez/google-tasks-ui" target="_blank" rel="noopener noreferrer">
              Contribute on GitHub
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h4">
              Suggestions?
            </Typography>

            <br />

            <Typography variant="body1">
              Found any issues? Report them <a href="https://github.com/bajcmartinez/google-tasks-ui/issues" target="_blank" rel="noopener noreferrer">here</a>
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default Welcome;
