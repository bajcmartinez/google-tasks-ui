import React from 'react';
import { shallow } from 'enzyme';
import TaskList from './TaskList';

it('should render without crashing', () => {
  const titleBar = shallow(
    <TaskList
        tasks={[]}
        nested={false}
        handleSelectedTaskChanged={() => null}
        updateTaskCompletion={() => null}
    />
  );
  expect(titleBar.exists()).toBeTruthy();
});
