import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { pink, grey } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: grey,
    secondary: pink,
    type: 'dark'
  },
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: "#212121",
        color: '#fff'
      }
    }
  }
});

export default theme;