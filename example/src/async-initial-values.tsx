import React, { FunctionComponentElement, useEffect, useState } from 'react';

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

const initialBar: Bar = {
  firstname: 'max',
  age: 1,
};

function AsyncForm(): FunctionComponentElement<unknown> {
  const [bar, setBar] = useState<Partial<Bar>>({ age: 0 });

  function onEvent(
    values?: Partial<Bar>,
    formState?: Partial<FormidableState<Bar>>,
    event?: FormidableEvent,
  ): void {
    console.debug('Async Form Change:', event, formState, values);
    if (values) setBar(values);
  }

  useEffect(() => {
    setTimeout(() => {
      setBar(initialBar);
      console.debug('DATA UPDATED', initialBar);
    }, 5000);
  }, []);

  return (
    <div className="p-s">
      <h2>Async/updating initial</h2>
      <Formidable<Partial<Bar>>
        initialValues={bar}
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

export default AsyncForm;
