import React, { Fragment } from 'react';
import moment from 'moment';
import { Task } from '../../../../types/google';
import { ISettings } from '../../../../types';
import ListView from '../ListView/ListView';

interface IProps {
  settings: ISettings;
  tasks: Task[];
  nested?: boolean;
  updateTaskCompletion: (task: string, tasklist: string, completed: boolean) => void;
  handleSelectedTaskChanged?: (task: Task) => void;
}

type Section = {
  title: string;
  tasks: Task[];
};

const DueDateView: React.FC<IProps> = ({
  settings,
  updateTaskCompletion,
  nested,
  handleSelectedTaskChanged,
  tasks,
}) => {
  const sections: Section[] = [
    {
      title: 'Due',
      tasks: tasks.filter((task: Task) => task.dueAt && task.dueAt.isBefore(moment(), 'day')),
    },
    {
      title: 'Today',
      tasks: tasks.filter((task: Task) => task.dueAt && task.dueAt.isSame(moment(), 'day')),
    },
    {
      title: 'Tomorrow',
      tasks: tasks.filter((task: Task) => task.dueAt && task.dueAt.isSame(moment().add(1, 'days'), 'day')),
    },
    {
      title: 'Next 7 days',
      tasks: tasks.filter(
        (task: Task) =>
          task.dueAt &&
          task.dueAt.isAfter(moment().add(1, 'days')) &&
          task.dueAt.isBefore(moment().add(7, 'days'), 'day'),
      ),
    },
    {
      title: 'Later',
      tasks: tasks.filter((task: Task) => !task.dueAt || task.dueAt.isSameOrAfter(moment().add(7, 'days'), 'day')),
    },
  ];

  return (
    <>
      {sections.map(
        (section: Section) =>
          section.tasks.length > 0 && (
            <Fragment key={section.title}>
              <ListView
                title={section.title}
                tasks={section.tasks}
                handleSelectedTaskChanged={handleSelectedTaskChanged}
                settings={settings}
                updateTaskCompletion={updateTaskCompletion}
                nested={nested}
              />
            </Fragment>
          ),
      )}
    </>
  );
};

export default React.memo(DueDateView);
