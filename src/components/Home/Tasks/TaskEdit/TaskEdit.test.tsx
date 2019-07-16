import React, { ChangeEvent } from 'react'
import { shallow, mount } from 'enzyme';
import TaskEdit from './TaskEdit';
import { Task, TaskList } from '../../../../services/GoogleTasks'
import moment from 'moment';
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import TextField from '@material-ui/core/TextField';
import { act } from 'react-dom/test-utils'
import { Button } from '@material-ui/core'

describe("Basic", () => {
  it('should render without crashing', () => {
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
        listId: '1',
        isDirty: false
      } as Task],
      isDirty: false
    }

    const taskEdit = shallow(
      <TaskEdit
        task={task}
        taskLists={[]}
        deleteTask={() => null}
        updateTask={() => null}
      />
    );
    expect(taskEdit.exists()).toBe(true);
  });

  it('should render a <TaskEdit /> component as expected', () => {
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
        listId: '1',
        isDirty: false
      } as Task],
      isDirty: false
    }

    const taskLists: TaskList[] = [{
      id: "1",
      status: "active",
      title: "Task List 1",
      updatedAt: moment()
    }]

    const taskEdit = mount(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <TaskEdit
          task={task}
          taskLists={taskLists}
          deleteTask={() => null}
          updateTask={() => null}
        />
      </MuiPickersUtilsProvider>
    );

    expect(taskEdit).toMatchSnapshot();
  });
});

describe("Events", () => {

  it('should trigger the text change event', () => {
    jest.useFakeTimers();

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

    const taskEdit = mount(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <TaskEdit
          task={task}
          taskLists={[]}
          deleteTask={() => null}
          updateTask={handler}
        />
      </MuiPickersUtilsProvider>
    );

    const textField = taskEdit.find(TextField).first().props();

    act(() => {
      textField.onChange && textField.onChange({
        target: {
          value: "new title"
        }
      } as ChangeEvent<HTMLInputElement>);
    });

    // As events are debounced, let's wait a bit
    jest.runAllTimers();

    expect(handler).toBeCalled();
  });

  it('should trigger the delete event', () => {
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

    const taskEdit = mount(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <TaskEdit
          task={task}
          taskLists={[]}
          deleteTask={handler}
          updateTask={() => null}
        />
      </MuiPickersUtilsProvider>
    );

    const deleteButton = taskEdit.find(Button).first();
    deleteButton.simulate('click');


    expect(handler).toBeCalled();
  });

});
