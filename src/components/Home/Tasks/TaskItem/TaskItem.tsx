import React, { useState, Fragment } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Task } from '../../../../services/GoogleTasks';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CalendarIcon  from '@material-ui/icons/CalendarToday';
import { Checkbox } from '@material-ui/core';
import Linkify from 'react-linkify';
import Button from '@material-ui/core/Button';
import TaskList from '../TaskList';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider'

interface IProps {
  task: Task
}

const useStyles = makeStyles(theme => ({
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

const TaskItem: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const { task } = props;
  const [checked, setChecked] = useState(task.completed);

  const due = task.dueAt ? (
    <span>
      <br />
      <Button variant="contained"  size="small" className={classes.due}>
        <CalendarIcon className={task.dueAt.isBefore() ? classes.past : classes.future} />
        <span title={task.dueAt.format("D MMM YYYY")}>
          {task.dueAt.fromNow()}
        </span>
      </Button>
    </span>) : null

  const secondary = (
    <span>
      <Linkify>
        {task.notes}
      </Linkify>
      {due}
    </span>
  );

  const [open, setOpen] = React.useState(false);

  function handleClick() {
    setOpen(!open);
  }

  return (
    <Fragment>
      <ListItem button>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={task.completed}
            tabIndex={-1}
            color="primary"
            inputProps={{ 'aria-labelledby': task.id }}
          />
        </ListItemIcon>

        <ListItemText
          id={task.id}
          primary={task.title}
          secondary={secondary}
        />

        {task.subtasks.length > 0 && (
          open ? <ExpandLess onClick={handleClick} /> : <ExpandMore onClick={handleClick} />
        )}
      </ListItem>
      <Divider />
      {task.subtasks.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <TaskList tasks={task.subtasks} nested />
        </Collapse>
      )}
    </Fragment>
  );
}

export default TaskItem;
