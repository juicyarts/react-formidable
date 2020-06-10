import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import Formidable, { Field } from '../src';
import { FormidableEvent } from '../src/formidable/types';

type InitialFormValues = {
  foo: string;
};

const initialValues = {
  foo: 'initial',
};

describe('Field', () => {
  let wrapper: ReactWrapper;
  let handleEventSpy: jest.SpyInstance;

  afterEach(() => {
    handleEventSpy.mockReset();
  });

  beforeEach(() => {
    handleEventSpy = jest.fn();

    wrapper = mount(
      <Formidable<InitialFormValues>
        initialValues={initialValues}
        handleEvent={handleEventSpy as any}
      >
        <Field<InitialFormValues> name="foo" />
      </Formidable>,
    );
  });

  it('should render without crashing', () => {
    expect(wrapper).toBeTruthy();
  });

  it('should handle change', async () => {
    await act(async () => {
      wrapper.find('Field input').simulate('change', {
        target: {
          name: 'foo',
          value: 'baz',
        },
      });
    });

    wrapper.update();

    const { value } = wrapper.find('Field input').props();
    expect(value).toBe('baz');

    expect(handleEventSpy).toHaveBeenCalledWith(
      { foo: 'baz' },
      { errors: {} },
      FormidableEvent.Change,
    );
  });

  it('should handle blur', async () => {
    await act(async () => {
      wrapper.find('Field input').simulate('blur', {
        target: {
          name: 'foo',
        },
      });
    });

    wrapper.update();

    expect(handleEventSpy).toHaveBeenCalledWith(
      {
        foo: 'initial',
      },
      { errors: {} },
      FormidableEvent.Blur,
    );
  });
});
