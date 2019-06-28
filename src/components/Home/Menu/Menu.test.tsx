import React from 'react';
import { shallow } from 'enzyme';
import Menu from './Menu';

it('renders without crashing', () => {
  const titleBar = shallow(<Menu selectedTaskListChanged={() => {}} taskLists={[]} />);
  expect(titleBar.exists()).toBe(true);
});
