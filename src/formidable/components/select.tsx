import React, { FunctionComponentElement } from 'react';

import { useField, useFormidableContext } from '../formidable-hooks';
import { FormidableValues, SelectProps } from '../types';

function SelectField<T extends FormidableValues>({
  name,
  options,
  ...props
}: SelectProps<T>): FunctionComponentElement<SelectProps<T>> {
  const { handleChange, handleBlur, handleFocus } = useFormidableContext<T>();
  const { value } = useField<T>(name);

  return (
    <select
      // eslint-disable-next-line react/jsx-props-no-spreading -- whitelisting is not needed
      {...props}
      name={String(name)}
      value={String(value)}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

export default SelectField;
