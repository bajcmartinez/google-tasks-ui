import React from 'react';
import { shallow } from 'enzyme';
import Home from './Home';

it('renders without crashing', () => {
  const titleBar = shallow(<Home />);
  expect(titleBar.exists()).toBe(true);
});
