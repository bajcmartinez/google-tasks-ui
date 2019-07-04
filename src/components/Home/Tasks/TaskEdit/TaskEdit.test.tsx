import React from 'react';
import { shallow } from 'enzyme';
import TaskEdit from './TaskEdit';
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

  const titleBar = shallow(<TaskEdit task={task} />);
  expect(titleBar.exists()).toBe(true);
});
