import React, { useState } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Task } from '../../../services/GoogleTasks';

interface IProps {
  tasks: Task[]
}

const useStyles = makeStyles(theme => ({

}));

const Tasks: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const { tasks } = props;

  return (
    <div>
      Tasks here!

      {tasks.map((task: Task) => (
        <div key={task.id}>
          {task.title}
        </div>
      ))}
    </div>
  );
}

export default Tasks;
