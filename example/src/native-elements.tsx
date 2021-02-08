import React, { FunctionComponentElement } from 'react';
import {
  object as yupObject,
  number as yupNumber,
  string as yupString,
} from 'yup';

import Formidable, { FormidableEvent, FormidableState } from '../../src';

type Bar = {
  firstname: string;
  age: number;
};

const bar: Bar = {
  firstname: 'max',
  age: 1,
};

export const NameRegex = /^[a-zA-Z0-9 :./_/-]*$/;

const barSchema = yupObject().shape({
  firstname: yupString().required().max(10).matches(NameRegex),
  age: yupNumber().required().positive().min(12)
    .max(22),
});

function NativeForm(): FunctionComponentElement<unknown> {
  function onEvent(
    values?: Bar,
    formState?: Partial<FormidableState<Bar>>,
    event?: FormidableEvent,
  ): void {
    console.debug('TEST:', event, formState, values);
  }

  return (
    <div className="p-s">
      <h3 className="text--title">Using Plain form elements</h3>
      <p className="p-bottom-s text--regular">
        In this scenario we use plain html inputs
      </p>
      <Formidable<Bar>
        initialValues={bar}
        events={[FormidableEvent.Change]}
        handleEvent={onEvent}
        validationSchema={barSchema}
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
              <label htmlFor="firstname" className="input__label">
                Firstname
              </label>
              <input
                id="firstname"
                className="input"
                onBlur={handleBlur}
                onChange={handleChange}
                value={formValues?.firstname}
                type="text"
                name="firstname"
              />
              <span>{getFieldError('firstname')?.message}</span>
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
