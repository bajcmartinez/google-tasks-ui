import React, {ChangeEvent, useEffect, useRef} from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Task, TaskList } from '../../../../services/GoogleTasks';
import CalendarIcon  from '@material-ui/icons/CalendarToday';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import { DatePicker, MaterialUiPickersDate } from '@material-ui/pickers'
import { Moment } from 'moment'
import InputAdornment from '@material-ui/core/InputAdornment'
import { debounce } from 'throttle-debounce'
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import SubtaskEdit from "./SubtaskEdit";
import Button from "@material-ui/core/Button";
import DeleteIcon from '@material-ui/icons/Delete';

interface IProps {
  task?: Task,
  taskLists: TaskList[],
  updateTask: (task: Task) => void,
  deleteTask: (task: Task) => void
}

const useStyles = makeStyles(theme => ({
  multiline: {
    minHeight: 60
  },

  due: {
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    textTransform: 'none',
    marginTop: theme.spacing(1)
  },

  past: {
    color: '#d93025',
    marginRight: theme.spacing(1)
  },

  future: {
    color: '#1a73e8',
    marginRight: theme.spacing(1)
  },

  button: {
    margin: theme.spacing(1)
  },

  rightIcon: {
    marginLeft: theme.spacing(1)
  }
}));

const TaskEdit: React.FC<IProps> = (props) => {
  const classes = useStyles();

  const [task, setTask] = React.useState<Task | null>(null);
  const debounced = useRef(debounce(500, (task: Task | null) => {
    if (task && task.isDirty) {
      props.updateTask({
        ...task,
        isDirty: false
      });
    }
  }));

  let titleInput: HTMLInputElement | null = null;

  // Reset the form when the task props changes
  useEffect(() => {
    // Update the edit form only if we have selected a new task
    // This prevents the screen from updating and replacing the user content with the background update
    if (!task || !props.task || task.id !== props.task.id) {
      setTask(props.task ? {...props.task} : null);
      titleInput && titleInput.focus();
    }
  }, [props.task, task, titleInput]);

  // Save when the task changes
  useEffect(() => {
    debounced.current(task);
  }, [task]);

  if (!task) {
    return <div>No task selected</div>;
  }

  const handleChange = (name:string) => (event:ChangeEvent<HTMLInputElement>) => {
    setTask({
      ...task,
      [name]: event.target.value,
      isDirty: true
    });
  };

  const handleDueDateChange = (date: MaterialUiPickersDate) => {
    setTask({
      ...task,
      dueAt: date as Moment,
      isDirty: true
    });
  };

  const taskEdit = { ...task } as Task;

  const due = task.dueAt ? (
    <CalendarIcon className={task.dueAt.isBefore() ? classes.past : classes.future} />
    ) : (
    <CalendarIcon />
  );

  return (
    <form>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            inputRef={(input: HTMLInputElement) => { titleInput = input; }}
            label="Title"
            value={taskEdit.title}
            onChange={handleChange('title')}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            variant="outlined"
            label="Details"
            value={taskEdit.notes}
            multiline
            inputProps={{className: classes.multiline}}
            onChange={handleChange('notes')}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="List"
            value={taskEdit.listId}
            onChange={handleChange('listId')}
            select
            fullWidth
          >
            {props.taskLists.map(taskList => (
              <MenuItem key={taskList.id} value={taskList.id}>
                {taskList.title}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <DatePicker
            clearable
            label="Due At"
            value={taskEdit.dueAt ? taskEdit.dueAt : null}
            onChange={handleDueDateChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {due}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>

          <Typography variant="h5">
            Subtasks
          </Typography>

          <List component="ul">
            {task.subtasks.map((subtask: Task) => (
                <SubtaskEdit
                    key={subtask.id}
                    updateTask={props.updateTask}
                    deleteTask={props.deleteTask}
                    task={subtask}
                />
            ))}
          </List>
        </Grid>

        <Grid item xs={12}>
          <Button
              variant="contained"
              color="default"
              className={classes.button}
              data-test-id="task-delete-button"
              onClick={() => props.deleteTask(task)}
          >
            Delete Task
            <DeleteIcon className={classes.rightIcon} />
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default TaskEdit;
