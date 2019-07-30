import React from 'react';
import 'typeface-roboto';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

interface IProps {
  title: string,
  drawerWidth: number,
  handleDrawerToggle: () => void,
  signOut: () => void
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

  grow: {
    flexGrow: 1,
  },
}));

const TitleBar: React.FC<IProps> = (props) => {
  const classes = useStyles(props);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function signOut() {
    handleClose();
    props.signOut();
  }

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

        <div className={classes.grow} />

        <div>
          <IconButton
            aria-label="Account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem data-test-id="menu-sign-out" onClick={signOut}>Sign Out</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TitleBar;
