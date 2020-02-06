import React, { ChangeEvent } from 'react';
import { shallow, mount } from 'enzyme';
import ListItem from '@material-ui/core/ListItem';
import moment from 'moment';
import Switch from '@material-ui/core/Switch';
import { TaskList } from '../../types/google';
import Sidebar from './Sidebar';

describe('Basic', () => {
  it('should render without crashing', () => {
    const menu = shallow(
      <Sidebar
        selectedTaskListChanged={() => null}
        taskLists={[]}
        switchDarkMode={() => null}
        insertTaskList={() => null}
      />,
    );
    expect(menu.exists()).toBeTruthy();
  });
});

describe('Events', () => {
  it('should handle the select all event', () => {
    const handler = jest.fn();

    const menu = shallow(
      <Sidebar
        selectedTaskListChanged={handler}
        taskLists={[]}
        switchDarkMode={() => null}
        insertTaskList={() => null}
      />,
    );

    const listItem = menu.find(ListItem).first();
    listItem.simulate('click');

    expect(handler).toBeCalled();
  });

  it('should handle the select task list event', () => {
    const handler = jest.fn();

    const taskList: TaskList = {
      id: '1',
      title: 'Task List 1',
      updatedAt: moment(),
    };

    const menu = shallow(
      <Sidebar
        selectedTaskListChanged={handler}
        taskLists={[taskList]}
        switchDarkMode={() => null}
        insertTaskList={() => null}
      />,
    );

    const listItem = menu.find(ListItem).at(1);
    listItem.simulate('click');

    expect(handler).toBeCalled();
  });

  it('should handle the dark mode event', () => {
    const handler = jest.fn();

    const menu = mount(
      <Sidebar
        selectedTaskListChanged={() => null}
        taskLists={[]}
        switchDarkMode={handler}
        insertTaskList={() => null}
      />,
    );

    const darkModeToggle = menu
      .find(Switch)
      .first()
      .props();
    if (darkModeToggle.onChange) {
      darkModeToggle.onChange({} as ChangeEvent<HTMLInputElement>, true);
    }

    expect(handler).toBeCalled();
  });
});
