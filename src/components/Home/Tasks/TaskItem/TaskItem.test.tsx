import React from 'react';
import { shallow } from 'enzyme';
import TaskItem from './TaskItem';
import { Task } from '../../../../services/GoogleTasks';
import moment from 'moment';

it('renders without crashing', () => {
  const task: Task = {
    id: "1",
    title: "My Title",
    completed: false,
    parent: "",
    updatedAt: moment(),
    status: 'neededAction',
    listId: '1',
    subtasks: []
  }

  const titleBar = shallow(<TaskItem task={task} />);
  expect(titleBar.exists()).toBe(true);
});
