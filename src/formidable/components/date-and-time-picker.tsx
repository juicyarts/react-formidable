/* eslint-disable react/jsx-props-no-spreading -- react no like but its unreasonable to pass each input prop by hand */
import React, { ChangeEvent, FunctionComponentElement, useMemo, useCallback } from 'react';

import {
  formatDateTimeStringToTime,
  formatDateTimeStringToDate,
} from '../../utils/time/time.helper';
import { useField } from '../formidable-hooks';
import { DateAndTimePickerProps, FormidableValues, FormidableEvent } from '../types';

import PlainField from './plain-field';

function DateAndTimePicker<
  T extends FormidableValues,
  K extends keyof T & string = keyof T & string,
>({
  name: key,
  label,
  min,
  max,
  ...props
}: DateAndTimePickerProps<T, K>): FunctionComponentElement<DateAndTimePickerProps<T, K>> {
  const { value, setField } = useField<T>(key);

  const minDate = useMemo(() => (min ? formatDateTimeStringToDate(String(min)) : undefined), [min]);
  const minTime = useMemo(() => (min ? formatDateTimeStringToTime(String(min)) : undefined), [min]);
  const maxDate = useMemo(() => (max ? formatDateTimeStringToDate(String(max)) : undefined), [max]);
  const maxTime = useMemo(() => (max ? formatDateTimeStringToTime(String(max)) : undefined), [max]);

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>): void => {
      if (typeof value === 'string') {
        if (ev.target.type === 'time') {
          setField(
            key,
            `${formatDateTimeStringToDate(value)}T${ev.target.value}` as T[keyof T],
            FormidableEvent.Change,
          );
        } else {
          setField(
            key,
            `${ev.target.value}T${formatDateTimeStringToTime(value)}` as T[keyof T],
            FormidableEvent.Change,
          );
        }
      }
    },
    [value],
  );

  return (
    <>
      <div className="input__group col-8">
        <label htmlFor={key} className="input__label">
          {label}
        </label>
        <PlainField
          key={`${key}1`}
          {...props}
          name={key}
          type="date"
          value={formatDateTimeStringToDate(String(value))}
          min={minDate}
          max={maxDate}
          onChange={handleChange}
        />
      </div>
      <div className="input__group col-4">
        <PlainField
          key={`${key}2`}
          {...props}
          name={key}
          type="time"
          value={formatDateTimeStringToTime(String(value))}
          min={minTime}
          max={maxTime}
          onChange={handleChange}
        />
      </div>
    </>
  );
}

export default DateAndTimePicker;
/* eslint-enable react/jsx-props-no-spreading -- react no like but its unreasonable to pass each input prop by hand */
