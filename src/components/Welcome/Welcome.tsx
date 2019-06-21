import React from 'react';
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
  return (
    <Container component="main" maxWidth="md">
      <div className={classes.paper}>
        <div>
          <img alt="Google Tasks" src="/assets/logo.png" className={classes.logo} />
        </div>
        <Typography variant="h3" aria-label="Welcome to Google Tasks Desktop">
          Welcome to Google Tasks Desktop
        </Typography>

        <Typography variant="h6">
          The unofficial desktop application for Google Tasks.
        </Typography>

        <br />

        <Typography variant="body1">
          Google Tasks Desktop is an open source, 100% free application built to handle your Google Tasks. It has been built for ease of use and good look and feel.
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
