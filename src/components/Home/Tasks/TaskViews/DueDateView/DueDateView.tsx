import React, { Fragment } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Task } from '../../../../../services/GoogleTasks';
import List  from '@material-ui/core/List';
import TaskItem from '../../TaskItem/TaskItem'
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Typography from '@material-ui/core/Typography';
import { ISettings } from '../../../../../types';
import moment from 'moment';
import ListView from '../ListView/ListView'

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

type Section = {
  title: string,
  tasks: Task[]
}

const DueDateView: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const { tasks, title } = props;

  const sections: Section[] = [{
    title: 'Due',
    tasks: tasks.filter((task: Task) => task.dueAt && task.dueAt.isBefore(moment(), 'day'))
  }, {
    title: 'Today',
    tasks: tasks.filter((task: Task) => task.dueAt && task.dueAt.isSame(moment(), "day"))
  }, {
    title: 'Tomorrow',
    tasks: tasks.filter((task: Task) => task.dueAt && task.dueAt.isSame(moment().add(1, 'days'), "day"))
  }, {
    title: 'Next 7 days',
    tasks: tasks.filter((task: Task) => task.dueAt && task.dueAt.isAfter(moment().add(1, 'days')) && task.dueAt.isBefore(moment().add(7, 'days'), "day"))
  }, {
    title: 'Later',
    tasks: tasks.filter((task: Task) => !task.dueAt || task.dueAt.isSameOrAfter(moment().add(7, 'days'), "day"))
  }];

  const header = title ? (
    <Typography variant="h6">
      Due Date View {props.title}
    </Typography>
  ) : null;

  return (
    <Fragment>
      {sections.map((section: Section) => (
        section.tasks.length > 0 && (
          <Fragment key={section.title}>
            <ListView
              {...props}
              title={section.title}
              tasks={section.tasks} />
          </Fragment>
        )
      ))}
    </Fragment>
  );
}

export default React.memo(DueDateView);
