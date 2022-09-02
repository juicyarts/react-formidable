import { ReactWrapper, mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';

import Formidable, { Checkbox, FormidableEvent } from '../../src';
import { FormidableEventHandler } from '../../src/formidable/types';

type InitialFormValues = {
  foo: boolean;
  fooStringArray: string[];
  fooObjectArray: Record<string, any>[];
};

const mockStringArrayOptions = ['value1', 'value2', 'value3'];

const initialValues: InitialFormValues = {
  foo: false,
  fooStringArray: ['value1', 'value2'],
  fooObjectArray: [
    {
      name: 'name1',
      enabled: true,
    },
    {
      name: 'name2',
      enabled: false,
    },
  ],
};

describe('Checkbox', () => {
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
        handleEvent={handleEventSpy as unknown as FormidableEventHandler<InitialFormValues>}
      >
        <Checkbox<InitialFormValues> name="foo" />
        <ul>
          {mockStringArrayOptions.map((e) => (
            <li key={e}>
              <Checkbox<InitialFormValues> name="fooStringArray" value={e} id={e} />
            </li>
          ))}
        </ul>
        <ul>
          {initialValues.fooObjectArray.map((e) => (
            <li key={e.name}>
              <Checkbox<InitialFormValues>
                name="fooObjectArray"
                value={e.name}
                id={e.name}
                nameProp="name"
                booleanPropName="enabled"
              />
            </li>
          ))}
        </ul>
      </Formidable>,
    );
  });

  it('should render without crashing', () => {
    expect(wrapper).toBeTruthy();
  });

  it('should throw an error if data is object array but identifier props are missing', () => {
    let errorCount = 0;

    try {
      wrapper.setProps({
        children: (
          <ul>
            {initialValues.fooObjectArray.map((e) => (
              <li key={e.name}>
                <Checkbox<InitialFormValues> name="fooObjectArray" value={e.name} id={e.name} />
              </li>
            ))}
          </ul>
        ),
      });
    } catch (err) {
      errorCount += 1;
      expect(err.message).toBe(
        'fieldValue is object[] but "booleanPropName", "nameProp" or both have not been set',
      );
    }

    expect(errorCount).toBe(1);
  });

  describe('handles changes', () => {
    it('handles changes for single boolean value', async () => {
      expect(wrapper.find('input[name="foo"]').props().checked).toBe(false);

      await act(async () => {
        wrapper.find('input[name="foo"]').simulate('change', {
          target: {
            name: 'foo',
            value: true,
          },
        });
      });

      wrapper.update();

      expect(wrapper.find('input[name="foo"]').props().checked).toBe(true);

      expect(handleEventSpy).toHaveBeenCalledWith(
        {
          ...initialValues,
          foo: true,
        },
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

    it('handles changes for a string array value', async () => {
      const checkboxInitial1 = wrapper.find('input[name="fooStringArray"]').at(0);
      const checkboxInitial2 = wrapper.find('input[name="fooStringArray"]').at(1);
      const checkboxInitial3 = wrapper.find('input[name="fooStringArray"]').at(2);

      expect(checkboxInitial1.props().checked).toBe(true);
      expect(checkboxInitial2.props().checked).toBe(true);
      expect(checkboxInitial3.props().checked).toBe(false);

      await act(async () => {
        checkboxInitial3.simulate('change', {
          target: {
            name: 'foo',
            value: true,
          },
        });
      });

      wrapper.update();

      const checkboxAfterChange1 = wrapper.find('input[name="fooStringArray"]').at(0);
      const checkboxAfterChange2 = wrapper.find('input[name="fooStringArray"]').at(1);
      const checkboxAfterChange3 = wrapper.find('input[name="fooStringArray"]').at(2);

      expect(checkboxAfterChange1.props().checked).toBe(true);
      expect(checkboxAfterChange2.props().checked).toBe(true);
      expect(checkboxAfterChange3.props().checked).toBe(true);

      expect(handleEventSpy).toHaveBeenCalledWith(
        {
          ...initialValues,
          fooStringArray: [...initialValues.fooStringArray, 'value3'],
        },
        {
          errors: {},
          touched: {
            fooStringArray: true,
          },
          dirty: {
            fooStringArray: true,
          },
          submitted: false,
          lastChangedFieldKey: 'fooStringArray',
        },
        FormidableEvent.Change,
      );
    });

    it('handles changes for an object array value', async () => {
      const checkboxInitial1 = wrapper.find('input[name="fooObjectArray"]').at(0);
      const checkboxInitial2 = wrapper.find('input[name="fooObjectArray"]').at(1);

      expect(checkboxInitial1.props().checked).toBe(true);
      expect(checkboxInitial2.props().checked).toBe(false);

      await act(async () => {
        checkboxInitial2.simulate('change', {
          target: {
            name: 'fooObjectArray',
            value: true,
          },
        });
      });

      wrapper.update();

      const checkboxAfterChange1 = wrapper.find('input[name="fooObjectArray"]').at(0);
      const checkboxAfterChange2 = wrapper.find('input[name="fooObjectArray"]').at(1);

      expect(checkboxAfterChange1.props().checked).toBe(true);
      expect(checkboxAfterChange2.props().checked).toBe(true);

      expect(handleEventSpy).toHaveBeenCalledWith(
        {
          ...initialValues,
          fooObjectArray: [
            initialValues.fooObjectArray[0],
            { ...initialValues.fooObjectArray[1], enabled: true },
          ],
        },
        {
          errors: {},
          touched: {
            fooObjectArray: true,
          },
          dirty: {
            fooObjectArray: true,
          },
          submitted: false,
          lastChangedFieldKey: 'fooObjectArray',
        },
        FormidableEvent.Change,
      );
    });
  });
});
