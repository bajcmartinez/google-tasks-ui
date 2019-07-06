import React, { useEffect, useReducer } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import useTheme from '@material-ui/core/styles/useTheme';

import TitleBar from '../TitleBar';
import Menu from './Menu';
import { useSnackbar } from 'notistack';

import {
  initialTaskListsState,
  taskListsReducer,
} from '../../reducers/taskLists'
import { receiveTaskLists } from '../../actions/taskLists'
import GoogleTasksService, { Task, TaskList } from '../../services/GoogleTasks'
import { initialTasksState, tasksReducer } from '../../reducers/tasks'
import {
  receiveTasksAction, updateTaskAction,
  updateTaskCompletionAction,
} from '../../actions/tasks'
import Tasks from './Tasks'

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
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
    padding: theme.spacing(3)
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [taskListId, setTaskListId] = React.useState("all");
  const [taskListTitle, setTaskListTitle] = React.useState("All Tasks");

  const [taskListsState, taskListsDispatch] = useReducer(taskListsReducer, initialTaskListsState);
  const [tasksState, tasksDispatch] = useReducer(tasksReducer, initialTasksState);

  const { enqueueSnackbar } = useSnackbar();

  function refreshData() {
    GoogleTasksService.listTaskLists().then((taskLists: TaskList[]) => {
      taskListsDispatch(receiveTaskLists(taskLists));

      const allTasks:Task[] = [];
      taskLists.forEach((list: TaskList) => {
        GoogleTasksService.listTasks(list.id).then((tasks: Task[]) => {
          allTasks.push(...tasks);
          tasksDispatch(receiveTasksAction(allTasks));
        });
      })
    });
  }

  async function updateTaskCompletion(taskId: string, listId: string, completed: boolean) {
    try {
      // We update the UI meanwhile the API is doing it's stuff, we trust it just works
      tasksDispatch(updateTaskCompletionAction(taskId, listId, completed));
      await GoogleTasksService.updateTaskCompletion(taskId, listId, completed);

    } catch (error) {
      console.error("Error updating completion", error);
      // but if it fails we need to revert back, we just wait a bit because the UI may still be updating
      // and we want to show the user an error before popping up again the item
      enqueueSnackbar('Error updating the task, please try again!', {variant: 'error'});

      setTimeout(() => tasksDispatch(updateTaskCompletionAction(taskId, listId, !completed)), 1000);
    }
  }

  async function updateTask(task: Task) {
    const current = { ...tasksState.list.find((find: Task) => find.id === task.id) } as Task;
    try {
      // We update the UI meanwhile the API is doing it's stuff, we trust it just works
      tasksDispatch(updateTaskAction(task));
      await GoogleTasksService.updateTask(task);
      enqueueSnackbar('Task updated!', {variant: 'success'});

    } catch (error) {
      console.error("Error updating task", error);
      // but if it fails we need to revert back, we just wait a bit because the UI may still be updating
      // and we want to show the user an error before popping up again the item
      enqueueSnackbar('Error updating the task, please try again!', {variant: 'error'});

      setTimeout(() => tasksDispatch(updateTaskAction(current)), 1000);
    }
  }

  useEffect(() => {
    refreshData();
  }, []);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  function handleSelectedTaskListChanged(id: string, title: string) {
    setTaskListId(id);
    setTaskListTitle(title);
  }

  const drawer = (<Menu taskLists={taskListsState.list} selectedTaskListChanged={handleSelectedTaskListChanged} />);

  // Filter tasks on the screen
  const tasks = tasksState.list.filter((task: Task) =>
    !task.parent // Tasks without parents
    && (taskListId === "all" || taskListId === task.listId) // Tasks for the current list
    && !task.completed // Show only incompleted tasks
  )

  return (
    <div className={classes.root}>
      <TitleBar
        title="Google Tasks UI"
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

        <Tasks
            tasks={tasks}
            title={taskListTitle}
            updateTaskCompletion={updateTaskCompletion}
            updateTask={updateTask}
            taskLists={taskListsState.list} />
      </main>
    </div>
  );
}

export default Home;
