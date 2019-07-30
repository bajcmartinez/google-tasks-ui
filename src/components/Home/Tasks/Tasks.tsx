import React, { useEffect, useState } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Task, TaskList as TaskListType } from '../../../services/GoogleTasks';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TaskList from './TaskList';
import TaskEdit from './TaskEdit'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Zoom from '@material-ui/core/Zoom'

interface IProps {
  tasks: Task[],
  taskLists: TaskListType[],
  selectedTask?: Task,
  selectedTaskListId: string,
  title: string,
  updateTaskCompletion: (task: string, tasklist: string, completed: boolean) => void,
  setSelectedTask: (task: Task) => void,
  updateTask: (task: Task) => void,
  insertTask: (task: Task) => void,
  deleteTask: (task: Task) => void
}

const useStyles = makeStyles(theme => ({
  section: {
    padding: theme.spacing(3, 2),
    height: 'calc(100vh - 100px)',
    overflowY: 'scroll',
    position: 'relative'
  },

  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const Tasks: React.FC<IProps> = (props) => {
  const classes = useStyles();

  const handleSelectedTaskChanged = (task: Task):void => {
    props.setSelectedTask(task);
  };

  const handleInsertTask = (): void => {
    props.insertTask({
      title: '',
      notes: '',
      listId: props.selectedTaskListId,
      subtasks: [] as Task[]
    } as Task);
  };

  const { selectedTask } = props;
  const [ tasks, setTasks ] = useState<Task[]>([])

  useEffect(() => {
    setTasks(props.tasks.sort((a: Task, b: Task) => ((a.dueAt || new Date()) < (b.dueAt || new Date())) ? -1 : 1));
  }, [props.tasks]);

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
            <Typography variant="h6">
              {props.title}
            </Typography>

            <TaskList tasks={tasks} handleSelectedTaskChanged={handleSelectedTaskChanged} updateTaskCompletion={props.updateTaskCompletion} />

            <Zoom in={props.selectedTaskListId !== 'all'} unmountOnExit>
              <Fab
                aria-label={"Insert Task"}
                className={classes.fab}
                color="primary"
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
                taskLists={props.taskLists}
                updateTask={props.updateTask}
                deleteTask={props.deleteTask}
            />
          </Paper>
        </Grid>
      </Grid>


    </div>
  );
};

export default Tasks;
