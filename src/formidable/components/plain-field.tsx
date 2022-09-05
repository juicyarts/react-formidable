/* eslint-disable react/jsx-props-no-spreading -- react no like but its unreasonable to pass each input prop by hand */

import React, { FunctionComponentElement } from 'react';

import { PlainFieldProps } from '../types';

function PlainField(props: PlainFieldProps): FunctionComponentElement<PlainFieldProps> {
  // eslint-disable-next-line react/destructuring-assignment -- props.name should get passed on but we need the id as well
  return <input id={`${props.name}`} {...props} className="input" />;
}

export default PlainField;
/* eslint-enable react/jsx-props-no-spreading -- react no like but its unreasonable to pass each input prop by hand */
