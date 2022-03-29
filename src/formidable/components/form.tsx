import React, { FunctionComponentElement } from 'react';

import { useFormidableContext } from '../formidable-hooks';
import { FormProps } from '../types';

function Form({ children, ...rest }: FormProps): FunctionComponentElement<FormProps> {
  const { handleSubmit, handleReset } = useFormidableContext();

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading -- whitelisting is not needed
    <form onSubmit={handleSubmit} onReset={handleReset} {...rest}>
      {children}
    </form>
  );
}

export default Form;
