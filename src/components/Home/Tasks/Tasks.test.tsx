import React from 'react';
import { mount, shallow } from 'enzyme'
import Tasks from './Tasks';
import { Task, TaskList } from '../../../services/GoogleTasks'
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Fab } from '@material-ui/core'


describe("Basic", () => {
  it('should render without crashing', () => {
    const taskList: TaskList = {
      id: "1",
      status: "active",
      title: "Task List 1",
      updatedAt: moment()
    }

    const titleBar = shallow(
      <Tasks
        tasks={[]}
        selectedTaskListId="1"
        taskLists={[taskList]}
        title="Task List 1"
        insertTask={() => null}
        updateTask={() => null}
        updateTaskCompletion={() => null}
        deleteTask={() => null}
        setSelectedTask={() => null}
      />
    );
    expect(titleBar.exists()).toBe(true);
  });
});

describe("Events", () => {

  it('should trigger the selected item event', () => {
    const handler = jest.fn();

    const taskList: TaskList = {
      id: "1",
      status: "active",
      title: "Task List 1",
      updatedAt: moment()
    }

    const tasks: Task[] = [
      {
        id: '1',
        title: 'Task 1',
        notes: 'notes',
        subtasks: [],
        listId: '1',
        isDirty: false,
        dueAt: moment(),
        completed: false,
        status: "needsAction",
        updatedAt: moment(),
        parent: ""
      },
      {
        id: '2',
        title: 'Task 2',
        notes: 'notes 2',
        subtasks: [],
        listId: '1',
        isDirty: false,
        dueAt: moment(),
        completed: false,
        status: "needsAction",
        updatedAt: moment(),
        parent: ""
      }
    ]

    mount(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Tasks
          tasks={tasks}
          selectedTaskListId="1"
          taskLists={[taskList]}
          title="Task List 1"
          insertTask={() => null}
          updateTask={() => null}
          updateTaskCompletion={() => null}
          deleteTask={() => null}
          setSelectedTask={handler}
        />
      </MuiPickersUtilsProvider>
    );

    expect(handler).toBeCalled();
  });

  it('should trigger the insert item event', () => {
    const handler = jest.fn();

    const taskList: TaskList = {
      id: "1",
      status: "active",
      title: "Task List 1",
      updatedAt: moment()
    }

    const tasks: Task[] = [
      {
        id: '1',
        title: 'Task 1',
        notes: 'notes',
        subtasks: [],
        listId: '1',
        isDirty: false,
        dueAt: moment(),
        completed: false,
        status: "needsAction",
        updatedAt: moment(),
        parent: ""
      }
    ]

    const wrapper = mount(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Tasks
          tasks={tasks}
          selectedTaskListId="1"
          taskLists={[taskList]}
          title="Task List 1"
          insertTask={handler}
          updateTask={() => null}
          updateTaskCompletion={() => null}
          deleteTask={() => null}
          setSelectedTask={() => null}
        />
      </MuiPickersUtilsProvider>
    );

    const userButton = wrapper.find(Fab).first();
    userButton.simulate('click');

    expect(handler).toBeCalled();
  });

});
