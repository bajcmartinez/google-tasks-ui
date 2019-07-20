import React from 'react';
import { mount, shallow } from 'enzyme'
import Home from './Home';
import { SnackbarProvider } from 'notistack';
import { act } from 'react-dom/test-utils';
import Tasks from './Tasks'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import GoogleTasksService from '../../services/GoogleTasks'

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
              signOut={() => null}
              switchDarkMode={() => null}
            />
          </MuiPickersUtilsProvider>
        </SnackbarProvider>
      );
    });

    wrapper.update();
    expect(wrapper.find(Home).exists()).toBe(true);

    expect(wrapper.find(Tasks).props().taskLists).toHaveLength(2);
    expect(wrapper.find(Tasks).props().tasks).toHaveLength(8);
  });
});

describe("Events", () => {


});
