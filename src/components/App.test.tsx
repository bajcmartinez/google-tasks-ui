import React from 'react';
import { mount, shallow } from 'enzyme'
import App from './App';
import Welcome from './Welcome'
import { act } from 'react-dom/test-utils'
import { Button } from '@material-ui/core'
import { SnackbarProvider } from 'notistack'
import GoogleTasksService from '../services/GoogleTasks'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import Home from './Home'

jest.mock('../services/GoogleTasks');

describe('Basic', () => {

  it('should render without crashing', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).toBeTruthy();
  });

});

describe('Events', () => {

  it('should render the home if logged in otherwise welcome', async () => {
    GoogleTasksService.reset();
    let wrapper: any = undefined;

    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      wrapper = await mount(
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <SnackbarProvider>
            <App/>
          </SnackbarProvider>
        </MuiPickersUtilsProvider>);
    });

    expect(wrapper).toBeDefined();
    wrapper.update();

    // In our first attempt we are not logged in, so we should see the welcome screen
    expect(wrapper.find(Welcome).exists()).toBeTruthy();
    expect(wrapper.find(Home).exists()).toBeFalsy();

    // Now we log in

    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      await wrapper.find(Button).first().simulate('click');
    });

    wrapper.update();
    expect(wrapper.find(Welcome).exists()).toBeFalsy();
    expect(wrapper.find(Home).exists()).toBeTruthy();

    // Now log out

    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      await wrapper.find('[data-test-id="menu-sign-out"]').first().simulate('click');
    });

    wrapper.update();
    expect(wrapper.find(Welcome).exists()).toBeTruthy();
    expect(wrapper.find(Home).exists()).toBeFalsy();
  });

  it("should switch to dark mode", async () => {
    GoogleTasksService.reset();
    let wrapper: any = undefined;

    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      wrapper = await mount(
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <SnackbarProvider>
            <App/>
          </SnackbarProvider>
        </MuiPickersUtilsProvider>);
    });

    expect(wrapper).toBeDefined();
    wrapper.update();
    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      await wrapper.find(Button).first().simulate('click');
    });

    wrapper.update();

    // Now we switch to dark mode

    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      const toggleDarkMode = await wrapper.find('[data-test-id="menu-dark-mode"]').first().props();
      toggleDarkMode.onChange && toggleDarkMode.onChange()
    });

    wrapper.update();
    expect(localStorage.getItem("settings.darkMode")).toBeTruthy();
  })
});