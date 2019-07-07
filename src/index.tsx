import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';

import lightTheme from './themes/light';

import { initStore } from './stores';
import App from './components/App';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

const store = initStore({});
const theme = lightTheme;

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <SnackbarProvider
              maxSnack={3}
              autoHideDuration={1000}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
            >
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <App />
              </MuiPickersUtilsProvider>
            </SnackbarProvider>
        </ThemeProvider>
    </Provider>, document.getElementById('root'));
