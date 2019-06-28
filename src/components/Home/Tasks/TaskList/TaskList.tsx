import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Task } from '../../../../services/GoogleTasks';
import List  from '@material-ui/core/List';
import TaskItem from '../TaskItem'

interface IProps {
  tasks: Task[],
  nested?: boolean
}

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const TaskList: React.FC<IProps> = (props) => {
  const classes = useStyles();

  const tasks = props.tasks.sort((a: Task, b: Task) => ((a.dueAt || new Date()) < (b.dueAt || new Date())) ? -1 : 1);

  return (
    <List component="ul" className={props.nested ? classes.nested : undefined}>
      {tasks.map((task: Task) => (
        <TaskItem task={task} key={task.id} />
      ))}
    </List>
  );
}

export default TaskList;
