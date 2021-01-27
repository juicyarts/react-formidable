import React, { FunctionComponentElement } from 'react';
import {
  object as yupObject,
  number as yupNumber,
  string as yupString,
} from 'yup';

import Formidable, {
  Form,
  FormidableEvent,
  FormidableState,
  Field,
  FieldError,
} from '../../src';

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
  age: yupNumber().required().positive().min(12).max(22),
});

function OnBoardForm(): FunctionComponentElement<unknown> {
  function onEvent(
    values?: Bar,
    formState?: Partial<FormidableState<Bar>>,
    event?: FormidableEvent,
  ): void {
    console.debug('TEST:', event, formState, values);
  }

  return (
    <div className="p-s">
      <h2>using onboard components</h2>
      <Formidable<Bar>
        initialValues={bar}
        validationSchema={barSchema}
        handleEvent={onEvent}
        validateOn={[FormidableEvent.Change]}
      >
        <Form>
          <div className="input__group p-bottom-s">
            <label className="input__label" htmlFor="firstname">
              Firstname
            </label>
            <Field<Bar> type="text" name="firstname" className="input" />
            <FieldError<Bar> name="firstname" />
          </div>
          <div className="input__group">
            <label className="input__label" htmlFor="age">
              Age
            </label>
            <Field<Bar> type="number" name="age" className="input" />
            <FieldError<Bar> name="age" />
          </div>
        </Form>
      </Formidable>
    </div>
  );
}

export default OnBoardForm;
