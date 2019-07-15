import React from 'react';
import Typography from '@material-ui/core/Typography';
import TestRenderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import TitleBar from './TitleBar';

it('renders without crashing', () => {
  const titleBar = shallow(<TitleBar
    title="Test Title"
    drawerWidth={240}
    signOut={() => null}
    handleDrawerToggle={() => null}/>);
  expect(titleBar.exists()).toBe(true);
});

it("displays the right title", () => {
  const titleBar = shallow(<TitleBar
    title="Test Title"
    drawerWidth={240}
    signOut={() => null}
    handleDrawerToggle={() => null}/>);

  expect(titleBar.find(Typography).text()).toBe("Test Title");

  titleBar.setProps({ title: 'New Title'});
  expect(titleBar.find(Typography).text()).toBe("New Title");
});