import React, { useEffect, useState } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Task, TaskList as TaskListType } from '../../../services/GoogleTasks';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TaskList from './TaskList';
import TaskEdit from './TaskEdit'

interface IProps {
  tasks: Task[],
  taskLists: TaskListType[],
  title: string,
  updateTaskCompletion: (task: string, tasklist: string, completed: boolean) => void,
  updateTask: (task: Task) => void
  deleteTask: (task: Task) => void
}

const useStyles = makeStyles(theme => ({
  section: {
    padding: theme.spacing(3, 2),
    height: 'calc(100vh - 176px)',
    overflowY: 'scroll'
  },

  fixedSection: {
    padding: theme.spacing(3, 2),
    position: 'fixed',
    height: 'calc(100vh - 176px)',
  }
}));

const Tasks: React.FC<IProps> = (props) => {
  const classes = useStyles();

  const [selectedTask, setSelectedTask] = useState<Task>();

  function handleSelectedTaskChanged(task: Task):void {
    setSelectedTask(task);
  }

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
