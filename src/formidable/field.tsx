/* eslint-disable react/jsx-props-no-spreading */
import React, { FunctionComponentElement, InputHTMLAttributes } from 'react';

import { useFormidableContext, useField } from './formidable-hooks';
import { FormidableValues } from './types';

export interface FieldProps<T extends FormidableValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  name: keyof T & string;
}

function Field<T extends FormidableValues>({
  name: key,
  ...props
}: FieldProps<T>): FunctionComponentElement<FieldProps<T>> {
  const { handleChange, handleBlur, handleFocus } = useFormidableContext<T>();
  const { value } = useField<T>(key);

  return (
    <input
      {...props}
      name={String(key)}
      value={String(value)}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  );
}

export default Field;
/* eslint-enable react/jsx-props-no-spreading */
