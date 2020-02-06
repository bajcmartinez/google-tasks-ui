import React, { ChangeEvent, useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import ListViewIcon from '@material-ui/icons/ViewList';
import ComfortViewIcon from '@material-ui/icons/ViewStream';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DueDateView from './TaskViews/DueDateView/DueDateView';
import { ISettings } from '../../types';
import TaskEdit from './TaskEdit';
import ListView from './TaskViews/ListView';
import { Task, TaskList as TaskListType } from '../../types/google';

interface IProps {
  settings: ISettings;
  tasks: Task[];
  taskLists: TaskListType[];
  selectedTask?: Task;
  selectedTaskListId: string;
  title: string;
  updateTaskCompletion: (task: string, tasklist: string, completed: boolean) => void;
  setSelectedTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  insertTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
  switchSetting: (key: string, value: any) => void;
}

const useStyles = makeStyles(theme => ({
  section: {
    padding: theme.spacing(1, 2, 3, 2),
    height: 'calc(100vh - 100px)',
    overflowY: 'scroll',
    position: 'relative',
  },

  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },

  sectionTopBar: {
    display: 'flex',
    alignItems: 'center',
  },

  spacer: {
    flexGrow: 1,
  },
}));

const Tasks: React.FC<IProps> = ({
  settings,
  switchSetting,
  taskLists,
  tasks,
  setSelectedTask,
  selectedTaskListId,
  insertTask,
  updateTask,
  updateTaskCompletion,
  deleteTask,
  selectedTask,
  title,
}) => {
  const classes = useStyles();

  const handleSelectedTaskChanged = (task: Task): void => {
    setSelectedTask(task);
  };

  const handleInsertTask = (): void => {
    insertTask({
      title: '',
      notes: '',
      listId: selectedTaskListId,
      subtasks: [] as Task[],
    } as Task);
  };

  useEffect(() => {
    if (tasks.length > 0)
      if (selectedTask) {
        // Only select the first if the selected task is not anymore on the list
        const st = tasks.find((find: Task) => find.id === selectedTask.id) || tasks[0];
        handleSelectedTaskChanged(st);
      } else {
        handleSelectedTaskChanged(tasks[0]);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, selectedTask]);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.section}>
            <div className={classes.sectionTopBar}>
              <Typography variant="body1">View:</Typography>
              &nbsp;
              <TextField
                label=""
                value={settings.taskView}
                onChange={(event: ChangeEvent<HTMLInputElement>) => switchSetting('taskView', event.target.value)}
                select
              >
                <MenuItem dense value="DueDateView">
                  Due Date
                </MenuItem>
                <MenuItem dense value="ListView">
                  List
                </MenuItem>
              </TextField>
              <div className={classes.spacer} />
              <IconButton
                color="default"
                aria-label="Switch View"
                size="small"
                onClick={() => switchSetting('comfortView', !settings.comfortView)}
              >
                {settings.comfortView ? (
                  <ComfortViewIcon titleAccess="Switch to Comfort View" />
                ) : (
                  <ListViewIcon titleAccess="Switch to List View" />
                )}
              </IconButton>
            </div>

            {settings.taskView === 'ListView' && (
              <ListView
                settings={settings}
                title={title}
                tasks={tasks}
                handleSelectedTaskChanged={handleSelectedTaskChanged}
                updateTaskCompletion={updateTaskCompletion}
              />
            )}

            {settings.taskView === 'DueDateView' && (
              <DueDateView
                settings={settings}
                tasks={tasks}
                handleSelectedTaskChanged={handleSelectedTaskChanged}
                updateTaskCompletion={updateTaskCompletion}
              />
            )}

            <Zoom in={selectedTaskListId !== 'all'} unmountOnExit>
              <Fab
                aria-label="Insert Task"
                className={classes.fab}
                color="primary"
                data-test-id="tasks-add-button"
                onClick={handleInsertTask}
              >
                <AddIcon />
              </Fab>
            </Zoom>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className={classes.section}>
            <TaskEdit
              task={selectedTask}
              taskLists={taskLists}
              insertTask={insertTask}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Tasks;
