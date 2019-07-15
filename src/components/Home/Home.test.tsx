import React from 'react';
import { shallow } from 'enzyme';
import Home from './Home';
import { SnackbarProvider } from 'notistack';

it('renders without crashing', () => {
  const titleBar = shallow(
    <SnackbarProvider>
      <Home />
    </SnackbarProvider>
    );
  expect(titleBar.exists()).toBe(true);
});
