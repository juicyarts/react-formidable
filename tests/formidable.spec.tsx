import { ReactWrapper, mount } from 'enzyme';
import React, { FunctionComponentElement } from 'react';
import { act } from 'react-dom/test-utils';
import { object as yupObject, string as yupString } from 'yup';

import Formidable, { FormidableComponentProps, FormidableEvent } from '../src';

type InitialFormValues = {
  foo: string;
  bar: string;
};

interface FormidableWithTestWrapperProps {
  input: FormidableComponentProps<InitialFormValues>;
}

function FormidableWithTestWrapper({
  input,
}: FormidableWithTestWrapperProps): FunctionComponentElement<FormidableWithTestWrapperProps> {
  return (
    <Formidable<InitialFormValues> {...input}>
      {({
        handleBlur,
        handleFocus,
        handleChange,
        handleSubmit,
        handleReset,
        getField,
        getFieldError,
        getFormInvalid,
        getFormTouched,
        getFormDirty,
      }) => (
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <input
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            value={getField('foo')}
            type="text"
            name="foo"
          />
          {getFieldError('foo') && (
            <span className="field_error">{getFieldError('foo').message}</span>
          )}
          {getFormInvalid() && <span className="form_invalid">form invalid</span>}
          {getFormTouched() && <span className="form_touched">form touched</span>}
          {getFormDirty() && <span className="form_dirty">form dirty</span>}
          <input type="reset" />
          <button type="submit">FoO</button>
        </form>
      )}
    </Formidable>
  );
}

describe('Formidable', () => {
  describe('without validation', () => {
    const fixtureData: FormidableComponentProps<InitialFormValues> = {
      children: {},
      initialValues: {
        foo: 'initial',
        bar: 'initial',
      },
    };

    let wrapper: ReactWrapper;

    afterEach(() => {
      fixtureData.handleEvent = undefined;
    });

    beforeEach(async () => {
      fixtureData.handleEvent = jest.fn();

      await act(async () => {
        wrapper = mount(<FormidableWithTestWrapper input={fixtureData} />);
      });

      wrapper.update();
    });

    it('should adopt initial values', () => {
      const inputProps = wrapper.find('input[name="foo"]').props();
      expect(inputProps).toMatchObject({
        value: 'initial',
      });
    });

    it('should be fresh and clean', () => {
      expect(wrapper.find('.form_invalid').exists()).toBeFalsy();
      expect(wrapper.find('.form_touched').exists()).toBeFalsy();
      expect(wrapper.find('.form_dirty').exists()).toBeFalsy();
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

      expect(fixtureData.handleEvent).toHaveBeenCalledWith(
        { foo: 'baz', bar: 'initial' },
        {
          errors: {},
          touched: { foo: true },
          dirty: { foo: true },
          submitted: false,
          lastChangedFieldKey: 'foo',
        },
        FormidableEvent.Change,
      );

      expect(wrapper.find('.form_touched').exists()).toBeTruthy();
      expect(wrapper.find('.form_dirty').exists()).toBeTruthy();
    });

    it('should handle submit', async () => {
      await act(async () => {
        wrapper.find('button').simulate('submit');
      });

      wrapper.update();

      expect(fixtureData.handleEvent).toHaveBeenCalledWith(
        {
          foo: 'initial',
          bar: 'initial',
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

      expect(fixtureData.handleEvent).toHaveBeenCalledWith(
        {
          foo: 'initial',
          bar: 'initial',
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

      expect(fixtureData.handleEvent).toHaveBeenCalledWith(
        {
          foo: 'initial',
          bar: 'initial',
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

      expect((fixtureData.handleEvent as any).mock.calls[1]).toEqual([
        {
          foo: 'initial',
          bar: 'initial',
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

  describe('when only submit event is chosen', () => {
    const fixtureData: FormidableComponentProps<InitialFormValues> = {
      children: {},
      initialValues: {
        foo: 'initial',
        bar: 'initial',
      },
      events: [FormidableEvent.Submit],
    };

    let wrapper: ReactWrapper;

    afterEach(() => {
      fixtureData.handleEvent = undefined;
    });

    beforeEach(async () => {
      fixtureData.handleEvent = jest.fn();

      await act(async () => {
        wrapper = mount(<FormidableWithTestWrapper input={fixtureData} />);
      });

      wrapper.update();
    });

    it('should not call handleEvent on change', async () => {
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
      expect(fixtureData.handleEvent).not.toHaveBeenCalled();
    });

    it('should not call handleEvent on blur', async () => {
      await act(async () => {
        wrapper.find('input[name="foo"]').simulate('blur', {
          target: {
            name: 'foo',
          },
        });
      });

      wrapper.update();
      expect(fixtureData.handleEvent).not.toHaveBeenCalled();
    });

    it('should call handleEvent on submit', async () => {
      await act(async () => {
        wrapper.find('button').simulate('submit');
      });

      wrapper.update();

      expect(fixtureData.handleEvent).toHaveBeenCalledWith(
        {
          foo: 'initial',
          bar: 'initial',
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
  });

  describe('with validation', () => {
    const validationSchema = yupObject().shape({
      foo: yupString().required().max(10),
      bar: yupString().required().max(5),
    });

    describe('when validateOn is set to `Change`', () => {
      const fixtureData: FormidableComponentProps<InitialFormValues> = {
        children: {},
        initialValues: {
          foo: 'initial',
          bar: 'initial',
        },
        validationSchema,
        validateOn: [FormidableEvent.Change],
      };

      let wrapper: ReactWrapper;

      afterEach(() => {
        fixtureData.handleEvent = undefined;
      });

      beforeEach(async () => {
        fixtureData.handleEvent = jest.fn();

        await act(async () => {
          wrapper = mount(<FormidableWithTestWrapper input={fixtureData} />);
        });

        wrapper.update();
      });

      it('should not have validation errors initially', () => {
        expect(wrapper.find('.field_error').exists()).toBeFalsy();
        expect(wrapper.find('.form_invalid').exists()).toBeFalsy();
      });

      it('should have validation error after change', async () => {
        await act(async () => {
          wrapper.find('input[name="foo"]').simulate('change', {
            target: {
              name: 'foo',
              value: 'somethingLongerThan10Chars',
            },
          });
        });

        wrapper.update();
        expect(wrapper.find('.field_error').exists()).toBeTruthy();
        expect(wrapper.find('.form_invalid').exists()).toBeTruthy();

        const { value } = wrapper.find('input[name="foo"]').props();
        expect(value).toBe('somethingLongerThan10Chars');

        expect((fixtureData.handleEvent as any).mock.calls[0][0]).toEqual({
          foo: 'somethingLongerThan10Chars',
          bar: 'initial',
        });

        const { errors } = (fixtureData.handleEvent as any).mock.calls[0][1];
        expect(errors.foo).toBeTruthy();
      });

      it('should remove validation error after change to valid', async () => {
        await act(async () => {
          wrapper.find('input[name="foo"]').simulate('change', {
            target: {
              name: 'foo',
              value: 'shortThing',
            },
          });
        });

        wrapper.update();
        expect(wrapper.find('.field_error').exists()).toBeFalsy();
        expect(wrapper.find('.form_invalid').exists()).toBeFalsy();

        expect((fixtureData.handleEvent as any).mock.calls[0][0]).toEqual({
          foo: 'shortThing',
          bar: 'initial',
        });

        const { errors } = (fixtureData.handleEvent as any).mock.calls[0][1];
        expect(errors.foo).not.toBeTruthy();
      });
    });

    describe('when validateOn is set to `Init`', () => {
      const fixtureData: FormidableComponentProps<InitialFormValues> = {
        children: {},
        initialValues: {
          foo: 'somethingLongerThan10Chars',
          bar: 'ini',
        },
        validationSchema,
        validateOn: [FormidableEvent.Init],
      };

      let wrapper: ReactWrapper;

      afterEach(() => {
        fixtureData.handleEvent = undefined;
      });

      beforeEach(async () => {
        fixtureData.handleEvent = jest.fn();

        await act(async () => {
          wrapper = mount(<FormidableWithTestWrapper input={fixtureData} />);
        });

        wrapper.update();
      });

      it('should call handleEvent for `init`', () => {
        expect(fixtureData.handleEvent).toHaveBeenCalled();
      });

      it('should not have touched or dirty states', () => {
        const { dirty, touched } = (fixtureData.handleEvent as any).mock.calls[0][1];
        expect(Object.keys(dirty)).toHaveLength(0);
        expect(Object.keys(touched)).toHaveLength(0);
      });

      it('should have validation errors initially', () => {
        const { errors } = (fixtureData.handleEvent as any).mock.calls[0][1];
        expect(Object.keys(errors)).toHaveLength(1);
        expect(errors).toHaveProperty('foo');
        expect(wrapper.find('.field_error').exists()).toBeTruthy();
        expect(wrapper.find('.form_invalid').exists()).toBeTruthy();
      });
    });
  });
});
