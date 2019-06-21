import React from 'react';
import { shallow } from 'enzyme';

import Welcome from './Welcome';

it('renders without crashing', () => {
  const titleBar = shallow(<Welcome signIn={() => null}/>);
  expect(titleBar.exists()).toBe(true);
});