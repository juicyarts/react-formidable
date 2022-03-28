import React, { FunctionComponentElement, ReactNode } from 'react';

import { isFunction } from '../utils/index';

import { FormidableProvider } from './formidable-context';
import useFormidable from './formidable-hooks';
import { FormidableValues, FormidableComponentProps, FormidableContextProps } from './types';

function Formidable<Values extends FormidableValues>({
  children,
  className,
  ...props
}: FormidableComponentProps<Values>): FunctionComponentElement<FormidableComponentProps<Values>> {
  const formidable: FormidableContextProps<Values> = useFormidable<Values>(props);
  const foo = isFunction(children)
    ? (children as (formidableProps: FormidableContextProps<Values>) => ReactNode)(formidable)
    : children;
  return <FormidableProvider value={formidable}>{foo}</FormidableProvider>;
}

export default Formidable;
