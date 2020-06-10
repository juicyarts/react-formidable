import React, { FunctionComponentElement } from 'react';
import { object as yupObject, number as yupNumber, string as yupString, ObjectSchema } from 'yup';

// FIXME: somehow the path resolution does not work proprly here (at least for eslint).
// It might be related to the absolute path, but thats kind of the way snowpack works
// with mounted paths. See mount script in snowpack.config.json for reference.
// You also need to assign the path in your tsconfig file to at least have type
// support. I guess there's a better approach to do this.
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-unresolved */
import Formidable, {
  Form,
  FormidableEvent,
  FormidableState,
  Field,
  FieldError,
} from '/parent/index';
/* eslint-enable import/no-absolute-path */
/* eslint-enable import/no-unresolved */

// import build variant after running yarn install instead if you want
// import Formidable, {
//   Form,
//   FormidableEvent,
//   FormidableState,
//   Field,
//   FieldError,
// } from '@eppendorf/react-formidable';

export type ExtendedSchema<T extends Record<string, unknown>> = ObjectSchema<T>;

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

function App(): FunctionComponentElement<unknown> {
  function onEvent(values?: Bar, formState?: FormidableState<Bar>, event?: FormidableEvent): void {
    console.debug('TEST:', event, formState, values);
  }

  return (
    <div>
      <h2>using onboard components</h2>
      <Formidable<Bar>
        initialValues={bar}
        validationSchema={barSchema}
        handleEvent={onEvent}
        validateOn={[FormidableEvent.Change]}
      >
        <Form>
          <Field<Bar> type="text" name="firstname" />
          <FieldError<Bar> name="firstname" />
          <Field<Bar> type="number" name="age" />
          <FieldError<Bar> name="age" />
        </Form>
      </Formidable>
      <br />

      <h2>using plain</h2>
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
          validateField,
          validateForm,
        }) => (
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <input
              onBlur={handleBlur}
              onChange={handleChange}
              value={formValues?.firstname}
              type="text"
              name="firstname"
            />
            <button type="button" onClick={async () => validateField('firstname')}>
              Validate Name
            </button>
            <span>{getFieldError('firstname')?.message}</span>
            <input
              onBlur={handleBlur}
              onChange={handleChange}
              value={formValues?.age}
              type="number"
              name="age"
            />
            <button type="button" onClick={async () => validateField('age')}>
              Validate Age
            </button>
            <span>{getFieldError('age')?.message}</span>
            <button type="button" onClick={() => validateForm()}>
              ValidateForm
            </button>
            <input type="reset" />
            <button type="submit">FoO</button>
          </form>
        )}
      </Formidable>
    </div>
  );
}

export default App;
