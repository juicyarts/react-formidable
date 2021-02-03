import React, { FunctionComponentElement, ChangeEvent } from 'react';

import { useField, useFormidableContext } from '../formidable-hooks';
import { AdvancedSelectProps, FormidableEvent, FormidableValues } from '../types';

function SelectField<T extends FormidableValues>({
  name,
  options,
  ...props
}: AdvancedSelectProps<T>): FunctionComponentElement<AdvancedSelectProps<T>> {
  const { setField } = useFormidableContext<T>();
  const { value } = useField<T>(name);

  function handleChange(ev: ChangeEvent<HTMLSelectElement>): void {
    const selection = options.find((option) => option.displayValue === ev.target.value);
    if (selection) setField(name, selection as any, FormidableEvent.Change);
  }

  return (
    <select
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      name={String(name)}
      value={(value as any)?.displayValue || ''}
      onChange={handleChange}
    >
      {options.map((option) => (
        <option key={option.displayValue}>{option.displayValue}</option>
      ))}
    </select>
  );
}

export default SelectField;
