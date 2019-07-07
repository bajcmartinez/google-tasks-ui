import React, {ChangeEvent, useEffect, Fragment, useRef} from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Task } from '../../../../../services/GoogleTasks';
import TextField from '@material-ui/core/TextField';
import { debounce } from 'throttle-debounce'
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";

interface IProps {
  task: Task,
  updateTask: (task: Task) => void
}

const useStyles = makeStyles(theme => ({

}));

const SubtaskEdit: React.FC<IProps> = (props) => {
  const classes = useStyles();

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
      </ListItem>
    </Fragment>
  );
};

export default SubtaskEdit;
