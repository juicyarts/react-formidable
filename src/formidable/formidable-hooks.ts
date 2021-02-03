import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
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
  UseField,
  UseForm,
  FormidableState,
  InteractionStateMap,
} from './types';

function useValidationMap<Values extends FormidableValues>(): UseValidator<Values> {
  function transformGroupedErrors(errorMap?: ValidationError): ValidationMap<Values> {
    return errorMap
      ? errorMap?.inner?.reduce(
          (prev, error) => ({ ...prev, [error.path]: error }),
          {} as ValidationMap<Values>,
        )
      : ({} as ValidationMap<Values>);
  }

  function setError(
    name: string,
    newError: ValidationError,
    initialState: FormidableState<Values>,
  ): FormidableState<Values> {
    if (newError) {
      if (name === 'all') {
        return { ...initialState, errors: transformGroupedErrors(newError) };
      }
      return { ...initialState, errors: { ...initialState.errors, [name]: newError } };
    }

    if (name === 'all') {
      return { ...initialState, errors: transformGroupedErrors(undefined) };
    }

    return { ...initialState, errors: { ...initialState.errors, [name]: undefined } };
  }

  return {
    setError,
  };
}

function useFormidable<Values extends FormidableValues>({
  events = [FormidableEvent.All],
  handleEvent,
  initialValues,
  validationSchema,
  validateOn,
}: FormidableProps<Values>): FormidableContextProps<Values> {
  const [formState, setFormState] = useState<FormidableState<Values>>({
    values: initialValues || ({} as Values),
    errors: {} as ValidationMap<Values>,
    dirty: {} as InteractionStateMap<Values>,
    touched: {} as InteractionStateMap<Values>,
    submitted: false,
  });
  const { setError } = useValidationMap<Values>();

  function dispatchEvent(eventType: FormidableEvent, currentFormState = formState): void {
    if (!handleEvent || !events) return;

    if (events[0] === FormidableEvent.All || events?.includes(eventType) || currentFormState) {
      const { values, ...rest } = currentFormState;
      setFormState(currentFormState);
      handleEvent(values, rest, eventType);
    }
  }

  function validateForm(
    validationInput = formState.values,
    formValidationSchema = validationSchema,
    currentFormState = formState,
  ): FormidableState<Values> {
    if (!validationSchema || !formValidationSchema) return currentFormState;
    try {
      formValidationSchema.validateSync(validationInput, {
        recursive: true,
        abortEarly: false,
      });
      return setError('all', undefined, currentFormState);
    } catch (err) {
      return setError('all', err, currentFormState);
    }
  }

  function validateField(
    key: keyof Values,
    currentFormState = formState,
    fieldValidationSchema = validationSchema,
  ): FormidableState<Values> {
    try {
      if (fieldValidationSchema) {
        fieldValidationSchema.validateSyncAt(key as string, currentFormState.values);
      }
      return setError(key, undefined, currentFormState);
    } catch (err) {
      return setError(key, err, currentFormState);
    }
  }

  function dispatchValidator(
    key: keyof Values | undefined = undefined,
    eventType: FormidableEvent,
    currentFormState = formState,
  ): FormidableState<Values> {
    if (validateOn && (validateOn[0] === FormidableEvent.All || validateOn?.includes(eventType))) {
      if (key) {
        return validateField(key, currentFormState);
      }
      return validateForm(currentFormState.values, validationSchema, formState);
    }
    return currentFormState;
  }

  function getField(
    key: keyof Values,
    defaultValue?: Values[keyof Values],
  ): Values[keyof Values] | undefined {
    if (!formState || !formState.values || !key || defaultValue) return undefined;
    return formState.values[key] || defaultValue;
  }

  function getFieldError(key: keyof Values): ValidationError | undefined {
    if (!formState.errors) {
      return undefined;
    }
    return formState.errors[key];
  }

  function getFieldTouched(key: keyof Values): boolean {
    return !!(formState && formState.touched && formState.touched[key]);
  }

  function getFormTouched(): boolean {
    return !!(formState && formState.touched && Object.keys(formState.touched).length);
  }

  function getFieldDirty(key: keyof Values): boolean {
    return !!(formState && formState.dirty && formState.dirty[key]);
  }

  function getFormDirty(): boolean {
    return !!(formState && formState.dirty && Object.keys(formState.dirty).length);
  }

  function setField(
    key: keyof Values,
    value: Values[keyof Values] | string,
    eventType: FormidableEvent,
  ): void {
    const newFormState = {
      ...formState,
      values: { ...formState?.values, [key]: value },
      touched: {
        ...formState?.touched,
        [key]: true,
      },
      dirty: {
        ...formState?.dirty,
        [key]: true,
      },
    };

    dispatchEvent(eventType, dispatchValidator(key, eventType, newFormState));
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    e.preventDefault();
    setField(e.target.name, e.target.value, FormidableEvent.Change);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>): void {
    e.preventDefault();
    dispatchEvent(FormidableEvent.Blur, dispatchValidator(e.target.name, FormidableEvent.Blur));
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>): void {
    e.preventDefault();
    const newFormState = {
      ...formState,
      touched: {
        ...formState.touched,
        [e.target.name]: true,
      },
    };

    dispatchEvent(
      FormidableEvent.Focus,
      dispatchValidator(e.target.name, FormidableEvent.Focus, newFormState),
    );
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const newFormidableState = { ...formState, submitted: true };
    dispatchEvent(
      FormidableEvent.Submit,
      dispatchValidator(undefined, FormidableEvent.Submit, newFormidableState),
    );
  }

  function handleReset(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const newFormState: FormidableState<Values> = {
      values: initialValues || ({} as Values),
      errors: {} as ValidationMap<Values>,
      dirty: {} as InteractionStateMap<Values>,
      touched: {} as InteractionStateMap<Values>,
      submitted: false,
    };
    dispatchEvent(
      FormidableEvent.Reset,
      dispatchValidator(undefined, FormidableEvent.Reset, newFormState),
    );
  }

  useEffect(() => {
    setFormState({ ...formState, values: initialValues || ({} as Values) });
  }, [initialValues]);

  return {
    getField,
    setField,
    getFieldError,
    getFieldTouched,
    getFormTouched,
    getFieldDirty,
    getFormDirty,
    // validateField,
    // validateForm,
    handleChange,
    handleSubmit,
    handleFocus,
    handleBlur,
    handleReset,
    formValues: formState.values,
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
    // validateForm,
    handleSubmit,
    handleReset,
  } = useContext(FormidableContext) as FormidableContextProps<T>;

  return {
    formValues,
    formState,
    getFormTouched,
    getFormDirty,
    // validateForm,
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
    // validateField,
  } = useContext(FormidableContext) as FormidableContextProps<T>;

  return {
    value: formValues && formValues[name],
    fieldState: {
      dirty: getFieldDirty(name),
      touched: getFieldTouched(name),
      errors: getFieldError(name),
    },
    setField,
    // validateField,
  };
}

export function useFieldError<T extends FormidableValues>(
  name: keyof T,
): ValidationError | undefined {
  const { getFieldError } = useContext(FormidableContext) as FormidableContextProps<T>;

  return getFieldError(name);
}

export default useFormidable;
