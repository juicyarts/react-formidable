import React, { FunctionComponentElement } from 'react';

import { useFormidableContext, useField } from '../formidable-hooks';
import { FieldProps, FormidableValues } from '../types';

import PlainField from './plain-field';

function Field<T extends FormidableValues, K extends keyof T & string = keyof T & string>({
  name: key,
  ...props
}: FieldProps<T, K>): FunctionComponentElement<FieldProps<T, K>> {
  const { handleChange, handleBlur, handleFocus } = useFormidableContext<T>();
  const { value } = useField<T>(key);

  return (
    <PlainField
      // eslint-disable-next-line react/jsx-props-no-spreading -- whitelisting is not needed
      {...props}
      id={key}
      name={key}
      value={String(value)}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  );
}

export default Field;
