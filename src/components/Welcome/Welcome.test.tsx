import React from 'react';
import { mount, ReactWrapper } from 'enzyme'
import { act } from 'react-dom/test-utils'
import Welcome from './Welcome';
import { Button } from '@material-ui/core'

describe('Basic', () => {

  it('should render without crashing', () => {
    act(() => {
      const welcome = mount(<Welcome signIn={() => null}/>);
      expect(welcome.exists()).toBe(true);
    })
  });

});

describe("Events", () => {
  it('handles the login button', () => {
    const handler = jest.fn();

    let welcome: ReactWrapper | undefined;

    act(() => {
      welcome = mount(<Welcome signIn={handler}/>);
      expect(welcome.exists()).toBe(true);
    })


    const button = welcome && welcome.find(Button).first();
    button && button.simulate('click');

    expect(handler).toBeCalled();
  });
});