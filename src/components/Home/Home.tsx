import React, { useEffect, useReducer } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import useTheme from '@material-ui/core/styles/useTheme';

import { useSnackbar } from 'notistack';
import LinearProgress from '@material-ui/core/LinearProgress';
import TitleBar from '../TitleBar';
import Sidebar from '../Sidebar';
import { ISettings } from '../../types';
import { initialTaskListsState, taskListsReducer } from '../../reducers/taskLists';
import { receiveTaskLists, insertTaskListAction } from '../../actions/taskLists';
import GoogleTasksService from '../../services/GoogleTasks';
import { Task, TaskList } from '../../types/google';
import { initialTasksState, tasksReducer } from '../../reducers/tasks';
import {
  deleteTaskAction,
  insertTaskAction,
  receiveTasksAction,
  updateTaskAction,
  updateTaskCompletionAction,
} from '../../actions/tasks';
import Tasks from '../Tasks';
import useInterval from '../../hooks/useInterval';

interface IProps {
  settings: ISettings;
  switchDarkMode: () => void;
  switchSetting: (key: string, value: any) => void;
  signOut: () => void;
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
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

const Home: React.FC<IProps> = ({ switchDarkMode, signOut, settings, switchSetting }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [taskListId, setTaskListId] = React.useState('all');
  const [taskListTitle, setTaskListTitle] = React.useState('All Tasks');
  const [selectedTask, setSelectedTask] = React.useState<Task>();
  const [loading, setLoading] = React.useState(false);

  const [taskListsState, taskListsDispatch] = useReducer(taskListsReducer, initialTaskListsState);
  const [tasksState, tasksDispatch] = useReducer(tasksReducer, initialTasksState);

  const { enqueueSnackbar } = useSnackbar();

  const refreshData = async () => {
    setLoading(true);
    try {
      const taskLists = await GoogleTasksService.listTaskLists();
      const allTasks: Task[] = [];
      const promises: Promise<any>[] = [];
      taskLists.forEach((list: TaskList) => {
        promises.push(GoogleTasksService.listTasks(list.id));
      });

      const results = await Promise.all(promises);
      results.forEach((tasks: Task[]) => {
        allTasks.push(...tasks);
      });

      taskListsDispatch(receiveTaskLists(taskLists));
      tasksDispatch(receiveTasksAction(allTasks));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error loading tasks', error);
      // but if it fails we need to revert back, we just wait a bit because the UI may still be updating
      // and we want to show the user an error before popping up again the item
      enqueueSnackbar('Error loading tasks, please try again!', { variant: 'error' });
    }
  };

  async function insertTaskList(taskList: TaskList) {
    try {
      const response = await GoogleTasksService.insertTaskList(taskList);
      taskListsDispatch(
        insertTaskListAction({
          ...taskList,
          id: response.result.id,
        }),
      );

      enqueueSnackbar('Task list created!', { variant: 'success' });
    } catch (error) {
      console.error('Error creating task list', error);
      // but if it fails we need to revert back, we just wait a bit because the UI may still be updating
      // and we want to show the user an error before popping up again the item
      enqueueSnackbar('Error creating the task list, please try again!', { variant: 'error' });
    }
  }

  async function updateTaskCompletion(taskId: string, listId: string, completed: boolean) {
    try {
      // We update the UI meanwhile the API is doing it's stuff, we trust it just works
      tasksDispatch(updateTaskCompletionAction(taskId, listId, completed));
      await GoogleTasksService.updateTaskCompletion(taskId, listId, completed);
    } catch (error) {
      console.error('Error updating completion', error);
      // but if it fails we need to revert back, we just wait a bit because the UI may still be updating
      // and we want to show the user an error before popping up again the item
      enqueueSnackbar('Error updating the task, please try again!', { variant: 'error' });

      setTimeout(() => tasksDispatch(updateTaskCompletionAction(taskId, listId, !completed)), 1000);
    }
  }

  async function updateTask(task: Task) {
    const current = { ...tasksState.list.find((find: Task) => find.id === task.id) } as Task;
    try {
      // We update the UI meanwhile the API is doing it's stuff, we trust it just works
      tasksDispatch(updateTaskAction(task));
      await GoogleTasksService.updateTask(task);
      enqueueSnackbar('Task updated!', { variant: 'success' });
    } catch (error) {
      console.error('Error updating task', error);
      // but if it fails we need to revert back, we just wait a bit because the UI may still be updating
      // and we want to show the user an error before popping up again the item
      enqueueSnackbar('Error updating the task, please try again!', { variant: 'error' });

      tasksDispatch(updateTaskAction(current));
    }
  }

  async function insertTask(task: Task) {
    try {
      const response = await GoogleTasksService.insertTask(task);
      const updatedTask = {
        ...task,
        id: response.result.id,
      };
      tasksDispatch(insertTaskAction(updatedTask));
      setSelectedTask(updatedTask);
      enqueueSnackbar('Task created!', { variant: 'success' });
    } catch (error) {
      console.error('Error creating task', error);
      // but if it fails we need to revert back, we just wait a bit because the UI may still be updating
      // and we want to show the user an error before popping up again the item
      enqueueSnackbar('Error creating the task, please try again!', { variant: 'error' });
    }
  }

  async function deleteTask(task: Task) {
    const current = { ...tasksState.list.find((find: Task) => find.id === task.id) } as Task;
    try {
      // We update the UI meanwhile the API is doing it's stuff, we trust it just works
      tasksDispatch(deleteTaskAction(task.id, task.listId, task.parent));
      await GoogleTasksService.deleteTask(task.id, task.listId);
      enqueueSnackbar('Task deleted!', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting task', error);
      // but if it fails we need to revert back, we just wait a bit because the UI may still be updating
      // and we want to show the user an error before popping up again the item
      enqueueSnackbar('Error updating the task, please try again!', { variant: 'error' });

      setTimeout(() => tasksDispatch(insertTaskAction(current)), 1000);
    }
  }

  useEffect(() => {
    refreshData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInterval(() => {
    refreshData();
  }, 30000);

  // Set the window title
  useEffect(() => {
    document.title = taskListTitle;
  }, [taskListTitle]);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  function handleSelectedTaskListChanged(id: string, title: string) {
    setTaskListId(id);
    setTaskListTitle(title);
  }

  const drawer = (
    <Sidebar
      taskLists={taskListsState.list}
      selectedTaskListChanged={handleSelectedTaskListChanged}
      insertTaskList={insertTaskList}
      switchDarkMode={switchDarkMode}
    />
  );

  // Filter tasks on the screen
  const tasks = tasksState.list.filter(
    (task: Task) =>
      !task.parent && // Tasks without parents
      (taskListId === 'all' || taskListId === task.listId) && // Tasks for the current list
      !task.completed, // Show only incompleted tasks
  );

  return (
    <div className={classes.root}>
      <TitleBar title="GTasks UI" drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} signOut={signOut} />
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

        {loading && <LinearProgress />}

        <Tasks
          settings={settings}
          tasks={tasks}
          title={taskListTitle}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          updateTaskCompletion={updateTaskCompletion}
          insertTask={insertTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
          selectedTaskListId={taskListId}
          taskLists={taskListsState.list}
          switchSetting={switchSetting}
        />
      </main>
    </div>
  );
};

export default Home;
