import React from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { shallow } from 'enzyme';

import TitleBar from './TitleBar';
import {MenuItem} from "@material-ui/core";

describe("Basic", () => {
  it('should render without crashing', () => {
    const titleBar = shallow(<TitleBar
      title="Test Title"
      drawerWidth={240}
      signOut={() => null}
      handleDrawerToggle={() => null}
    />);
    expect(titleBar.exists()).toBeTruthy();
  });

  it("should display the right title", () => {
    const titleBar = shallow(<TitleBar
      title="Test Title"
      drawerWidth={240}
      signOut={() => null}
      handleDrawerToggle={() => null}
    />);

    expect(titleBar.find(Typography).first().text()).toBe("Test Title");

    titleBar.setProps({title: 'New Title'});
    expect(titleBar.find(Typography).first().text()).toBe("New Title");
  });
});

describe("Events", () => {
  it('handles the drawer toggle call', () => {
    const handler = jest.fn();

    const titleBar = shallow(<TitleBar
        title="Test Title"
        drawerWidth={240}
        signOut={() => null}
        handleDrawerToggle={handler}/>);

    const drawerToggle = titleBar.find(IconButton).first();
    drawerToggle.simulate('click');

    expect(handler).toBeCalled();
  });

  it('handles the sign out call', () => {
    const handler = jest.fn();

    const titleBar = shallow(<TitleBar
        title="Test Title"
        drawerWidth={240}
        signOut={handler}
        handleDrawerToggle={() => null}/>);

    const signOutButton = titleBar.find(MenuItem).first();
    signOutButton.simulate('click');

    expect(handler).toBeCalled();
  });

  it('handles the menu call', () => {
    const titleBar = shallow(<TitleBar
        title="Test Title"
        drawerWidth={240}
        signOut={() => null}
        handleDrawerToggle={() => null}/>);

    const userButton = titleBar.find(IconButton).at(1);
    userButton.simulate('click', {
      currentTarget: null
    });
  });
});