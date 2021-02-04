import { ReactWrapper, mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';

import Formidable, { AdvancedSelect, AdvancedSelectProps, FormidableEvent } from '../../src';

type InitialFormValues = {
  foo: string;
};

const initialValues = {
  foo: 'baz',
};

type AdvancedSelectMock = {
  foo: string;
};

describe('AdvancedSelect', () => {
  let wrapper: ReactWrapper;
  let handleEventSpy: jest.SpyInstance;

  const fixtureData: AdvancedSelectProps<AdvancedSelectMock> = {
    name: 'foo',
    options: [
      {
        displayValue: 'Baz',
        value: 'baz',
      },
      {
        displayValue: 'Bar',
        value: 'bar',
      },
    ],
  };

  afterAll(() => {
    handleEventSpy.mockReset();
  });

  beforeAll(() => {
    handleEventSpy = jest.fn();

    wrapper = mount(
      <Formidable<InitialFormValues>
        initialValues={initialValues}
        handleEvent={handleEventSpy as any}
      >
        <AdvancedSelect<InitialFormValues> {...fixtureData} />
      </Formidable>,
    );
  });

  it('should map value to option and show proper displayValue', () => {
    expect(wrapper).toBeTruthy();
    expect(wrapper.find('AdvancedSelect select')).toBeTruthy();

    const { value } = wrapper.find('AdvancedSelect select').props();
    expect(value).toBe(fixtureData.options[0].displayValue);
  });

  it('should handle change', async () => {
    await act(async () => {
      wrapper.find('AdvancedSelect select').simulate('change', {
        target: {
          value: fixtureData.options[1].displayValue,
        },
      });
    });

    wrapper.update();

    const { value } = wrapper.find('AdvancedSelect select').props();
    expect(value).toBe(fixtureData.options[1].displayValue);

    expect(handleEventSpy).toHaveBeenCalledWith(
      { foo: fixtureData.options[1].value },
      {
        errors: {},
        touched: {
          foo: true,
        },
        dirty: {
          foo: true,
        },
        submitted: false,
      },
      FormidableEvent.Change,
    );
  });
});
