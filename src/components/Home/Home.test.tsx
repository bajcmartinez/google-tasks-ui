import React from 'react';
import { mount } from 'enzyme';
import Home from './Home';
import { SnackbarProvider } from 'notistack';
import { act } from 'react-dom/test-utils';

jest.mock('../../services/GoogleTasks');

describe("Basic", () => {
  it('should render without crashing', async () => {
    // await act(async () => {
    //   const home = mount(
    //     <SnackbarProvider>
    //       <Home
    //         signOut={() => null}
    //         switchDarkMode={() => null}
    //       />
    //     </SnackbarProvider>
    //   );
    //
    //   expect(home.exists()).toBe(true);
    // });
  });

});
