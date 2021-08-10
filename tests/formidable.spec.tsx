import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { object as yupObject, string as yupString } from 'yup';

import Formidable, { FormidableComponentProps, FormidableEvent } from '../src';

type InitialFormValues = {
  foo: string;
};

describe('Formidable', () => {
  describe('without validation', () => {
    const fixtureData: FormidableComponentProps<InitialFormValues> = {
      children: {},
      initialValues: {
        foo: 'initial',
      },
    };
    let wrapper: ReactWrapper;
    let handleEventSpy: jest.SpyInstance;

    afterEach(() => {
      handleEventSpy.mockReset();
    });

    beforeEach(async () => {
      handleEventSpy = jest.fn();

      await act(async () => {
        wrapper = mount(
          <Formidable<InitialFormValues> {...fixtureData} handleEvent={handleEventSpy as any}>
            {({
              formValues,
              handleBlur,
              handleFocus,
              handleChange,
              handleSubmit,
              handleReset,
            }) => (
              <form onSubmit={handleSubmit} onReset={handleReset}>
                <input
                  onBlur={handleBlur}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  value={formValues?.foo}
                  type="text"
                  name="foo"
                />
                <input type="reset" />
                <button type="submit">FoO</button>
              </form>
            )}
          </Formidable>,
        );
      });

      wrapper.update();
    });

    it('should render without crashing', () => {
      expect(wrapper).toBeTruthy();
    });

    it('should adopt initial values', () => {
      const inputProps = wrapper.find('input[name="foo"]').props();
      expect(inputProps).toMatchObject({
        value: 'initial',
      });
    });

    it('should handle change', async () => {
      await act(async () => {
        wrapper.find('input[name="foo"]').simulate('change', {
          target: {
            name: 'foo',
            value: 'baz',
          },
        });
      });

      wrapper.update();

      const { value } = wrapper.find('input[name="foo"]').props();
      expect(value).toBe('baz');

      expect(handleEventSpy).toHaveBeenCalledWith(
        { foo: 'baz' },
        {
          errors: {},
          touched: { foo: true },
          dirty: { foo: true },
          submitted: false,
          lastChangedFieldKey: 'foo',
        },
        FormidableEvent.Change,
      );
    });

    it('should handle submit', async () => {
      await act(async () => {
        wrapper.find('button').simulate('submit');
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
          submitted: true,
          lastChangedFieldKey: '',
        },
        FormidableEvent.Submit,
      );
    });

    it('should handle blur', async () => {
      await act(async () => {
        wrapper.find('input[name="foo"]').simulate('blur', {
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

    it('should handle focus', async () => {
      await act(async () => {
        wrapper.find('input[name="foo"]').simulate('focus', {
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
          touched: {
            foo: true,
          },
          dirty: {},
          submitted: false,
          lastChangedFieldKey: '',
        },
        FormidableEvent.Focus,
      );
    });

    it('should handle reset', async () => {
      await act(async () => {
        wrapper.find('input[name="foo"]').simulate('change', {
          target: {
            name: 'foo',
            value: 'baz',
          },
        });

        wrapper.find('input[type="reset"]').simulate('reset');
      });

      wrapper.update();

      expect(handleEventSpy.mock.calls[1]).toEqual([
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
        FormidableEvent.Reset,
      ]);
    });
  });

  describe('with validation', () => {
    const validationSchema = yupObject().shape({
      foo: yupString().required().max(10),
    });

    const fixtureData: FormidableComponentProps<InitialFormValues> = {
      children: {},
      initialValues: {
        foo: 'initial',
      },
      validationSchema,
    };
    let wrapper: ReactWrapper;
    let handleEventSpy: jest.SpyInstance;

    afterEach(() => {
      handleEventSpy.mockReset();
    });

    beforeEach(async () => {
      handleEventSpy = jest.fn();

      await act(async () => {
        wrapper = mount(
          <Formidable<InitialFormValues>
            {...fixtureData}
            handleEvent={handleEventSpy as any}
            validateOn={[FormidableEvent.All]}
          >
            {({
              formValues,
              handleBlur,
              handleFocus,
              handleChange,
              handleSubmit,
              handleReset,
            }) => (
              <form onSubmit={handleSubmit} onReset={handleReset}>
                <input
                  onBlur={handleBlur}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  value={formValues?.foo}
                  type="text"
                  name="foo"
                />
                <input type="reset" />
                <button type="submit">FoO</button>
              </form>
            )}
          </Formidable>,
        );
      });

      wrapper.update();
    });

    it('should render without crashing', () => {
      expect(wrapper).toBeTruthy();
    });

    it('should have validation error', async () => {
      await act(async () => {
        wrapper.find('input[name="foo"]').simulate('change', {
          target: {
            name: 'foo',
            value: 'bazbazbazbaz',
          },
        });
      });

      wrapper.update();

      const { value } = wrapper.find('input[name="foo"]').props();
      expect(value).toBe('bazbazbazbaz');

      expect(handleEventSpy.mock.calls[0][0]).toEqual({ foo: 'bazbazbazbaz' });

      const { errors } = handleEventSpy.mock.calls[0][1];
      expect(errors.foo).toBeTruthy();
    });
  });
});
