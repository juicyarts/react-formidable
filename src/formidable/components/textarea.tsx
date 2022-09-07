/* eslint-disable react/jsx-props-no-spreading -- react no like but its unreasonable to pass each input prop by hand */
import React, { FunctionComponentElement } from 'react';

import { useFormidableContext, useField } from '../formidable-hooks';
import { TextareaProps, FormidableValues } from '../types';

function Textarea<T extends FormidableValues, K extends keyof T & string = keyof T & string>({
  name: key,
  rows = 5,
  ...props
}: TextareaProps<T, K>): FunctionComponentElement<TextareaProps<T, K>> {
  const { value } = useField(key);
  const { handleChange, handleBlur, handleFocus } = useFormidableContext<T>();
  return (
    <textarea
      {...props}
      id={key}
      name={key}
      value={String(value)}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      rows={rows}
    />
  );
}

export default Textarea;

/* eslint-enable react/jsx-props-no-spreading -- react no like but its unreasonable to pass each input prop by hand */
