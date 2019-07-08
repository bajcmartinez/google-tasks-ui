import React, {useEffect} from 'react';
import 'typeface-roboto';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, Container, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  logo: {
    maxWidth: 150,
    marginBottom: theme.spacing(2)
  },

  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

interface IProps {
  signIn: () => void
}

const Welcome: React.FC<IProps> = (props) => {
  const classes = useStyles();

  // Set the window title
  useEffect(() => {
    document.title = "Welcome to Google Tasks UI";
  });

  return (
    <Container component="main" maxWidth="md">
      <div className={classes.paper}>
        <div>
          <img alt="Google Tasks" src="/assets/logo.png" className={classes.logo} />
        </div>
        <Typography variant="h3" aria-label="Welcome to Google Tasks UI">
          Welcome to Google Tasks UI
        </Typography>

        <Typography variant="h6">
          The unofficial UI application for Google Tasks.
        </Typography>

        <br />

        <Typography variant="body1">
          Google Tasks UI is an open source, 100% free application built to handle your Google Tasks. It has been built for ease of use and good look and feel.
        </Typography>

        <br /><br />

        <Button variant="contained" color="primary" onClick={() => props.signIn()}>
          Click here to Log In with your Google Account
        </Button>
      </div>
    </Container>
  );
}

export default Welcome;
