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
    console.debug('Async Form | Form changed:', event, formState, values);
    if (values) setBar(values);
  }

  useEffect(() => {
    setTimeout(() => {
      setBar(initialBar);
      console.debug('Async Form | Initial data updated:', initialBar);
    }, 5000);
  }, []);

  return (
    <div className="p-s">
      <h3 className="text--title">Async/updating initial</h3>
      <p className="p-bottom-s text--regular">
        In this scenario the initial data changes after a given timeout
      </p>
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
          </div>
          <div className="input__group">
            <label className="input__label" htmlFor="age">
              Age
            </label>
            <Field<Bar> type="number" name="age" className="input" />
          </div>
        </Form>
      </Formidable>
    </div>
  );
}

export default AsyncForm;
