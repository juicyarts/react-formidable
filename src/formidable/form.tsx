/* eslint-disable react/jsx-props-no-spreading */
import React, { FunctionComponentElement, ReactNode, FormHTMLAttributes } from 'react';

import { useFormidableContext } from './formidable-hooks';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

function Form({ children, ...rest }: FormProps): FunctionComponentElement<FormProps> {
  const { handleSubmit, handleReset } = useFormidableContext();

  return (
    <form onSubmit={handleSubmit} onReset={handleReset} {...rest}>
      {children}
    </form>
  );
}

export default Form;
/* eslint-enable react/jsx-props-no-spreading */
