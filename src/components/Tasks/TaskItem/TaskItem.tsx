import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CalendarIcon from '@material-ui/icons/Event';
import { Checkbox } from '@material-ui/core';
import Linkify from 'react-linkify';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import TaskList from '../TaskViews/ListView';
import { Task } from '../../../types/google';
import { ISettings } from '../../../types';

interface IProps {
  settings: ISettings;
  task: Task;
  updateTaskCompletion: (task: string, tasklist: string, completed: boolean) => void;
  handleSelectedTaskChanged?: (task: Task) => void;
}

const useStyles = makeStyles(theme => ({
  due: {
    ...theme.typography.body2,
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
}));

const TaskItem: React.FC<IProps> = ({ task, settings, updateTaskCompletion, handleSelectedTaskChanged }) => {
  const classes = useStyles();

  const [checked, setChecked] = useState(task.completed);

  const due = task.dueAt ? (
    <span>
      <br />
      <Button variant="contained" size="small" className={classes.due}>
        <CalendarIcon className={task.dueAt.isBefore() ? classes.past : classes.future} />
        <span title={task.dueAt.format('D MMM YYYY')}>{task.dueAt.fromNow()}</span>
      </Button>
    </span>
  ) : null;

  const secondary = (
    <span>
      <Linkify>{task.notes}</Linkify>
      {!settings.comfortView && due}
    </span>
  );

  const [open, setOpen] = React.useState(false);

  const handleOpenSubTasks = () => {
    setOpen(!open);
  };

  const handleCompletedChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);

    updateTaskCompletion(task.id, task.listId, event.target.checked);
  };

  const handleSelection = () => {
    if (handleSelectedTaskChanged) handleSelectedTaskChanged(task);
  };

  return (
    <>
      <ListItem button onClick={handleSelection} data-test-id={`task-item-${task.id}`} dense={settings.comfortView}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked}
            onChange={handleCompletedChanged}
            tabIndex={-1}
            color="primary"
            inputProps={{ 'aria-labelledby': task.id }}
          />
        </ListItemIcon>

        <ListItemText id={task.id} primary={task.title} secondary={secondary} />

        {task.subtasks.length > 0 &&
          (open ? <ExpandLess onClick={handleOpenSubTasks} /> : <ExpandMore onClick={handleOpenSubTasks} />)}
      </ListItem>
      <Divider />
      {task.subtasks.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <TaskList settings={settings} tasks={task.subtasks} nested updateTaskCompletion={updateTaskCompletion} />
        </Collapse>
      )}
    </>
  );
};

const arePropsEqual = (prevProps: IProps, nextProps: IProps) => {
  // Only renders when title, notes, dueDate or subtasks changes
  return (
    JSON.stringify(prevProps.task) === JSON.stringify(nextProps.task) &&
    prevProps.settings.comfortView === nextProps.settings.comfortView
  );
};

export default React.memo(TaskItem, arePropsEqual);
