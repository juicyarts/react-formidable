import React, { FunctionComponentElement, ChangeEvent, useEffect, useState } from 'react';

import { useField, useFormidableContext } from '../formidable-hooks';
import {
  AdvancedSelectOption,
  AdvancedSelectProps,
  FormidableEvent,
  FormidableValues,
} from '../types';

function AdvancedSelect<T extends FormidableValues>({
  name: key,
  options,
  ...props
}: AdvancedSelectProps<T>): FunctionComponentElement<AdvancedSelectProps<T>> {
  const { setField } = useFormidableContext<T>();
  const { value } = useField<T>(key);

  function mapSelectedValueToOption(val = value): AdvancedSelectOption<T[keyof T]> | undefined {
    return options.find((option) => {
      // This is a rather simple check that might break when keys in objects are sorted differently;
      // That use case is quite uncommon but might occur.
      if (typeof val === 'object') {
        return JSON.stringify(option.value) === JSON.stringify(val);
      }
      return option.value === val;
    });
  }

  const [selectedOption, setSelectedOption] = useState(mapSelectedValueToOption());

  function handleChange(ev: ChangeEvent<HTMLSelectElement>): void {
    const selection = options.find((option) => option.displayValue === ev.target.value);
    if (selection) {
      setField(key, selection.value, FormidableEvent.Change);
    }
  }

  useEffect(() => {
    if (selectedOption?.value !== value) {
      setSelectedOption(mapSelectedValueToOption(value));
    }
  }, [value]);

  return (
    <select
      // eslint-disable-next-line react/jsx-props-no-spreading -- whitelisting is not needed
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
