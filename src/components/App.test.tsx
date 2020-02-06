import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Button } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import GoogleTasksService from '../services/GoogleTasks';
import Welcome from './Welcome';
import App from './App';
import Home from './Home';

jest.mock('../services/GoogleTasks');

async function getDefaultWrapper() {
  const wrapper = mount(
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </MuiPickersUtilsProvider>,
  );

  await act(async () => {
    await wrapper;
  });

  return wrapper;
}

describe('Basic', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).toBeTruthy();
  });
});

describe('Events', () => {
  it('should render the home if logged in otherwise welcome', async () => {
    GoogleTasksService.reset();
    const wrapper = await getDefaultWrapper();

    expect(wrapper).toBeDefined();
    wrapper.update();

    // In our first attempt we are not logged in, so we should see the welcome screen
    expect(wrapper.find(Welcome).exists()).toBeTruthy();
    expect(wrapper.find(Home).exists()).toBeFalsy();

    // Now we log in
    await act(async () => {
      await wrapper
        .find(Button)
        .first()
        .simulate('click');
    });

    wrapper.update();
    expect(wrapper.find(Welcome).exists()).toBeFalsy();
    expect(wrapper.find(Home).exists()).toBeTruthy();

    // Now log out
    await act(async () => {
      await wrapper
        .find('[data-test-id="menu-sign-out"]')
        .first()
        .simulate('click');
    });

    wrapper.update();
    expect(wrapper.find(Welcome).exists()).toBeTruthy();
    expect(wrapper.find(Home).exists()).toBeFalsy();
  });

  it('should switch to dark mode', async () => {
    GoogleTasksService.reset();
    const wrapper = await getDefaultWrapper();

    expect(wrapper).toBeDefined();
    wrapper.update();
    await act(async () => {
      await wrapper
        .find(Button)
        .first()
        .simulate('click');
    });

    wrapper.update();

    // Now we switch to dark mode
    await act(async () => {
      const toggleDarkMode = await wrapper
        .find('[data-test-id="menu-dark-mode"]')
        .first()
        .props();

      if (toggleDarkMode.onChange) toggleDarkMode.onChange();
    });

    wrapper.update();
    expect(localStorage.getItem('settings.darkMode')).toBeTruthy();
  });
});
