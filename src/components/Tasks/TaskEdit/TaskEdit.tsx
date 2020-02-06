import React, { ChangeEvent, useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CalendarIcon from '@material-ui/icons/Event';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Moment } from 'moment';
import { debounce } from 'throttle-debounce';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import SubtaskEdit from './SubtaskEdit';
import { Task, TaskList } from '../../../types/google';

interface IProps {
  task?: Task;
  taskLists: TaskList[];
  insertTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
}

const useStyles = makeStyles(theme => ({
  multiline: {
    minHeight: 60,
  },

  due: {
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    textTransform: 'none',
    marginTop: theme.spacing(1),
  },

  past: {
    color: '#d93025',
    marginRight: theme.spacing(1),
  },

  future: {
    color: '#1a73e8',
    marginRight: theme.spacing(1),
  },

  button: {
    margin: theme.spacing(1),
  },

  rightIcon: {
    marginLeft: theme.spacing(1),
  },

  subtasks: {
    display: 'flex',
  },

  spacer: {
    flexGrow: 1,
  },
}));

const TaskEdit: React.FC<IProps> = ({ task, taskLists, insertTask, updateTask, deleteTask }) => {
  const classes = useStyles();

  const [form, setForm] = useState<Task | null>(null);
  const [debounced, setDebounced] = useState();

  // Rescope variables for debounce
  useEffect(() => {
    setDebounced(() =>
      debounce(500, (updatedTask: Task | null) => {
        if (updatedTask && updatedTask.isDirty) {
          updateTask({
            ...updatedTask,
            isDirty: false,
          });
        }
      }),
    );
  }, [updateTask]);

  let titleInput: HTMLInputElement | null = null;

  // Reset the form when the task props changes
  useEffect(() => {
    // Update the edit form only if we have selected a new task
    // This prevents the screen from updating and replacing the user content with the background update
    if (!form || !task || form.id !== task.id) {
      setForm(task ? { ...task } : null);
      if (titleInput) titleInput.focus();
    }
    if (form && task && form.subtasks.length !== task.subtasks.length) {
      setForm({
        ...form,
        subtasks: task.subtasks,
      });
    }
  }, [task, form, titleInput]);

  if (!form) {
    return <div>No task selected</div>;
  }

  const handleInsertTask = (): void => {
    insertTask({
      title: '',
      notes: '',
      parent: form.id,
      listId: form.listId,
      subtasks: [] as Task[],
    } as Task);
  };

  const handleChange = (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const newTask = {
      ...form,
      [name]: event.target.value,
      isDirty: true,
    };

    setForm(newTask);
    debounced(newTask);
  };

  const handleDueDateChange = (date: Moment | null) => {
    const newTask = {
      ...form,
      dueAt: date || undefined,
      isDirty: true,
    };
    setForm(newTask);
    debounced(newTask);
  };

  const due = form.dueAt ? (
    <CalendarIcon className={form.dueAt.isBefore() ? classes.past : classes.future} />
  ) : (
    <CalendarIcon />
  );

  return (
    <form>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            inputRef={(input: HTMLInputElement) => {
              titleInput = input;
            }}
            label="Title"
            value={form.title}
            data-test-id="task-edit-title"
            onChange={handleChange('title')}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            variant="outlined"
            label="Details"
            value={form.notes}
            multiline
            inputProps={{ className: classes.multiline }}
            onChange={handleChange('notes')}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField label="List" value={form.listId} onChange={handleChange('listId')} select fullWidth>
            {taskLists.map(taskList => (
              <MenuItem key={taskList.id} value={taskList.id}>
                {taskList.title}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <KeyboardDatePicker
            variant="inline"
            label="Due At"
            value={form.dueAt ? form.dueAt : null}
            format="MMM DD, YYYY"
            onChange={handleDueDateChange}
            keyboardIcon={due}
          />
        </Grid>

        <Grid item xs={12}>
          <div className={classes.subtasks}>
            <Typography variant="h5">Subtasks</Typography>
            <div className={classes.spacer} />
            <IconButton title="Add Subtask" aria-label="Add Subtask" size="small" onClick={handleInsertTask}>
              <AddIcon />
            </IconButton>
          </div>

          <List component="ul">
            {form.subtasks.length > 0 ? (
              form.subtasks.map((subtask: Task) => (
                <SubtaskEdit key={subtask.id} updateTask={updateTask} deleteTask={deleteTask} task={subtask} />
              ))
            ) : (
              <Typography variant="body1">No sub-tasks</Typography>
            )}
          </List>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            data-test-id="task-delete-button"
            onClick={() => deleteTask(form)}
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
