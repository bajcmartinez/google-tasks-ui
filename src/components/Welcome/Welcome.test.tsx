import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme'
import { act } from 'react-dom/test-utils'
import Welcome from './Welcome';
import { Button } from '@material-ui/core'

describe('Basic', () => {

  it('should render without crashing', () => {
    act(() => {
      const welcome = shallow(<Welcome signIn={() => null}/>);
      expect(welcome.exists()).toBeTruthy();
    })
  });

});

describe("Events", () => {
  it('handles the login button', () => {
    const handler = jest.fn();

    let welcome: ShallowWrapper | undefined;

    act(() => {
      welcome = shallow(<Welcome signIn={handler}/>);
      expect(welcome.exists()).toBeTruthy();
    });

    const button = welcome && welcome.find(Button).first();
    console.log(button)
    button && button.simulate('click');

    expect(handler).toBeCalled();
  });
});