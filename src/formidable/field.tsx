/* eslint-disable react/jsx-props-no-spreading */
import React, { FunctionComponentElement, InputHTMLAttributes } from 'react';

import { useField } from './formidable-hooks';
import { FormidableValues } from './types';

export interface FieldProps<T extends FormidableValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  name: keyof T & string;
}

function Field<T extends FormidableValues>({
  name: key,
  ...props
}: FieldProps<T>): FunctionComponentElement<FieldProps<T>> {
  const [fieldValue, handleChange, handleBlur] = useField<T>(key);
  return (
    <input
      {...props}
      name={String(key)}
      value={String(fieldValue)}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}

export default Field;
/* eslint-enable react/jsx-props-no-spreading */
