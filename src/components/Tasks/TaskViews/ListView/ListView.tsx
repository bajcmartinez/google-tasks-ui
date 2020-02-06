import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import List from '@material-ui/core/List';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Typography from '@material-ui/core/Typography';
import TaskItem from '../../TaskItem';
import { Task } from '../../../../types/google';
import { ISettings } from '../../../../types';

interface IProps {
  settings: ISettings;
  title?: string;
  tasks: Task[];
  nested?: boolean;
  updateTaskCompletion: (task: string, tasklist: string, completed: boolean) => void;
  handleSelectedTaskChanged?: (task: Task) => void;
}

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },

  row: {
    transition: 'all 500ms linear',
  },

  rowExit: {
    maxHeight: 999,
    overflowY: 'auto',
  },

  rowExitActive: {
    overflowY: 'hidden',
    maxHeight: 0,
  },
}));

const ListView: React.FC<IProps> = ({
  title,
  nested,
  tasks,
  settings,
  updateTaskCompletion,
  handleSelectedTaskChanged,
}) => {
  const classes = useStyles();

  const header = title ? <Typography variant="h6">{title}</Typography> : null;

  return (
    <>
      {header}
      <List component="ul" className={nested ? classes.nested : undefined}>
        <TransitionGroup>
          {tasks.map((task: Task) => (
            <CSSTransition
              key={task.id}
              timeout={500}
              enter={false}
              classNames={{
                exit: classes.rowExit,
                exitActive: classes.rowExitActive,
              }}
            >
              <div className={classes.row}>
                <TaskItem
                  settings={settings}
                  task={task}
                  updateTaskCompletion={updateTaskCompletion}
                  handleSelectedTaskChanged={handleSelectedTaskChanged}
                />
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </List>
    </>
  );
};

export default React.memo(ListView);
