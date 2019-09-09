import React, { Fragment } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Task } from '../../../../../types/google';
import List  from '@material-ui/core/List';
import TaskItem from '../../TaskItem/TaskItem'
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Typography from '@material-ui/core/Typography';
import { ISettings } from '../../../../../types';

interface IProps {
  settings: ISettings,
  title?: string,
  tasks: Task[],
  nested?: boolean,
  updateTaskCompletion: (task: string, tasklist: string, completed: boolean) => void,
  handleSelectedTaskChanged?: (task: Task) => void
}

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },

  row: {
    transition: 'all 500ms linear'
  },

  rowExit: {
    maxHeight: 999,
    overflowY: 'auto'
  },

  rowExitActive: {
    overflowY: 'hidden',
    maxHeight: 0
  }
}));

const ListView: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const { tasks, title } = props;

  const header = title ? (
    <Typography variant="h6">
      {props.title}
    </Typography>
  ) : null;

  return (
    <Fragment>
      {header}
      <List component="ul" className={props.nested ? classes.nested : undefined}>
        <TransitionGroup>
          {tasks.map((task: Task) => (
            <CSSTransition
              key={task.id}
              timeout={500}
              enter={false}
              classNames={{
                exit: classes.rowExit,
                exitActive: classes.rowExitActive
              }}
            >
              <div className={classes.row}>
                <TaskItem
                  settings={props.settings}
                  task={task}
                  updateTaskCompletion={props.updateTaskCompletion}
                  handleSelectedTaskChanged={props.handleSelectedTaskChanged}
                />
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </List>
    </Fragment>
  );
}

export default React.memo(ListView);
