/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FunctionComponentElement, useCallback } from 'react';

import Formidable, {
  Form,
  FormidableEvent,
  FormidableState,
  Field,
  FieldError,
  Select,
  AdvancedSelect,
} from '../../src';

type Bar = {
  firstName: string;
  age: number;
  country: string;
  language: string;
  device: string[];
};

const allCountries = ['Germany', 'France', 'Netherlands'];
const allLanguages = [
  {
    value: 'en',
    displayValue: 'English',
  },
  {
    value: 'de',
    displayValue: 'German',
  },
];

const allDevices = [
  {
    displayValue: 'Shaker',
    value: ['Shaker'],
  },
  {
    displayValue: 'Freezer',
    value: ['Freezer'],
  },
  {
    displayValue: 'Thermomixer',
    value: ['Thermomixer'],
  },
  {
    displayValue: 'Centrifuge',
    value: ['Centrifuge'],
  },
  {
    displayValue: 'Pipette',
    value: ['Pipette'],
  },
  {
    displayValue: 'Incubator',
    value: ['Incubator'],
  },
  {
    displayValue: 'All',
    value: [],
  },
  {
    displayValue: 'Recommended',
    value: ['Pipette'],
  },
];
const bar: Bar = {
  firstName: 'max',
  age: 1,
  country: allCountries[0],
  language: allLanguages[0].value,
  device: ['Pipette'],
};

function OnBoardForm(): FunctionComponentElement<unknown> {
  const onEvent = useCallback(
    (
      values?: Partial<Bar>,
      formState?: Partial<FormidableState<Bar>>,
      event?: FormidableEvent,
    ): void => {
      console.debug('Onboard Form | Form changed:', event, formState, values);
    },
    [],
  );

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
            <label className="input__label" htmlFor="firstName">
              First Name
            </label>
            <Field<Bar> type="text" name="firstName" className="input" />
            <FieldError<Bar> name="firstName" />
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
              Country
            </label>
            <Select<Bar>
              name="country"
              options={allCountries}
              className="select"
            />
            <FieldError<Bar> name="age" />
          </div>
          <div className="input__group">
            <label className="input__label" htmlFor="age">
              Language
            </label>
            <AdvancedSelect<Bar>
              name="language"
              options={allLanguages}
              className="select"
            />
          </div>
          <div className="input__group">
            <label className="input__label" htmlFor="age">
              Foo / advanced select with array as value
            </label>
            <AdvancedSelect<Bar>
              name="device"
              options={allDevices}
              className="select"
            />
          </div>
        </Form>
      </Formidable>
    </div>
  );
}

export default OnBoardForm;
/* eslint-enable jsx-a11y/label-has-associated-control */
