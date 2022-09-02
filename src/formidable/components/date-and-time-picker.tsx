/* eslint-disable react/jsx-props-no-spreading -- react no like but its unreasonable to pass each input prop by hand */
import React, { ChangeEvent, FunctionComponentElement, useState, useMemo, useEffect } from 'react';

import { DateTimeFormat, formatDateTimeString } from '../../utils/time/time.helper';
import { useField } from '../formidable-hooks';
import { DateAndTimePickerProps, FormidableValues, FormidableEvent } from '../types';

import Field from './field';

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
  const [date, setDate] = useState(formatDateTimeString(value as string, DateTimeFormat.YYYMMDD));
  const [time, setTime] = useState(formatDateTimeString(value as string, DateTimeFormat.HHMM));

  const minDate = useMemo(() => {
    if (!min) return undefined;
    return formatDateTimeString(min as string, DateTimeFormat.YYYMMDD);
  }, [min]);
  const minTime = useMemo(() => {
    if (!min) return undefined;
    return formatDateTimeString(min as string, DateTimeFormat.HHMM);
  }, [min]);

  const maxDate = useMemo(() => {
    if (!max) return undefined;
    return formatDateTimeString(max as string, DateTimeFormat.YYYMMDD);
  }, [max]);
  const maxTime = useMemo(() => {
    if (!max) return undefined;
    return formatDateTimeString(max as string, DateTimeFormat.HHMM);
  }, [max]);

  // overwrite state when new value is provided
  useEffect(() => {
    const newDate = formatDateTimeString(value as string, DateTimeFormat.YYYMMDD);
    const newTime = formatDateTimeString(value as string, DateTimeFormat.HHMM);
    if (newDate !== date) setDate(newDate);
    if (newTime !== time) setTime(newTime);
  }, [value]);

  function handleChange(ev: ChangeEvent<HTMLInputElement>): void {
    let val = `${formatDateTimeString(
      value as string,
      DateTimeFormat.YYYMMDD,
    )}T${formatDateTimeString(time as string, DateTimeFormat.HHMM)}`;

    if (ev.target.type === 'time') {
      setTime(ev.target.value);
      if (ev.target.value)
        val = `${formatDateTimeString(value as string, DateTimeFormat.YYYMMDD)}T${ev.target.value}`;
    } else {
      setDate(ev.target.value);
      if (ev.target.value)
        val = `${ev.target.value}T${formatDateTimeString(time as string, DateTimeFormat.HHMM)}`;
    }

    const transformedVal = new Date(val);
    if (!Number.isNaN(transformedVal.getFullYear())) {
      setField(key, transformedVal.toISOString() as T[keyof T], FormidableEvent.Change);
    }
  }

  return (
    <>
      <div className="input__group col-8">
        <label htmlFor={key} className="input__label">
          {label}
        </label>
        <Field
          key={`${key}1`}
          {...props}
          name={key}
          type="date"
          value={date}
          min={minDate}
          max={maxDate}
          // eslint-disable-next-line react/jsx-no-bind -- TODO: memoize handlechange
          onChange={handleChange}
        />
      </div>
      <div className="input__group col-4">
        <Field
          key={`${key}2`}
          {...props}
          name={key}
          type="time"
          value={time}
          min={minTime}
          max={maxTime}
          // eslint-disable-next-line react/jsx-no-bind -- TODO: memoize handlechange
          onChange={handleChange}
        />
      </div>
    </>
  );
}

export default DateAndTimePicker;
/* eslint-enable react/jsx-props-no-spreading -- react no like but its unreasonable to pass each input prop by hand */
