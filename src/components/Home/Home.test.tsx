import React, { ChangeEvent } from 'react'
import { mount, shallow } from 'enzyme'
import Home from './Home';
import { SnackbarProvider } from 'notistack';
import { act } from 'react-dom/test-utils';
import Tasks from './Tasks'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import GoogleTasksService from '../../services/GoogleTasks'
import { Checkbox } from '@material-ui/core'
import ListItemText from "@material-ui/core/ListItemText";

jest.mock('../../services/GoogleTasks');

describe("Basic", () => {
  it('should render & load initial data without crashing', async () => {
    GoogleTasksService.reset();
    let wrapper: any = undefined;

    // @ts-ignore
    await act(async () => {
      wrapper = await mount(
        <SnackbarProvider>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Home
              switchSetting={() => null}
              settings={{
                taskView: 'DueDateView',
                comfortView: false,
                darkMode: false
              }}
              signOut={() => null}
              switchDarkMode={() => null}
            />
          </MuiPickersUtilsProvider>
        </SnackbarProvider>
      );
    });

    wrapper.update();
    expect(wrapper.find(Home).exists()).toBeTruthy();

    expect(wrapper.find(Tasks).props().taskLists).toHaveLength(2);
    expect(wrapper.find(Tasks).props().tasks).toHaveLength(8);
  });

  it('should render & catch the error to load', async () => {
    GoogleTasksService.reset();
    const listTaskListsFn = GoogleTasksService.listTaskLists;
    GoogleTasksService.listTaskLists = () => Promise.reject("Error");
    let wrapper: any = undefined;

    // @ts-ignore
    await act(async () => {
      wrapper = await mount(
        <SnackbarProvider>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Home
              switchSetting={() => null}
              settings={{
                taskView: 'DueDateView',
                comfortView: false,
                darkMode: false
              }}
              signOut={() => null}
              switchDarkMode={() => null}
            />
          </MuiPickersUtilsProvider>
        </SnackbarProvider>
      );
    });

    wrapper.update();
    expect(wrapper.find(Home).exists()).toBeTruthy();

    expect(wrapper.find(Tasks).props().taskLists).toHaveLength(0);
    expect(wrapper.find(Tasks).props().tasks).toHaveLength(0);

    GoogleTasksService.listTaskLists = listTaskListsFn;
  });

  it('should do a background refresh after n seconds', async () => {
    jest.useFakeTimers();
    GoogleTasksService.reset();
    let wrapper: any = undefined;

    // @ts-ignore
    await act(async () => {
      wrapper = await mount(
          <SnackbarProvider>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Home
                switchSetting={() => null}
                settings={{
                  taskView: 'DueDateView',
                  comfortView: false,
                  darkMode: false
                }}
                signOut={() => null}
                switchDarkMode={() => null}
              />
            </MuiPickersUtilsProvider>
          </SnackbarProvider>
      );
    });

    // Replace the refresh function
    const listTaskListsFn = GoogleTasksService.listTaskLists;
    GoogleTasksService.listTaskLists = jest.fn().mockReturnValue(listTaskListsFn());

    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      jest.advanceTimersByTime(35000); // Advance 35 seconds on the timer
      await wrapper.update();
    });

    expect(GoogleTasksService.listTaskLists).toBeCalledTimes(1);


    GoogleTasksService.listTaskLists = listTaskListsFn;
  });
});

describe("Completion", () => {

  it('should mark the task as completed', async () => {
    jest.useFakeTimers();
    GoogleTasksService.reset();
    let wrapper: any = undefined;

    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      wrapper = await mount(
        <SnackbarProvider>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Home
              switchSetting={() => null}
              settings={{
                taskView: 'DueDateView',
                comfortView: false,
                darkMode: false
              }}
              signOut={() => null}
              switchDarkMode={() => null}
            />
          </MuiPickersUtilsProvider>
        </SnackbarProvider>
      );
    });

    wrapper.update();

    // Now let's mark the task as completed
    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      await wrapper.find('[data-test-id="task-item-1_1"]').first().simulate('click');
      const toggleTaskCompletion = wrapper.find('[data-test-id="task-item-1_1"]').first().find(Checkbox).first().props();
      toggleTaskCompletion.onChange && toggleTaskCompletion.onChange({
        target: {
          checked: true
        }
      } as ChangeEvent<HTMLInputElement>);

      jest.advanceTimersByTime(1000);
    });

    wrapper.update();
    expect(wrapper.find('[data-test-id="task-item-1_1"]').exists()).toBeFalsy();
  });

  it('should leave the task as is if the update fails', async () => {
    jest.useFakeTimers();
    GoogleTasksService.reset();
    const updateTaskCompletionFn = GoogleTasksService.updateTaskCompletion;
    GoogleTasksService.updateTaskCompletion = () => Promise.reject("Error");

    let wrapper: any = undefined;

    // @ts-ignore
    await act(async () => {
      wrapper = await mount(
        <SnackbarProvider>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Home
              switchSetting={() => null}
              settings={{
                taskView: 'DueDateView',
                comfortView: false,
                darkMode: false
              }}
              signOut={() => null}
              switchDarkMode={() => null}
            />
          </MuiPickersUtilsProvider>
        </SnackbarProvider>
      );
    });

    wrapper.update();

    // Now let's mark the task as completed
    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      const toggleTaskCompletion = wrapper.find('[data-test-id="task-item-1_1"]').first().find(Checkbox).first().props();
      toggleTaskCompletion.onChange && toggleTaskCompletion.onChange({
        target: {
          checked: true
        }
      } as ChangeEvent<HTMLInputElement>);

      jest.advanceTimersByTime(1500);
    });

    wrapper.update();
    expect(wrapper.find('[data-test-id="task-item-1_1"]').exists()).toBeTruthy();

    GoogleTasksService.updateTaskCompletion = updateTaskCompletionFn;
  });

});

describe("Deletion", () => {

  it('should delete the task', async () => {
    jest.useFakeTimers();
    GoogleTasksService.reset();
    let wrapper: any = undefined;

    // @ts-ignore
    await act(async () => {
      wrapper = await mount(
        <SnackbarProvider>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Home
              switchSetting={() => null}
              settings={{
                taskView: 'DueDateView',
                comfortView: false,
                darkMode: false
              }}
              signOut={() => null}
              switchDarkMode={() => null}
            />
          </MuiPickersUtilsProvider>
        </SnackbarProvider>
      );
    });

    wrapper.update();

    // Now let's mark the task as completed
    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      // First select the item
      await wrapper.find('[data-test-id="task-item-1_1"]').first().simulate('click');
      jest.advanceTimersByTime(1000);
      wrapper.update();
      await wrapper.find('[data-test-id="task-delete-button"]').first().simulate('click');

      jest.advanceTimersByTime(1000);
    });

    wrapper.update();
    expect(wrapper.find('[data-test-id="task-item-1_1"]').exists()).toBeFalsy();
  });

  it('should revert delete task if error', async () => {
    const deleteTaskFn = GoogleTasksService.deleteTask;
    GoogleTasksService.deleteTask = () => Promise.reject("Error");
    jest.useFakeTimers();
    GoogleTasksService.reset();
    let wrapper: any = undefined;

    // @ts-ignore
    await act(async () => {
      wrapper = await mount(
        <SnackbarProvider>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Home
              switchSetting={() => null}
              settings={{
                taskView: 'DueDateView',
                comfortView: false,
                darkMode: false
              }}
              signOut={() => null}
              switchDarkMode={() => null}
            />
          </MuiPickersUtilsProvider>
        </SnackbarProvider>
      );
    });

    wrapper.update();

    // Now let's mark the task as completed
    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      // First select the item
      await wrapper.find('[data-test-id="task-item-1_1"]').first().simulate('click');
      jest.advanceTimersByTime(1000);
      wrapper.update();
      await wrapper.find('[data-test-id="task-delete-button"]').first().simulate('click');
    });

    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      jest.advanceTimersByTime(1500);
      wrapper.update();
    });

    expect(wrapper.find('[data-test-id="task-item-1_1"]').exists()).toBeTruthy();

    GoogleTasksService.deleteTask = deleteTaskFn;
  });

});

describe("Updating", () => {

  it('should update the task', async () => {
    jest.useFakeTimers();
    GoogleTasksService.reset();
    let wrapper: any = undefined;

    // @ts-ignore
    await act(async () => {
      wrapper = await mount(
          <SnackbarProvider>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Home
                switchSetting={() => null}
                settings={{
                  taskView: 'DueDateView',
                  comfortView: false,
                  darkMode: false
                }}
                signOut={() => null}
                switchDarkMode={() => null}
              />
            </MuiPickersUtilsProvider>
          </SnackbarProvider>
      );
    });

    wrapper.update();
    const expectedTitle = 'New Title Set Here';

    // Now let's mark the task as completed
    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      // First select the item
      await wrapper.find('[data-test-id="task-item-1_1"]').first().simulate('click');
      jest.advanceTimersByTime(1500);
      wrapper.update();

      // Now change the title
      const title = await wrapper.find('[data-test-id="task-edit-title"]').first();
      title.find('input').simulate('change', {
        target: {
          value: expectedTitle
        }
      });

      jest.advanceTimersByTime(1000);
    });

    wrapper.update();

    const listItemText = wrapper.find('[data-test-id="task-item-1_1"]').first().find(ListItemText);
    expect(listItemText.props().primary).toBe(expectedTitle);
  });

  it('should revert update if api fails', async () => {
    const updateTaskFn = GoogleTasksService.updateTask;
    GoogleTasksService.updateTask = () => Promise.reject("Error");
    jest.useFakeTimers();
    GoogleTasksService.reset();
    let wrapper: any = undefined;

    // @ts-ignore
    await act(async () => {
      wrapper = await mount(
          <SnackbarProvider>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Home
                switchSetting={() => null}
                settings={{
                  taskView: 'DueDateView',
                  comfortView: false,
                  darkMode: false
                }}
                signOut={() => null}
                switchDarkMode={() => null}
              />
            </MuiPickersUtilsProvider>
          </SnackbarProvider>
      );
    });

    wrapper.update();
    const expectedTitle = 'Task 1';

    // Now let's mark the task as completed
    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      // First select the item
      await wrapper.find('[data-test-id="task-item-1_1"]').first().simulate('click');
      jest.advanceTimersByTime(1000);
      wrapper.update();

      // Now change the title
      const title = wrapper.find('[data-test-id="task-edit-title"]').first();
      await title.find('input').simulate('change', {
        target: {
          value: 'New Title Set Here'
        }
      });
      jest.advanceTimersByTime(1000);
      wrapper.update();
    });

    wrapper.update();

    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      jest.advanceTimersByTime(1500);
      wrapper.update();
    });

    wrapper.update();
    const listItemText = wrapper.find('[data-test-id="task-item-1_1"]').first().find(ListItemText);
    expect(listItemText.props().primary).toBe(expectedTitle);

    GoogleTasksService.updateTask = updateTaskFn;
  });

});

describe("Insertion", () => {
  it('should insert the task', async () => {
    jest.useFakeTimers();
    GoogleTasksService.reset();
    let wrapper: any = undefined;

    // @ts-ignore
    await act(async () => {
      wrapper = await mount(
          <SnackbarProvider>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Home
                  switchSetting={() => null}
                  settings={{
                    taskView: 'DueDateView',
                    comfortView: false,
                    darkMode: false
                  }}
                  signOut={() => null}
                  switchDarkMode={() => null}
              />
            </MuiPickersUtilsProvider>
          </SnackbarProvider>
      );
    });

    wrapper.update();
    expect(wrapper.find(Tasks).props().taskLists).toHaveLength(2);
    expect(wrapper.find(Tasks).props().tasks).toHaveLength(8);

    // Now let's insert a task
    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      // First select the task list
      await wrapper.find('[data-test-id="menu-tasklist-id=1"]').first().simulate('click');
      jest.advanceTimersByTime(1500);
      wrapper.update();

      expect(wrapper.find(Tasks).props().taskLists).toHaveLength(2);
      expect(wrapper.find(Tasks).props().tasks).toHaveLength(4);

      // Then add the item
      await wrapper.find('[data-test-id="tasks-add-button"]').first().simulate('click');

      jest.advanceTimersByTime(1000);
    });

    wrapper.update();

    expect(wrapper.find(Tasks).props().taskLists).toHaveLength(2);
    expect(wrapper.find(Tasks).props().tasks).toHaveLength(5);
  });

  it('should revert the insertion of the task when the API fails', async () => {
    const insertTaskFn = GoogleTasksService.insertTask;
    GoogleTasksService.insertTask = () => Promise.reject("Error");
    jest.useFakeTimers();
    GoogleTasksService.reset();
    let wrapper: any = undefined;

    // @ts-ignore
    await act(async () => {
      wrapper = await mount(
          <SnackbarProvider>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Home
                  switchSetting={() => null}
                  settings={{
                    taskView: 'DueDateView',
                    comfortView: false,
                    darkMode: false
                  }}
                  signOut={() => null}
                  switchDarkMode={() => null}
              />
            </MuiPickersUtilsProvider>
          </SnackbarProvider>
      );
    });

    wrapper.update();
    expect(wrapper.find(Tasks).props().taskLists).toHaveLength(2);
    expect(wrapper.find(Tasks).props().tasks).toHaveLength(8);

    // Now let's insert a task
    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      // First select the task list
      await wrapper.find('[data-test-id="menu-tasklist-id=1"]').first().simulate('click');
      jest.advanceTimersByTime(1500);
      wrapper.update();

      expect(wrapper.find(Tasks).props().taskLists).toHaveLength(2);
      expect(wrapper.find(Tasks).props().tasks).toHaveLength(4);

      // Then add the item
      await wrapper.find('[data-test-id="tasks-add-button"]').first().simulate('click');

      jest.advanceTimersByTime(1000);
    });

    wrapper.update();

    expect(wrapper.find(Tasks).props().taskLists).toHaveLength(2);
    expect(wrapper.find(Tasks).props().tasks).toHaveLength(4);

    GoogleTasksService.insertTask = insertTaskFn;
  });

});