import React, { ChangeEvent } from 'react'
import { shallow, mount } from 'enzyme';
import Menu from './Menu';
import ListItem from '@material-ui/core/ListItem'
import { TaskList } from '../../../services/GoogleTasks/GoogleTasks'
import moment from 'moment';
import Switch from '@material-ui/core/Switch';

describe("Basic", () => {
  it('renders without crashing', () => {
    const menu = shallow(
      <Menu
        selectedTaskListChanged={() => null}
        taskLists={[]}
        switchDarkMode={() => null}
      />);
    expect(menu.exists()).toBe(true);
  });
});


describe("Events", () => {
  it('should handle the select all event', () => {
    const handler = jest.fn();

    const menu = shallow(<Menu
      selectedTaskListChanged={handler}
      taskLists={[]}
      switchDarkMode={() => null}
    />);

    const listItem = menu.find(ListItem).first();
    listItem.simulate('click');

    expect(handler).toBeCalled();
  });

  it('should handle the select task list event', () => {
    const handler = jest.fn();

    const taskList: TaskList = {
      id: "1",
      status: "active",
      title: "Task List 1",
      updatedAt: moment()
    }

    const menu = shallow(<Menu
      selectedTaskListChanged={handler}
      taskLists={[taskList]}
      switchDarkMode={() => null}
    />);

    const listItem = menu.find(ListItem).at(1);
    listItem.simulate('click');

    expect(handler).toBeCalled();
  });

  it('should handle the dark mode event', () => {
    const handler = jest.fn();

    const menu = mount(<Menu
      selectedTaskListChanged={() => null}
      taskLists={[]}
      switchDarkMode={handler}
    />);

    const darkModeToggle = menu.find(Switch).first().props();
    darkModeToggle.onChange && darkModeToggle.onChange({} as ChangeEvent<HTMLInputElement>, true);

    expect(handler).toBeCalled();
  });
});