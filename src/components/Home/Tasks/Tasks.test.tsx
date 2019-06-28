import React from 'react';
import { shallow } from 'enzyme';
import Tasks from './Tasks';

it('renders without crashing', () => {
  const titleBar = shallow(<Tasks tasks={[]} />);
  expect(titleBar.exists()).toBe(true);
});
