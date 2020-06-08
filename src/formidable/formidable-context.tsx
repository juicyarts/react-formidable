import React, {
  createContext,
  ReactElement,
  ComponentType,
} from 'react';

import { FormidableValues } from './types';

export const FormidableContext = createContext({ formState: {} });

export const FormidableProvider = FormidableContext.Provider;
export const FormidableConsumer = FormidableContext.Consumer;

function withFormidable<T extends FormidableValues>(
  Component: ComponentType<T>,
): (props: T) => ReactElement {
  return (props): ReactElement => (
    <FormidableConsumer>
      {(context): ReactElement => <Component formContext={context} {...props} />}
    </FormidableConsumer>
  );
}

export default withFormidable;
