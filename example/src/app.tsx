import React, { FunctionComponentElement } from 'react';
import {
  object as yupObject,
  number as yupNumber,
  string as yupString,
  ObjectSchema,
} from 'yup';

import OnBoardForm from './onboard-componets';
import NativeForm from './native-elements';

// FIXME: somehow the path resolution does not work proprly here (at least for eslint).
// It might be related to the absolute path, but thats kind of the way snowpack works
// with mounted paths. See mount script in snowpack.config.json for reference.
// You also need to assign the path in your tsconfig file to at least have type
// support. I guess there's a better approach to do this.
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-unresolved */
import Formidable, { FormidableEvent, FormidableState } from '../../src';
import AsyncForm from './async-initial-values';
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
  function onEvent(
    values?: Bar,
    formState?: Partial<FormidableState<Bar>>,
    event?: FormidableEvent,
  ): void {
    console.debug('TEST:', event, formState, values);
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="p-s">
            <h1>Formidable Testing & Examples</h1>
            <p>
              This Example application uses @eppendorf/css/visionize for its
              styling
            </p>
          </div>
        </div>
      </div>
      <OnBoardForm />
      <NativeForm />
      <AsyncForm />
    </div>
  );
}

export default App;
