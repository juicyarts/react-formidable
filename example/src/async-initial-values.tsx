import React, {
  FunctionComponentElement,
  useCallback,
  useEffect,
  useState,
} from 'react';

import Formidable, {
  Form,
  FormidableEvent,
  FormidableState,
  Field,
} from '../../src';

import { MockFormType, mockFormData } from './utils';

function AsyncForm(): FunctionComponentElement<unknown> {
  const [bar, setBar] = useState<Partial<MockFormType>>({ age: 0 });

  const onEvent = useCallback(
    (
      values?: Partial<MockFormType>,
      formState?: Partial<FormidableState<MockFormType>>,
      event?: FormidableEvent,
    ): void => {
      console.debug('Async Form | Form changed:', event, formState, values);
      if (values) setBar(values);
    },
    [],
  );

  useEffect(() => {
    setTimeout(() => {
      setBar(mockFormData);
      console.debug('Async Form | Initial data updated:', mockFormData);
    }, 5000);
  }, []);

  return (
    <div className="p-s">
      <h3 className="text--title">Async/updating initial</h3>
      <p className="p-bottom-s text--regular">
        In this scenario the initial data changes after a given timeout
      </p>
      <Formidable<Partial<MockFormType>>
        initialValues={bar}
        handleEvent={onEvent}
        validateOn={[FormidableEvent.Change]}
      >
        <Form>
          <div className="input__group p-bottom-s">
            <label className="input__label" htmlFor="firstName">
              First Name
            </label>
            <Field<MockFormType>
              type="text"
              name="firstName"
              className="input"
            />
          </div>
          <div className="input__group">
            <label className="input__label" htmlFor="age">
              Age
            </label>
            <Field<MockFormType> type="number" name="age" className="input" />
          </div>
        </Form>
      </Formidable>
    </div>
  );
}

export default AsyncForm;
