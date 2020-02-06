import React from 'react';
import { shallow } from 'enzyme';
import ListView from './ListView';

it('should render without crashing', () => {
  const titleBar = shallow(
    <ListView
      settings={{
        taskView: 'DueDateView',
        comfortView: false,
        darkMode: false,
      }}
      tasks={[]}
      nested={false}
      handleSelectedTaskChanged={() => null}
      updateTaskCompletion={() => null}
    />,
  );
  expect(titleBar.exists()).toBeTruthy();
});
