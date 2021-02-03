import React, { FunctionComponentElement } from 'react';

import { useFieldError } from '../formidable-hooks';
import { FeldErrorProps, FormidableValues } from '../types';

function FieldError<T extends FormidableValues>({
  name,
}: FeldErrorProps<T>): FunctionComponentElement<FeldErrorProps<T>> {
  const fieldError = useFieldError<T>(name);

  return <span>{fieldError?.message}</span>;
}

export default FieldError;
