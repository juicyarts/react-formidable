/* eslint-disable react/jsx-props-no-spreading */
import React, { FunctionComponentElement } from 'react';

import { useFormidableContext, useField } from '../formidable-hooks';
import { FieldProps, FormidableValues } from '../types';

function Field<T extends FormidableValues, K extends keyof T & string = keyof T & string>({
  name: key,
  subName,
  ...props
}: FieldProps<T, K>): FunctionComponentElement<FieldProps<T, K>> {
  const { handleChange, handleBlur, handleFocus } = useFormidableContext<T>();
  const { value } = useField<T>(key);

  return (
    <input
      {...props}
      id={key}
      name={key}
      value={value as string}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  );
}

export default Field;
/* eslint-enable react/jsx-props-no-spreading */
