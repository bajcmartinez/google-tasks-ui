import React, { useEffect, useReducer } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import useTheme from '@material-ui/core/styles/useTheme';

import TitleBar from '../TitleBar';
import { taskListsReducer } from '../../reducers/taskLists';
import { receiveTaskLists } from '../../actions/taskLists'
import GoogleTasksService, { TaskList } from '../../services/GoogleTasks'

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },

  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },

  toolbar: theme.mixins.toolbar,

  drawerPaper: {
    width: drawerWidth,
  },

  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [state, dispatch] = useReducer(taskListsReducer, {
    list: []
  });

  useEffect(() => {
    GoogleTasksService.listTaskLists().then((taskLists: TaskList[]) => {
      dispatch(receiveTaskLists(taskLists));
    });
  }, []);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const drawer = (
    <div>Hello World I'm a Drawer!</div>
  )

  console.log(state);

  return (
    <div className={classes.root}>
      <TitleBar
        title="Google Tasks Desktop
        "
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle} />
      <nav className={classes.drawer}>
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        Hello World I'm the content
      </main>
    </div>
  );
}

export default Home;
