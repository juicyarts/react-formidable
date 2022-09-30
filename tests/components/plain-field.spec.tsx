import { ShallowWrapper, shallow } from 'enzyme';
import React from 'react';

import { PlainField } from '../../src';
import { PlainFieldProps } from '../../src/formidable/types';

describe('PlainField', () => {
  let element: ShallowWrapper;
  const fixtureData: PlainFieldProps = {
    name: 'PlainField',
  };

  describe('shallow', () => {
    beforeAll(() => {
      element = shallow(<PlainField {...fixtureData} />);
    });

    it('should render without crashing', () => {
      expect(element).toBeTruthy();
    });
  });
});
