import React, { ChangeEvent } from 'react'
import { mount, shallow } from 'enzyme'
import TaskItem from './TaskItem';
import { Task } from '../../../../services/GoogleTasks';
import moment from 'moment';
import CalendarIcon  from '@material-ui/icons/Event';
import { ListItemText } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import { act } from 'react-dom/test-utils'
import ListItem from '@material-ui/core/ListItem'
import Collapse from '@material-ui/core/Collapse'
import ExpandMore from '@material-ui/icons/ExpandMore';
import { ExpandLess } from '@material-ui/icons'

describe('Basic', () => {

  it('should render without crashing', () => {
    const task: Task = {
      id: "1",
      title: "My Title",
      completed: false,
      parent: "",
      updatedAt: moment(),
      status: 'neededAction',
      listId: '1',
      subtasks: [],
      isDirty: false
    }

    const taskItem = shallow(
      <TaskItem
        settings={{
          taskView: 'DueDateView',
          comfortView: false,
          darkMode: false
        }}
        task={task}
        updateTaskCompletion={() => null}
        handleSelectedTaskChanged={() => null}
    />);
    expect(taskItem.exists()).toBeTruthy();
  });

  it('should render a calendar if it has a due date', () => {
    const task: Task = {
      id: "1",
      title: "My Title",
      completed: false,
      parent: "",
      dueAt: moment(),
      updatedAt: moment(),
      status: 'neededAction',
      listId: '1',
      subtasks: [],
      isDirty: false
    }

    const taskItem = mount(
      <TaskItem
        settings={{
          taskView: 'DueDateView',
          comfortView: false,
          darkMode: false
        }}
        task={task}
        updateTaskCompletion={() => null}
        handleSelectedTaskChanged={() => null}
      />);

    expect(taskItem.find(CalendarIcon).exists()).toBeTruthy();
  });

  it('should not render a calendar if we have no due date', () => {
    const task: Task = {
      id: "1",
      title: "My Title",
      completed: false,
      parent: "",
      updatedAt: moment(),
      status: 'neededAction',
      listId: '1',
      subtasks: [],
      isDirty: false
    }

    const taskItem = mount(
      <TaskItem
        settings={{
          taskView: 'DueDateView',
          comfortView: false,
          darkMode: false
        }}
        task={task}
        updateTaskCompletion={() => null}
        handleSelectedTaskChanged={() => null}
      />);

    expect(taskItem.find(CalendarIcon).exists()).toBe(false);
  });

  it('should re-render if props change', () => {
    const task: Task = {
      id: "1",
      title: "My Title",
      completed: false,
      parent: "",
      updatedAt: moment(),
      status: 'neededAction',
      listId: '1',
      subtasks: [],
      isDirty: false
    }

    const taskItem = shallow(
      <TaskItem
        settings={{
          taskView: 'DueDateView',
          comfortView: false,
          darkMode: false
        }}
        task={task}
        updateTaskCompletion={() => null}
        handleSelectedTaskChanged={() => null}
      />);

    expect(taskItem.find(ListItemText).first().props().primary).toBe("My Title");

    taskItem.setProps({
      task: {
        ...task,
        title: 'New Title'
      }
    });
    expect(taskItem.find(ListItemText).first().props().primary).toBe("New Title");
  });

});

describe('Events', () => {

  it('should handle the update task completion event', () => {
    const handler = jest.fn();

    const task: Task = {
      id: "1",
      title: "My Title",
      completed: false,
      parent: "",
      updatedAt: moment(),
      status: 'neededAction',
      listId: '1',
      subtasks: [],
      isDirty: false
    }

    const taskItem = mount(
      <TaskItem
        settings={{
          taskView: 'DueDateView',
          comfortView: false,
          darkMode: false
        }}
        task={task}
        updateTaskCompletion={handler}
        handleSelectedTaskChanged={() => null}
      />);

    act(() => {
      const checkbox = taskItem.find(Checkbox).first().props();
      checkbox.onChange && checkbox.onChange({
        target: {
          checked: true
        }
      } as ChangeEvent<HTMLInputElement>, true);
    });

    expect(handler).toBeCalled();
  });

  it('should handle the select task event', () => {
    const handler = jest.fn();

    const task: Task = {
      id: "1",
      title: "My Title",
      completed: false,
      parent: "",
      updatedAt: moment(),
      status: 'neededAction',
      listId: '1',
      subtasks: [],
      isDirty: false
    }

    const taskItem = mount(
      <TaskItem
        settings={{
          taskView: 'DueDateView',
          comfortView: false,
          darkMode: false
        }}
        task={task}
        updateTaskCompletion={() => null}
        handleSelectedTaskChanged={handler}
      />);

    act(() => {
      taskItem.find(ListItem).first().simulate('click');
    });

    expect(handler).toBeCalled();
  });

  it('should render and make subtasks visible', () => {
    const task: Task = {
      id: "1",
      title: "My Title",
      completed: false,
      parent: "",
      updatedAt: moment(),
      status: 'neededAction',
      listId: '1',
      subtasks: [{
        id: "2",
        title: "My subtask",
        completed: false,
        parent: "",
        updatedAt: moment(),
        status: 'neededAction',
        subtasks: [],
        listId: '1',
        isDirty: false
      } as Task],
      isDirty: false
    }

    const taskItem = mount(
      <TaskItem
        settings={{
          taskView: 'DueDateView',
          comfortView: false,
          darkMode: false
        }}
        task={task}
        updateTaskCompletion={() => null}
        handleSelectedTaskChanged={() => null}
      />);

    expect(taskItem.find(Collapse).first().props().in).toBe(false);

    const expandMore = taskItem.find(ExpandMore).first();

    expect(expandMore.exists()).toBeTruthy();
    expect(taskItem.find(ExpandLess).exists()).toBe(false);

    act(() => {
      expandMore.simulate('click');
    });

    taskItem.update();
    expect(taskItem.find(ExpandLess).exists()).toBeTruthy();
    expect(taskItem.find(Collapse).first().props().in).toBeTruthy();
  });

});
