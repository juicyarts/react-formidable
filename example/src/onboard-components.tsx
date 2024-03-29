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
  Checkbox,
  DateAndTimePicker,
  Textarea,
} from '../../src';

type Bar = {
  firstName: string;
  age: number;
  country: string;
  language: string;
  device: string[];
  isChecked: boolean;
  roles: string[];
  features: Record<string, string | any>[];
  startDateTime: string;
  description: string;
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

const availableRoles = ['StandardUser', 'Admin', 'LabManager'];

const bar: Bar = {
  firstName: 'max',
  age: 1,
  country: allCountries[0],
  language: allLanguages[0].value,
  device: ['Pipette'],
  isChecked: false,
  roles: ['StandardUser', 'Admin'],
  features: [
    {
      name: 'Feature1',
      enabled: true,
    },
    {
      name: 'Feature2',
      enabled: false,
    },
  ],
  startDateTime: new Date().toISOString(),
  description: 'ExampleDescription '.repeat(10),
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
        {({ formState }) => (
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
            <div className="input__group m-y-l">
              <label className="input__label" htmlFor="isChecked">
                Checkbox: single boolean key
              </label>
              <Checkbox<Bar> name="isChecked" className="checkbox" />
              <pre className="m-top-s">
                {JSON.stringify(formState?.values.isChecked, null, 2)}
              </pre>
            </div>
            <div className="input__group m-y-l">
              <label className="input__label" htmlFor="isChecked">
                Checkboxes: object array
              </label>
              <ul>
                {formState?.values.features.map((e) => (
                  <li>
                    <Checkbox<Bar>
                      name="features"
                      value={e.name}
                      id={e.name}
                      booleanProperty="enabled"
                      displayProperty="name"
                    />
                    <label htmlFor={e.name} className="checkboxLabel">
                      {e.name}
                    </label>
                  </li>
                ))}
              </ul>
              <pre className="m-top-s">
                {JSON.stringify(formState?.values.features, null, 2)}
              </pre>
            </div>
            <div className="input__group m-y-l">
              <label className="input__label" htmlFor="isChecked">
                Checkboxes: string array
              </label>
              <ul>
                {availableRoles.map((e) => (
                  <li>
                    <Checkbox<Bar> name="roles" value={e} id={e} />
                    <label htmlFor={e} className="checkboxLabel">
                      {e}
                    </label>
                  </li>
                ))}
              </ul>
              <pre className="m-top-s">
                {JSON.stringify(formState?.values.roles, null, 2)}
              </pre>
            </div>
            <div className="row flex__ai--flex-end">
              <DateAndTimePicker<Bar>
                label="time"
                id="startDateTime"
                name="startDateTime"
                className="input"
                min={new Date().toISOString()}
                required
              />
            </div>
            <div className="input__group">
              <label className="input__label" htmlFor="age">
                Description
              </label>
              <Textarea<Bar> name="description" className="textarea" />
            </div>
          </Form>
        )}
      </Formidable>
    </div>
  );
}

export default OnBoardForm;
/* eslint-enable jsx-a11y/label-has-associated-control */
