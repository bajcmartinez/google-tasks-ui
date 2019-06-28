import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Task } from '../../../services/GoogleTasks';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TaskList from './TaskList'

interface IProps {
  tasks: Task[],
  title: string
}

const useStyles = makeStyles(theme => ({
  section: {
    padding: theme.spacing(3, 2),
  }
}));

const Tasks: React.FC<IProps> = (props) => {
  const classes = useStyles();

  const tasks = props.tasks.sort((a: Task, b: Task) => ((a.dueAt || new Date()) < (b.dueAt || new Date())) ? -1 : 1);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Paper>
            <Typography variant="h6" className={classes.section}>
              {props.title}
            </Typography>

            <TaskList tasks={tasks} />
          </Paper>
        </Grid>
      </Grid>


    </div>
  );
}

export default Tasks;
