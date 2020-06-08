import React, { useState, ChangeEvent, FormEvent, useContext } from 'react';
import { ValidationError } from 'yup';

import { FormidableContext } from './formidable-context';

import {
  FormidableState,
  FormidableProps,
  FormidableValues,
  FormidableEvent,
  FormidableContextProps,
  UseValidator,
  ValidationMap,
} from './types';

function useValidationMap<Values extends FormidableValues>(
  initialValue: ValidationMap<Values> = {} as ValidationMap<Values>,
): UseValidator<Values> {
  const [errors, setErrors] = useState<ValidationMap<Values>>(initialValue);

  function mergeErrors(errorMap?: ValidationError): ValidationMap<Values> {
    return errorMap
      ? errorMap?.inner?.reduce((prev, error) => ({ ...prev, [error.path]: error }), errors)
      : ({} as ValidationMap<Values>);
  }

  function getError(name: keyof Values): ValidationError {
    return errors && errors[name];
  }

  function setError(name: string, newError?: ValidationError): void {
    if (newError) {
      if (name === 'all') {
        setErrors(mergeErrors(newError));
      } else {
        setErrors({ ...errors, [name]: newError });
      }
    } else if (name === 'all') {
      setErrors(mergeErrors(undefined));
    } else {
      setErrors({ ...errors, [name]: undefined });
    }
  }

  return {
    errors,
    setError,
    getError,
  };
}

export function useFormidable<Values extends FormidableValues>({
  events = [FormidableEvent.All],
  handleEvent,
  initialValues,
  initialFormState,
  validationSchema,
  validateOn,
}: FormidableProps<Values>): FormidableContextProps<Values> {
  const [formValues, setFormValues] = useState<Values | undefined>(initialValues);
  const [formState] = useState<FormidableState<Values> | undefined>(initialFormState);
  const { errors, setError, getError } = useValidationMap<Values>();

  function dispatchEvent(
    eventType: FormidableEvent,
    currentFormValues = formValues,
    currentFormState = formState,
  ): void {
    if (!handleEvent || !events) return;

    if (events[0] === FormidableEvent.All || events?.includes(eventType)) {
      handleEvent(eventType, { ...currentFormState, errors }, currentFormValues);
    }
  }

  function validateForm(
    validationInput = formValues,
    currentFormState = formState,
    formValidationSchema = validationSchema,
  ): FormidableState<Values> {
    if (!validationSchema) return {};
    try {
      const isValid = formValidationSchema?.validateSync(validationInput, {
        recursive: true,
        abortEarly: false,
      });
      setError('all', undefined);
      return {
        ...currentFormState,
        isValid: !!isValid,
      };
    } catch (err) {
      setError('all', err);
      return {
        ...currentFormState,
        isValid: false,
      };
    }
  }

  function validateField(
    key: keyof Values,
    currentFormValues = formValues,
    fieldValidationSchema = validationSchema,
  ): void {
    try {
      const isValid = fieldValidationSchema?.validateSyncAt(key as string, currentFormValues);
      console.debug(isValid);
      setError(key, undefined);
    } catch (err) {
      setError(key, err);
    }
  }

  function dispatchValidator(
    eventType: FormidableEvent,
    currentFormValues = formValues,
    key?: keyof Values,
  ): void {
    if (validateOn && (validateOn[0] === FormidableEvent.All || validateOn?.includes(eventType))) {
      if (key) {
        validateField(key, currentFormValues);
      } else {
        validateForm(currentFormValues);
      }
    }
  }

  function getField(
    key: keyof Values,
    defaultValue?: Values[keyof Values],
  ): Values[keyof Values] | undefined {
    if (!formValues || !key || defaultValue) return undefined;
    return formValues[key] || defaultValue;
  }

  function getFieldError(key: keyof Values): ValidationError | undefined {
    if (!errors) {
      return undefined;
    }
    return getError(key);
  }

  function setField(
    key: keyof Values,
    value: Values[keyof Values] | string,
    eventType: FormidableEvent,
  ): void {
    const newFormValues = { ...formValues, [key]: value } as Values;
    setFormValues(newFormValues);
    dispatchValidator(eventType, newFormValues, key);
    dispatchEvent(eventType, newFormValues);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    e.preventDefault();
    setField(e.target.name, e.target.value, FormidableEvent.Change);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>): void {
    e.preventDefault();
    dispatchValidator(FormidableEvent.Blur);
    dispatchEvent(FormidableEvent.Blur);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    dispatchValidator(FormidableEvent.Submit);
    dispatchEvent(FormidableEvent.Submit);
  }

  function handleReset(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    setFormValues(initialValues);
    dispatchValidator(FormidableEvent.Reset, initialValues);
    dispatchEvent(FormidableEvent.Reset, initialValues);
  }

  return {
    getField,
    setField,
    getFieldError,
    validateField,
    validateForm,
    handleChange,
    handleSubmit,
    handleBlur,
    handleReset,
    formValues,
    formState: {
      ...formState,
      errors,
    },
  };
}

export function useFormidableContext<T extends FormidableValues>(): FormidableContextProps<T> {
  const formidable = useContext(FormidableContext);
  return (formidable as unknown) as FormidableContextProps<T>;
}

export function useField<T extends FormidableValues>(
  name: keyof T,
): [
  T[keyof T] | undefined,
  FormidableContextProps<T>['handleChange'],
  FormidableContextProps<T>['handleBlur'],
] {
  const { formValues, handleChange, handleBlur } = useContext(
    FormidableContext,
  ) as FormidableContextProps<T>;

  return [formValues && formValues[name], handleChange, handleBlur];
}

export function useFieldError<T extends FormidableValues>(
  name: keyof T,
): ValidationError | undefined {
  const { getFieldError } = useContext(FormidableContext) as FormidableContextProps<T>;

  return getFieldError(name);
}

export default useFormidableContext;
