/* eslint-disable jsx-a11y/label-has-associated-control -- these are docs, it's fine */
import React, { FunctionComponentElement, useCallback } from 'react';

import Formidable, { FormidableEvent, FormidableState } from '../../src';

import { MockFormType, mockFormData, mockFormSchema } from './utils';

function NativeForm(): FunctionComponentElement<unknown> {
  const onEvent = useCallback(
    (
      values?: Partial<MockFormType>,
      formState?: Partial<FormidableState<MockFormType>>,
      event?: FormidableEvent,
    ): void => {
      console.debug('Onboard Form | Form changed:', event, formState, values);
    },
    [],
  );

  return (
    <div className="p-s">
      <h3 className="text--title">Using Plain form elements</h3>
      <p className="p-bottom-s text--regular">
        In this scenario we use plain html inputs
      </p>
      <Formidable<MockFormType>
        initialValues={mockFormData}
        events={[FormidableEvent.Change]}
        handleEvent={onEvent}
        validationSchema={mockFormSchema}
      >
        {({
          formValues,
          handleBlur,
          handleChange,
          handleSubmit,
          handleReset,
          getFieldError,
        }) => (
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <div className="input__group p-bottom-s">
              <label htmlFor="firstName" className="input__label">
                First Name
              </label>
              <input
                id="firstName"
                className="input"
                onBlur={handleBlur}
                onChange={handleChange}
                value={formValues?.firstName}
                type="text"
                name="firstName"
              />
              <span>{getFieldError('firstName')?.message}</span>
            </div>
            <div className="input__group p-bottom-s">
              <label className="input__label">Age</label>
              <input
                className="input"
                onBlur={handleBlur}
                onChange={handleChange}
                value={formValues?.age}
                type="number"
                name="age"
              />
              <span>{getFieldError('age')?.message}</span>
            </div>
            <input type="reset" />
            <button type="submit">FoO</button>
          </form>
        )}
      </Formidable>
    </div>
  );
}

export default NativeForm;
/* eslint-enable jsx-a11y/label-has-associated-control -- these are docs, it's fine */
