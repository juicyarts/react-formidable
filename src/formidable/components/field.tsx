import React, { FunctionComponentElement } from 'react';

import { useFormidableContext, useField } from '../formidable-hooks';
import { FieldProps, FormidableValues } from '../types';

function Field<T extends FormidableValues, K extends keyof T & string = keyof T & string>({
  name: key,
  subName,
  value,
  ...props
}: FieldProps<T, K>): FunctionComponentElement<FieldProps<T, K>> {
  const { handleChange, handleBlur, handleFocus } = useFormidableContext<T>();
  const { value: fieldValue } = useField<T>(key);

  return (
    <>
      <input
        // eslint-disable-next-line react/jsx-props-no-spreading -- whitelisting is not needed
        {...props}
        id={key}
        name={key}
        value={value ?? String(fieldValue)}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </>
  );
}

export default Field;
