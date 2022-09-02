import React, { FunctionComponentElement, useMemo } from 'react';

import { useField } from '../formidable-hooks';
import { FormidableEvent, FieldProps, FormidableValues } from '../types';

export interface AdditionalCheckboxProps {
  booleanPropName?: string;
  nameProp?: string;
}

function Checkbox<T extends FormidableValues, K extends keyof T & string = keyof T & string>({
  name: key,
  value,
  booleanPropName,
  nameProp,
  subName,
  ...props
}: FieldProps<T, K> & AdditionalCheckboxProps): FunctionComponentElement<
  FieldProps<T, K> & AdditionalCheckboxProps
> {
  const { value: fieldValue, setField } = useField<T>(key);

  const isStringArray = React.useCallback(
    (arr: any[]): boolean => arr.every((el) => typeof el === 'string'),
    [fieldValue],
  );

  const isValidObjectArray = useMemo(
    () => Array.isArray(fieldValue) && !isStringArray(fieldValue) && !(booleanPropName && nameProp),
    [fieldValue, booleanPropName, nameProp],
  );

  if (isValidObjectArray) {
    throw new Error(
      'fieldValue is object[] but "booleanPropName", "nameProp" or both have not been set',
    );
  }

  const computeNewValue = React.useCallback((): any | undefined => {
    if (Array.isArray(fieldValue)) {
      if (isStringArray(fieldValue)) {
        return fieldValue.includes(value)
          ? fieldValue.filter((el) => el !== value)
          : [...fieldValue, value];
      }

      if (booleanPropName && nameProp) {
        return fieldValue.map((el) => {
          if (props.id === el[nameProp]) {
            return { ...el, [booleanPropName]: !el[booleanPropName] };
          }
          return el;
        });
      }
    }

    if (typeof fieldValue === 'boolean') {
      return !fieldValue;
    }

    return undefined;
  }, [value, fieldValue]);

  const handleCheckboxChange = (): void => {
    setField(key, computeNewValue() as T[keyof T], FormidableEvent.Change);
  };

  const isChecked = useMemo((): boolean => {
    if (Array.isArray(fieldValue)) {
      if (isStringArray(fieldValue)) {
        return fieldValue.includes(value);
      }
      if (booleanPropName && nameProp) {
        return fieldValue.find((e) => e[nameProp] === props.id)[booleanPropName];
      }
    }

    return !!fieldValue;
  }, [fieldValue, value]);

  return (
    <input
      /* eslint-disable-next-line react/jsx-props-no-spreading -- otherwise we would need to explicitly list all input props possible */
      {...props}
      name={key}
      value={value}
      onChange={handleCheckboxChange}
      checked={isChecked}
      type="checkbox"
    />
  );
}

export default Checkbox;
