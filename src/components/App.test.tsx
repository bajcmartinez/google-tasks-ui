import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

it('should render without crashing', () => {
  const titleBar = shallow(<App />);
  expect(titleBar.exists()).toBe(true);
});
