import React, { ChangeEvent, useEffect } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Task, TaskList } from '../../../../services/GoogleTasks';
import CalendarIcon  from '@material-ui/icons/CalendarToday';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import { DateTimePicker, MaterialUiPickersDate } from '@material-ui/pickers'
import { Moment } from 'moment'
import InputAdornment from '@material-ui/core/InputAdornment'

interface IProps {
  task?: Task,
  taskLists: TaskList[],
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
  }
}));

const TaskEdit: React.FC<IProps> = (props) => {
  const classes = useStyles();

  const [task, setTask] = React.useState<Task | null>(null);

  useEffect(() => {
    setTask(props.task ? { ...props.task } : null);
  }, [props.task])

  if (!task) {
    return <div>No task selected</div>;
  }

  const handleChange = (name:string) => (event:ChangeEvent<HTMLInputElement>) => {
    setTask({ ...task, [name]: event.target.value });
  };

  const handleDueDateChange = (date: MaterialUiPickersDate) => {
    setTask({
      ...task,
      dueAt: date as Moment
    })
  }

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
          <DateTimePicker
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
      </Grid>
    </form>
  );
}

export default TaskEdit;
