import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { pink, blue } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
    type: 'light',
  },
});

export default theme;
