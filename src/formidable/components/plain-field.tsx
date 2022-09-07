/* eslint-disable react/jsx-props-no-spreading -- react no like but its unreasonable to pass each input prop by hand */
import React, { FunctionComponentElement } from 'react';

import { PlainFieldProps } from '../types';

function PlainField({
  name,
  ...props
}: PlainFieldProps): FunctionComponentElement<PlainFieldProps> {
  return <input {...props} className="input" />;
}

export default PlainField;
/* eslint-enable react/jsx-props-no-spreading -- react no like but its unreasonable to pass each input prop by hand */
