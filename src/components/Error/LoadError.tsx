import React from 'react';
import 'typeface-roboto';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, Container, Paper, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

interface IProps {
  errorMessage: string
}

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

  error: {
    padding: theme.spacing(2),
    backgroundColor: '#931f1f',
    color: '#fff',
  },

  os: {
    marginTop: theme.spacing(4)
  }
}));

const LoadError: React.FC<IProps> = (props) => {
  const classes = useStyles(props);

  return (
    <Container component="main" maxWidth="md">
      <div className={classes.main}>
        <div>
          <img alt="Google Tasks" src="assets/logo.png" className={classes.logo} />
        </div>
        <Typography variant="h3" aria-label="Welcome to GTasks UI">
          Welcome to GTasks UI
        </Typography>

        <br />

        <Typography variant="h6">
          The unofficial UI application for Google Tasks.
        </Typography>

        <br />

        <Paper className={classes.error}>
          <Typography variant="h5" component="h3">
            Looks like you are offline, GTasks UI requires internet connection to work.
          </Typography>
          <br />
          <Typography variant="body1">
            {props.errorMessage}
          </Typography>
        </Paper>
      </div>

      <div className={classes.os}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">
              Open Source
            </Typography>

            <br />

            <Typography variant="body1">
              GTasks UI is open-sourced on GitHub. Contributions and feedback are welcome!
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

export default LoadError;
