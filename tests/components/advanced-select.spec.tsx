import { ShallowWrapper, shallow } from 'enzyme';
import React from 'react';
import Formidable, { AdvancedSelect, AdvancedSelectProps } from '../../src';

type AdvancedSelectMock = {
  foo: string;
};

describe('AdvancedSelect', () => {
  let element: ShallowWrapper;
  const fixtureData: AdvancedSelectProps<AdvancedSelectMock> = {
    name: 'foo',
    options: [
      {
        displayValue: 'foo',
        value: 'baz',
      },
    ],
  };

  describe('shallow', () => {
    beforeAll(() => {
      element = shallow(
        <Formidable>
          <AdvancedSelect {...fixtureData} />
        </Formidable>,
      );
    });

    it('should render without crashing', () => {
      expect(element).toBeTruthy();
    });
  });
});
