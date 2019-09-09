import React, {ChangeEvent, useEffect, Fragment, useRef} from 'react'
import { Task } from '../../../../../types/google';
import TextField from '@material-ui/core/TextField';
import { debounce } from 'throttle-debounce'
import ListItem from "@material-ui/core/ListItem";
import {IconButton} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

interface IProps {
  task: Task,
  updateTask: (task: Task) => void,
  deleteTask: (task: Task) => void
}

const SubtaskEdit: React.FC<IProps> = (props) => {
  const [task, setTask] = React.useState<Task>(props.task);
  const debounced = useRef(debounce(500, (task: Task | null) => {
    if (task && task.isDirty) {
      props.updateTask({
        ...task,
        isDirty: false
      });
    }
  }));

  // Reset the form when the task props changes
  useEffect(() => {
    setTask(props.task);
  }, [props.task]);

  // Save when the task changes
  useEffect(() => {
    debounced.current(task);
  }, [task]);

  const handleChange = (name:string) => (event:ChangeEvent<HTMLInputElement>) => {
    setTask({
      ...task,
      [name]: event.target.value,
      isDirty: true
    });
  };

  const taskEdit = { ...task } as Task;

  return (
    <Fragment>
      <ListItem>
        <TextField
            placeholder="Title"
            value={taskEdit.title}
            onChange={handleChange('title')}
            fullWidth
        />

        <IconButton
            color="default"
            aria-label="Delete"
            onClick={() => props.deleteTask(task)}
        >
          <DeleteIcon />
        </IconButton>
      </ListItem>
    </Fragment>
  );
};

export default SubtaskEdit;
