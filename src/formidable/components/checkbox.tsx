import React, { FunctionComponentElement, useMemo, useCallback } from 'react';

import { useField } from '../formidable-hooks';
import { FormidableEvent, FieldProps, FormidableValues, AdditionalCheckboxProps } from '../types';

function Checkbox<T extends FormidableValues, K extends keyof T & string = keyof T & string>({
  name: key,
  value: displayLabel,
  booleanProperty,
  displayProperty,
  ...props
}: FieldProps<T, K> & AdditionalCheckboxProps): FunctionComponentElement<
  FieldProps<T, K> & AdditionalCheckboxProps
> {
  const { value: fieldValue, setField } = useField<T>(key);

  const isStringArray = useCallback(
    (arr: any[]): arr is string[] =>
      Array.isArray(fieldValue) && arr.every((el) => typeof el === 'string'),
    [],
  );

  const isObjectArray = useCallback(
    (arr: any[]): arr is Record<string, unknown>[] =>
      Array.isArray(fieldValue) && arr.every((el) => typeof el === 'object' && el !== null),
    [],
  );

  const isValidObjectArray = useCallback(
    (arr: any[]): boolean =>
      !!(
        isObjectArray(arr) &&
        booleanProperty &&
        displayProperty &&
        arr[0][booleanProperty] &&
        arr[0][displayProperty]
      ),
    [],
  );

  if (Array.isArray(fieldValue) && !isStringArray(fieldValue) && !isValidObjectArray(fieldValue)) {
    throw new Error(
      'fieldValue is object[] but either "booleanProperty" and/or "displayProperty" have not been set or are not named correctly. Please check these props.',
    );
  }

  const computeNewValue = useCallback((): any | undefined => {
    if (Array.isArray(fieldValue)) {
      if (isStringArray(fieldValue)) {
        return fieldValue.includes(displayLabel)
          ? fieldValue.filter((el) => el !== displayLabel)
          : [...fieldValue, displayLabel];
      }

      if (booleanProperty && displayProperty) {
        return fieldValue.map((el) => {
          if (props.id === el[displayProperty]) {
            return { ...el, [booleanProperty]: !el[booleanProperty] };
          }
          return el;
        });
      }
    }

    if (typeof fieldValue === 'boolean') {
      return !fieldValue;
    }

    return undefined;
  }, [displayLabel, fieldValue]);

  const handleCheckboxChange = (): void => {
    setField(key, computeNewValue() as T[keyof T], FormidableEvent.Change);
  };

  const isChecked = useMemo((): boolean => {
    if (Array.isArray(fieldValue)) {
      if (isStringArray(fieldValue)) {
        return fieldValue.includes(displayLabel);
      }
      if (booleanProperty && displayProperty) {
        return fieldValue.find((e) => e[displayProperty] === props.id)[booleanProperty];
      }
    }

    return !!fieldValue;
  }, [fieldValue, displayLabel]);

  return (
    <input
      /* eslint-disable-next-line react/jsx-props-no-spreading -- otherwise we would need to explicitly list all input props possible */
      {...props}
      name={key}
      value={displayLabel}
      onChange={handleCheckboxChange}
      checked={isChecked}
      type="checkbox"
    />
  );
}

export default Checkbox;
