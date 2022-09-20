import React, { FunctionComponentElement, useMemo, useCallback } from 'react';

import { useField } from '../formidable-hooks';
import { FormidableEvent, FieldProps, FormidableValues, AdditionalCheckboxProps } from '../types';

function Checkbox<T extends FormidableValues, K extends keyof T & string = keyof T & string>({
  name: key,
  value: displayValue,
  booleanKey,
  displayKey,
  ...props
}: FieldProps<T, K> & AdditionalCheckboxProps): FunctionComponentElement<
  FieldProps<T, K> & AdditionalCheckboxProps
> {
  const { value: fieldValue, setField } = useField<T>(key);

  const isStringArray = useCallback(
    (arr: any[]): boolean => arr.every((el) => typeof el === 'string'),
    [],
  );

  const isValidObjectArray = useMemo(
    () =>
      !(
        Array.isArray(fieldValue) &&
        !isStringArray(fieldValue) &&
        !(booleanKey && displayKey && fieldValue[0][booleanKey] && fieldValue[0][displayKey])
      ),
    [],
  );

  if (!isValidObjectArray) {
    throw new Error(
      'fieldValue is object[] but either "booleanKey" and/or "displayKey" have not been set or are not named correctly. Please check these props.',
    );
  }

  const computeNewValue = useCallback((): any | undefined => {
    if (Array.isArray(fieldValue)) {
      if (isStringArray(fieldValue)) {
        return fieldValue.includes(displayValue)
          ? fieldValue.filter((el) => el !== displayValue)
          : [...fieldValue, displayValue];
      }

      if (booleanKey && displayKey) {
        return fieldValue.map((el) => {
          if (props.id === el[displayKey]) {
            return { ...el, [booleanKey]: !el[booleanKey] };
          }
          return el;
        });
      }
    }

    if (typeof fieldValue === 'boolean') {
      return !fieldValue;
    }

    return undefined;
  }, [displayValue, fieldValue]);

  const handleCheckboxChange = (): void => {
    setField(key, computeNewValue() as T[keyof T], FormidableEvent.Change);
  };

  const isChecked = useMemo((): boolean => {
    if (Array.isArray(fieldValue)) {
      if (isStringArray(fieldValue)) {
        return fieldValue.includes(displayValue);
      }
      if (booleanKey && displayKey) {
        return fieldValue.find((e) => e[displayKey] === props.id)[booleanKey];
      }
    }

    return !!fieldValue;
  }, [fieldValue, displayValue]);

  return (
    <input
      /* eslint-disable-next-line react/jsx-props-no-spreading -- otherwise we would need to explicitly list all input props possible */
      {...props}
      name={key}
      value={displayValue}
      onChange={handleCheckboxChange}
      checked={isChecked}
      type="checkbox"
    />
  );
}

export default Checkbox;
