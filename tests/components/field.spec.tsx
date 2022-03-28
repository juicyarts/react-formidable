/* eslint-disable react/jsx-props-no-spreading -- this is a test we can live with it */
import { ReactWrapper, mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';

import Formidable, { Field, FormidableEvent } from '../../src';

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
      {
        errors: {},
        touched: {
          foo: true,
        },
        dirty: {
          foo: true,
        },
        submitted: false,
        lastChangedFieldKey: 'foo',
      },
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
      {
        errors: {},
        touched: {},
        dirty: {},
        submitted: false,
        lastChangedFieldKey: '',
      },
      FormidableEvent.Blur,
    );
  });
});
/* eslint-enable react/jsx-props-no-spreading */
