/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FunctionComponentElement } from 'react';
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
  range: {
    min: number;
    max: number;
  };
};

const bar: Bar = {
  firstname: 'max',
  age: 1,
  range: {
    min: 1,
    max: 2,
  },
};

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
      <h3 className="text--title">Onboard components</h3>
      <p className="p-bottom-s text--regular">
        This scenario uses the Field and FieldError components exposed by the
        library
      </p>
      <Formidable<Bar>
        initialValues={bar}
        handleEvent={onEvent}
        validateOn={[FormidableEvent.Change]}
      >
        <Form>
          <div className="input__group p-bottom-s">
            <label className="input__label" htmlFor="firstname">
              Firstname
            </label>
            <Field<Bar>
              type="text"
              name="firstname"
              className="input"
            />
            <FieldError<Bar> name="firstname" />
          </div>
          <div className="input__group">
            <label className="input__label" htmlFor="age">
              Age
            </label>
            <Field<Bar> type="number" name="age" className="input" />
            <FieldError<Bar> name="age" />
          </div>
          <div className="input__group">
            <label className="input__label" htmlFor="age">
              Range
            </label>
            <Field<Bar, 'range'>
              type="number"
              name="range"
              subName="min"
              className="input"
            />
            <Field<Bar, 'range'>
              type="number"
              name="range"
              subName="max"
              className="input"
            />
            <FieldError<Bar> name="range" />
          </div>
        </Form>
      </Formidable>
    </div>
  );
}

export default OnBoardForm;
/* eslint-enable jsx-a11y/label-has-associated-control */
