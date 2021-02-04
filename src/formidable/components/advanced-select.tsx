import React, { FunctionComponentElement, ChangeEvent } from 'react';

import { useField, useFormidableContext } from '../formidable-hooks';
import { AdvancedSelectProps, FormidableEvent, FormidableValues } from '../types';

function AdvancedSelect<T extends FormidableValues>({
  name: key,
  options,
  ...props
}: AdvancedSelectProps<T>): FunctionComponentElement<AdvancedSelectProps<T>> {
  const { setField } = useFormidableContext<T>();
  const { value } = useField<T>(key);
  const selectedOption = options.find((option) => option.value === value);

  function handleChange(ev: ChangeEvent<HTMLSelectElement>): void {
    const selection = options.find((option) => option.displayValue === ev.target.value);
    if (selection) setField(key, selection.value, FormidableEvent.Change);
  }

  return (
    <select
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      name={key}
      value={selectedOption?.displayValue || ''}
      onChange={handleChange}
    >
      {options.map((option) => (
        <option key={option.displayValue}>{option.displayValue}</option>
      ))}
    </select>
  );
}

export default AdvancedSelect;
