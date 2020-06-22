import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useContext,
} from 'react';

import { ValidationError } from 'yup';

import { FormidableContext } from './formidable-context';

import {
  FormidableProps,
  FormidableValues,
  FormidableEvent,
  FormidableContextProps,
  UseValidator,
  ValidationMap,
  InteractionStateMap,
  UseField,
  UseForm,
} from './types';

function useValidationMap<Values extends FormidableValues>(
  initialValue: ValidationMap<Values> = {} as ValidationMap<Values>,
): UseValidator<Values> {
  const [errors, setErrors] = useState<ValidationMap<Values>>(initialValue);

  function transformGroupedErrors(errorMap?: ValidationError): ValidationMap<Values> {
    return errorMap
      ? errorMap?.inner?.reduce(
          (prev, error) => ({ ...prev, [error.path]: error }),
          {} as ValidationMap<Values>,
        )
      : ({} as ValidationMap<Values>);
  }

  function getError(name: keyof Values): ValidationError {
    return errors && errors[name];
  }

  function setError(name: string, newError?: ValidationError): void {
    if (newError) {
      if (name === 'all') {
        setErrors(transformGroupedErrors(newError));
      } else {
        setErrors({ ...errors, [name]: newError });
      }
    } else if (name === 'all') {
      setErrors(transformGroupedErrors(undefined));
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

function useFormidable<Values extends FormidableValues>({
  events = [FormidableEvent.All],
  handleEvent,
  initialValues,
  validationSchema,
  validateOn,
}: FormidableProps<Values>): FormidableContextProps<Values> {
  const [formValues, setFormValues] = useState<Values | undefined>(initialValues);
  const [formDirtyState, setFormDirtyState] = useState<InteractionStateMap<Values>>();
  const [formTouchedState, setFormTouchedState] = useState<InteractionStateMap<Values>>();
  const { errors, setError, getError } = useValidationMap<Values>();
  const formState = { dirty: formDirtyState, errors, touched: formTouchedState };

  function dispatchEvent(
    eventType: FormidableEvent,
    currentFormValues = formValues,
    currentFormState = formState,
  ): void {
    if (!handleEvent || !events) return;

    if (events[0] === FormidableEvent.All || events?.includes(eventType)) {
      handleEvent(currentFormValues, currentFormState, eventType);
    }
  }

  function validateForm(
    validationInput = formValues,
    formValidationSchema = validationSchema,
  ): void {
    if (!validationSchema || !formValidationSchema) return;
    try {
      formValidationSchema.validateSync(validationInput, {
        recursive: true,
        abortEarly: false,
      });
      setError('all', undefined);
    } catch (err) {
      setError('all', err);
    }
  }

  function validateField(
    key: keyof Values,
    currentFormValues = formValues,
    fieldValidationSchema = validationSchema,
  ): void {
    try {
      if (fieldValidationSchema) {
        fieldValidationSchema.validateSyncAt(key as string, currentFormValues);
      }
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

  function getFieldTouched(key: keyof Values): boolean {
    return !!(formTouchedState && formTouchedState[key]);
  }

  function getFormTouched(): boolean {
    return !!(formTouchedState && Object.keys(formTouchedState).length);
  }

  function getFieldDirty(key: keyof Values): boolean {
    return !!(formDirtyState && formDirtyState[key]);
  }

  function getFormDirty(): boolean {
    return !!(formDirtyState && Object.keys(formDirtyState).length);
  }

  function setField(
    key: keyof Values,
    value: Values[keyof Values] | string,
    eventType: FormidableEvent,
  ): void {
    const newFormValues = { ...formValues, [key]: value } as Values;
    setFormDirtyState({ ...formDirtyState, [key]: true });
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

  function handleFocus(e: React.FocusEvent<HTMLInputElement>): void {
    e.preventDefault();
    setFormTouchedState({ ...formTouchedState, [e.target.name]: true });
    dispatchValidator(FormidableEvent.Focus);
    dispatchEvent(FormidableEvent.Focus);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    setFormDirtyState({});
    dispatchValidator(FormidableEvent.Submit);
    dispatchEvent(FormidableEvent.Submit);
  }

  function handleReset(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    setFormValues(initialValues);
    setFormDirtyState({});
    setFormTouchedState({});
    dispatchValidator(FormidableEvent.Reset, initialValues);
    dispatchEvent(FormidableEvent.Reset, initialValues);
  }

  return {
    getField,
    setField,
    getFieldError,
    getFieldTouched,
    getFormTouched,
    getFieldDirty,
    getFormDirty,
    validateField,
    validateForm,
    handleChange,
    handleSubmit,
    handleFocus,
    handleBlur,
    handleReset,
    formValues,
    formState,
  };
}

export function useFormidableContext<T extends FormidableValues>(): FormidableContextProps<T> {
  const formidable = useContext(FormidableContext);
  return formidable as FormidableContextProps<T>;
}

export function useForm<T extends FormidableValues>(): UseForm<T> {
  const {
    formValues,
    formState,
    getFormTouched,
    getFormDirty,
    validateForm,
    handleSubmit,
    handleReset,
  } = useContext(FormidableContext) as FormidableContextProps<T>;

  return {
    formValues,
    formState,
    getFormTouched,
    getFormDirty,
    validateForm,
    handleSubmit,
    handleReset,
  };
}

export function useField<T extends FormidableValues>(name: keyof T): UseField<T> {
  const {
    formValues,
    setField,
    getFieldDirty,
    getFieldTouched,
    getFieldError,
    validateField,
  } = useContext(FormidableContext) as FormidableContextProps<T>;

  return {
    value: formValues && formValues[name],
    fieldState: {
      dirty: getFieldDirty(name),
      touched: getFieldTouched(name),
      errors: getFieldError(name),
    },
    setField,
    validateField,
  };
}

export function useFieldError<T extends FormidableValues>(
  name: keyof T,
): ValidationError | undefined {
  const { getFieldError } = useContext(FormidableContext) as FormidableContextProps<T>;

  return getFieldError(name);
}

export default useFormidable;
