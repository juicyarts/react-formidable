/* eslint-disable react/jsx-props-no-spreading */
import React, { FunctionComponentElement } from 'react';

import { FormProps } from '../types';
import { useFormidableContext } from '../formidable-hooks';

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
