import { ReactWrapper, mount } from 'enzyme';
import React from 'react';

import Formidable from '../../src';
import DateAndTimePicker from '../../src/formidable/components/date-and-time-picker';
import { DateTimeFormat, formatDateTimeString } from '../../src/utils/time/time.helper';

interface FormValues {
  startDateTime: string;
}

describe('dateAndTimePicker', () => {
  let wrapper: ReactWrapper;
  const inputStartDateTime = new Date();
  const inputStartDateTimeIso = new Date().toISOString();
  const formValues: FormValues = {
    startDateTime: inputStartDateTimeIso,
  };

  const fixtureData = {
    name: 'startDateTime' as keyof FormValues,
    label: 'Asd',
  };

  describe('default render', () => {
    beforeAll(() => {
      wrapper = mount(
        <Formidable<Partial<FormValues>> initialValues={formValues}>
          <DateAndTimePicker<Partial<FormValues>> {...fixtureData} />
        </Formidable>,
      );
    });
    it('should show formatted string in date input', () => {
      expect(wrapper.find('input[type="date"]').props().value).toEqual(
        formatDateTimeString(inputStartDateTimeIso, DateTimeFormat.YYYMMDD),
      );
    });

    it('should show formatted string in time input', () => {
      expect(wrapper.find('input[type="time"]').props().value).toEqual(
        formatDateTimeString(inputStartDateTimeIso, DateTimeFormat.HHMM),
      );
    });
  });

  describe('disabled', () => {
    beforeAll(() => {
      wrapper = mount(
        <Formidable<Partial<FormValues>> initialValues={formValues}>
          <DateAndTimePicker<Partial<FormValues>> {...fixtureData} disabled />
        </Formidable>,
      );
    });
    it('should disable all inputs', () => {
      expect(wrapper.find('input[type="date"]').props().disabled).toBeTruthy();
      expect(wrapper.find('input[type="time"]').props().disabled).toBeTruthy();
    });
  });

  describe('min/max', () => {
    const AN_HOUR = 60 * 1000 * 60;
    const A_DAY = AN_HOUR * 24;
    const min = new Date(inputStartDateTime.getTime() - 3 * A_DAY).toISOString();
    const max = new Date(inputStartDateTime.getTime() + 3 * A_DAY).toISOString();

    beforeAll(() => {
      wrapper = mount(
        <Formidable<Partial<FormValues>> initialValues={formValues}>
          <DateAndTimePicker<Partial<FormValues>> {...fixtureData} disabled min={min} max={max} />
        </Formidable>,
      );
    });
    // we don't test more than the existence of the props since this is browser heaviour
    it('should pass min max properly', () => {
      expect(wrapper.find('input[type="date"]').props()).toEqual(
        expect.objectContaining({
          min: formatDateTimeString(min, DateTimeFormat.YYYMMDD),
          max: formatDateTimeString(max, DateTimeFormat.YYYMMDD),
        }),
      );

      expect(wrapper.find('input[type="time"]').props()).toEqual(
        expect.objectContaining({
          min: formatDateTimeString(min, DateTimeFormat.HHMM),
          max: formatDateTimeString(max, DateTimeFormat.HHMM),
        }),
      );
    });
  });

  describe('setField', () => {
    let formChangeSpy: jest.Mock;

    beforeEach(() => {
      formChangeSpy = jest.fn();
      wrapper = mount(
        <Formidable<Partial<FormValues>> initialValues={formValues} handleEvent={formChangeSpy}>
          <DateAndTimePicker<Partial<FormValues>> {...fixtureData} />
        </Formidable>,
      );
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should transform values back to iso string when date changes', () => {
      expect(wrapper.find('input[type="date"]').props().value).not.toEqual('2025-12-06');
      wrapper.find('input[type="date"]').simulate('change', {
        // NOTE: Simulate interfacae is a SyntheticEvent which does not contain `name` and `type`, thus
        // we need to pass it here to to make sure our condition that checks the event target type works
        target: { value: '2025-12-06', type: 'date' },
      });
      const result = formChangeSpy.mock.calls[0][0].startDateTime;
      expect(new Date(result).getDate()).toEqual(6);
      expect(new Date(result).getMonth()).toEqual(11); // odd js is odd..
      expect(new Date(result).getFullYear()).toEqual(2025);
    });

    it('should transform values back to iso string when time changes', () => {
      const field = wrapper.find('input[type="time"]');
      expect(field.props().value).not.toEqual('12:55');
      wrapper
        .find('input[type="time"]')
        // NOTE: Simulate interfacae is a SyntheticEvent which does not contain `name` and `type`, thus
        // we need to pass it here to to make sure our condition that checks the event target type works
        .simulate('change', { target: { value: '12:55', type: 'time' } });

      const result = formChangeSpy.mock.calls[0][0].startDateTime;
      expect(new Date(result).getHours()).toEqual(12);
      expect(new Date(result).getMinutes()).toEqual(55);
    });
  });
});
