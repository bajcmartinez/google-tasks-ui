import React from 'react';
import 'typeface-roboto';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';

interface IProps {
  title: string,
  drawerWidth: number,
  handleDrawerToggle: () => void
}

const useStyles = makeStyles(theme => ({
  appBar: (props: IProps) => ({
    marginLeft: props.drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${props.drawerWidth}px)`,
    },
  }),

  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));

const TitleBar: React.FC<IProps> = (props) => {
  const classes = useStyles(props);
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          edge="start"
          onClick={props.handleDrawerToggle}
          className={classes.menuButton}
          href="#"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          {props.title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TitleBar;
