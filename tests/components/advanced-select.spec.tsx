/* eslint-disable react/jsx-props-no-spreading -- this is a test we can live with it */
import { ReactWrapper, mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';

import Formidable, { AdvancedSelect, AdvancedSelectProps, FormidableEvent } from '../../src';

type AdvancedSelectMock = {
  foo: string;
};

type AdvancedArrayValueSelectMock = {
  foo: string[];
};

describe('AdvancedSelect', () => {
  let wrapper: ReactWrapper;
  let handleEventSpy: jest.SpyInstance;

  describe('simple values', () => {
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

      const initialValues = {
        foo: 'baz',
      };

      wrapper = mount(
        <Formidable<AdvancedSelectMock>
          initialValues={initialValues}
          handleEvent={handleEventSpy as any}
        >
          <AdvancedSelect<AdvancedSelectMock> {...fixtureData} />
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
          lastChangedFieldKey: 'foo',
        },
        FormidableEvent.Change,
      );
    });
  });

  describe('array values', () => {
    const fixtureData: AdvancedSelectProps<AdvancedArrayValueSelectMock> = {
      name: 'foo',
      options: [
        {
          displayValue: 'Baz',
          value: ['baz'],
        },
        {
          displayValue: 'Bar',
          value: ['bar'],
        },
      ],
    };

    afterAll(() => {
      handleEventSpy.mockReset();
    });

    beforeAll(() => {
      handleEventSpy = jest.fn();

      const initialValues = {
        foo: ['baz'],
      };

      wrapper = mount(
        <Formidable<AdvancedArrayValueSelectMock>
          initialValues={initialValues}
          handleEvent={handleEventSpy as any}
        >
          <AdvancedSelect<AdvancedArrayValueSelectMock> {...fixtureData} />
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
          lastChangedFieldKey: 'foo',
        },
        FormidableEvent.Change,
      );
    });
  });

  describe('it should apply changes when initial value changes', () => {
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

      const initialValues = {
        foo: 'baz',
      };

      wrapper = mount(
        <Formidable<AdvancedSelectMock>
          initialValues={initialValues}
          handleEvent={handleEventSpy as any}
        >
          <AdvancedSelect<AdvancedSelectMock> {...fixtureData} />
        </Formidable>,
      );
    });

    it('should map value to option and show proper displayValue', () => {
      expect(wrapper).toBeTruthy();
      expect(wrapper.find('AdvancedSelect select')).toBeTruthy();

      const { value } = wrapper.find('AdvancedSelect select').props();
      expect(value).toBe(fixtureData.options[0].displayValue);
    });

    it('should handle initialValues update', async () => {
      await act(async () => {
        wrapper.setProps({
          initialValues: {
            foo: 'bar',
          },
        });
      });

      wrapper.update();

      const { value } = wrapper.find('AdvancedSelect select').props();
      expect(value).toBe(fixtureData.options[1].displayValue);
    });
  });
});

/* eslint-enable react/jsx-props-no-spreading */
