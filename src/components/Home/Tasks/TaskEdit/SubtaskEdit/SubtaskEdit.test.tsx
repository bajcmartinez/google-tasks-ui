import React from 'react';
import { shallow } from 'enzyme';
import SubtaskEdit from './SubtaskEdit';
import { Task } from '../../../../services/GoogleTasks';
import moment from 'moment';

it('should render without crashing', () => {
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

  const titleBar = shallow(<SubtaskEdit task={task} />);
  expect(titleBar.exists()).toBe(true);
});
