import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import SubtaskEdit from './SubtaskEdit';
import { Task } from '../../../../types/google';

it('should render without crashing', () => {
  const task: Task = {
    id: '1',
    title: 'My Title',
    completed: false,
    parent: '',
    updatedAt: moment(),
    status: 'neededAction',
    listId: '1',
    subtasks: [],
    isDirty: false,
  };

  const titleBar = shallow(<SubtaskEdit task={task} updateTask={() => null} deleteTask={() => null} />);
  expect(titleBar.exists()).toBeTruthy();
});
