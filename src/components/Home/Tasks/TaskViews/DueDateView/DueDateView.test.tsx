import React from 'react';
import { shallow } from 'enzyme';
import DueDateView from './DueDateView';

it('should render without crashing', () => {
  const titleBar = shallow(
    <DueDateView
      settings={{
        taskView: 'DueDateView',
        comfortView: false,
        darkMode: false
      }}
      tasks={[]}
      nested={false}
      handleSelectedTaskChanged={() => null}
      updateTaskCompletion={() => null}
    />
  );
  expect(titleBar.exists()).toBeTruthy();
});
