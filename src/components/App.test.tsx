import React from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme'
import App from './App';
import Welcome from './Welcome'
import { act } from 'react-dom/test-utils'
import { Button } from '@material-ui/core'
import { SnackbarProvider } from 'notistack'
import GoogleTasksService from '../services/GoogleTasks'

jest.mock('../services/GoogleTasks');

describe('Basic', () => {

  it('should render without crashing', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).toBe(true);
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
        <SnackbarProvider>
          <App/>
        </SnackbarProvider>);
    });

    expect(wrapper).toBeDefined();
    wrapper.update();
    expect(wrapper.find(Welcome).exists()).toBe(true);

    // @ts-ignore
    // FIXME: ammend this when react fixes it, this is caused by using react 16.9-alpha.0
    await act(async () => {
      await wrapper.find(Button).first().simulate('click');
    });

    wrapper.update();
    expect(wrapper.find(Welcome).exists()).toBe(false);
  });
});