import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import Formidable, { FormidableComponentProps, FormidableEvent } from '../src';

type InitialFormValues = {
  foo: string;
};

describe('Formidable', () => {
  const fixtureData: FormidableComponentProps<InitialFormValues> = { children: {} };
  let wrapper: ReactWrapper;
  let handleEventSpy: jest.SpyInstance;

  fixtureData.initialValues = {
    foo: 'initial',
  };

  describe('renderer approach', () => {
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
              handleChange,
              handleSubmit,
              handleReset,
            }) => (
              <form onSubmit={handleSubmit} onReset={handleReset}>
                <input
                  onBlur={handleBlur}
                  onChange={handleChange}
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
        FormidableEvent.Change,
        { errors: {} },
        { foo: 'baz' },
      );
    });

    it('should handle submit', async () => {
      await act(async () => {
        wrapper.find('button').simulate('submit');
      });

      wrapper.update();

      expect(handleEventSpy).toHaveBeenCalledWith(
        FormidableEvent.Submit,
        { errors: {} },
        {
          foo: 'initial',
        },
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
        FormidableEvent.Blur,
        { errors: {} },
        {
          foo: 'initial',
        },
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

      expect(handleEventSpy.mock.calls[1][0]).toBe(FormidableEvent.Reset);
      expect(handleEventSpy.mock.calls[1][1]).toEqual({ errors: {} });
      expect(handleEventSpy.mock.calls[1][2]).toEqual({ foo: 'initial' });
    });
  });
});
