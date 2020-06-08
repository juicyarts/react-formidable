import React, { FunctionComponentElement, ReactNode } from 'react';

import { FormidableValues, FormidableComponentProps, FormidableContextProps } from './types';
import { useFormidable } from './formidable-hooks';
import { isFunction } from '../utils/index';
import { FormidableProvider } from './formidable-context';

function Formidable<Values extends FormidableValues>({
  children,
  className,
  ...props
}: FormidableComponentProps<Values>): FunctionComponentElement<FormidableComponentProps<Values>> {
  // FIXME: fix any :/
  const formidable: any = useFormidable<Values>(props);
  const foo = isFunction(children)
    ? (children as (formidableProps: FormidableContextProps<Values>) => ReactNode)(formidable)
    : children;
  return <FormidableProvider value={formidable}>{foo}</FormidableProvider>;
}

export default Formidable;
