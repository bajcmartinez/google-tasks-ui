import React, { Fragment } from 'react'
import { Task } from '../../../../../services/GoogleTasks';
import { ISettings } from '../../../../../types';
import moment from 'moment';
import ListView from '../ListView/ListView'

interface IProps {
  settings: ISettings,
  tasks: Task[],
  nested?: boolean,
  updateTaskCompletion: (task: string, tasklist: string, completed: boolean) => void,
  handleSelectedTaskChanged?: (task: Task) => void
}

type Section = {
  title: string,
  tasks: Task[]
}

const DueDateView: React.FC<IProps> = (props) => {
  const { tasks } = props;

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
