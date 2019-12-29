import React, {ChangeEvent, useEffect, useRef} from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Task, TaskList } from '../../../../types/google';
import CalendarIcon  from '@material-ui/icons/Event';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { Moment } from 'moment'
import { debounce } from 'throttle-debounce'
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import SubtaskEdit from "./SubtaskEdit";
import Button from "@material-ui/core/Button";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton'

interface IProps {
  task?: Task,
  taskLists: TaskList[],
  insertTask: (task: Task) => void,
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
  },

  subtasks: {
    display: 'flex'
  },

  spacer: {
    flexGrow: 1
  }
}));

const TaskEdit: React.FC<IProps> = (props) => {
  const classes = useStyles();

  const [task, setTask] = React.useState<Task | null>(null);

  let titleInput: HTMLInputElement | null = null;

  const updateTask = useRef(debounce(500, (task: Task | null, updateTask: (task: Task) => void) => {
    if (task && task.isDirty) {
      updateTask({
        ...task,
        isDirty: false
      });
    }
  }));

  // Reset the form when the task props changes
  useEffect(() => {
    // Update the edit form only if we have selected a new task
    // This prevents the screen from updating and replacing the user content with the background update
    if (!task || !props.task || task.id !== props.task.id) {
      setTask(props.task ? {...props.task} : null);
      titleInput && titleInput.focus();
    }
    if (task && props.task && task.subtasks.length !== props.task.subtasks.length) {
      setTask({
        ...task,
        subtasks: props.task.subtasks
      });
    }
  }, [props.task, task, titleInput]);

  if (!task) {
    return <div>No task selected</div>;
  }

  const handleInsertTask = (): void => {
    props.insertTask({
      title: '',
      notes: '',
      parent: task.id,
      listId: task.listId,
      subtasks: [] as Task[]
    } as Task);
  };

  const handleChange = (name:string) => (event:ChangeEvent<HTMLInputElement>) => {
    const newTask = {
      ...task,
      [name]: event.target.value,
      isDirty: true
    };
    setTask(newTask);

    updateTask.current(newTask, props.updateTask);
  };

  const handleDueDateChange = (date: Moment | null) => {
    const newTask = {
      ...task,
      dueAt: date || undefined,
      isDirty: true
    };
    setTask(newTask);
    updateTask.current(newTask, props.updateTask);
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
            data-test-id="task-edit-title"
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
          <KeyboardDatePicker
            clearable
            variant="inline"
            label="Due At"
            value={taskEdit.dueAt ? taskEdit.dueAt : null}
            format="MMM DD, YYYY"
            onChange={handleDueDateChange}
            keyboardIcon={due}
          />
        </Grid>

        <Grid item xs={12}>

          <div className={classes.subtasks}>
            <Typography variant="h5">
              Subtasks
            </Typography>
            <div className={classes.spacer} />
            <IconButton
              title="Add Subtask"
              aria-label="Add Subtask"
              size="small"
              onClick={handleInsertTask}
            >
              <AddIcon />
            </IconButton>
          </div>

          <List component="ul">
            {task.subtasks.length > 0 ?
              task.subtasks.map((subtask: Task) => (
                <SubtaskEdit
                    key={subtask.id}
                    updateTask={props.updateTask}
                    deleteTask={props.deleteTask}
                    task={subtask}
                />
              )) : <Typography variant="body1">No sub-tasks</Typography>
            }
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
