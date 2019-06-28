import React from 'react';
import { shallow } from 'enzyme';
import TaskList from './TaskList';

it('renders without crashing', () => {
  const titleBar = shallow(<TaskList tasks={[]} />);
  expect(titleBar.exists()).toBe(true);
});
