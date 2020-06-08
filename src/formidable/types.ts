import { ReactNode, ChangeEvent, FormEvent } from 'react';
import { ObjectSchema, ValidationError } from 'yup';

export interface HasClassName {
  className?: string;
}

export interface FormidableValues {
  [key: string]: unknown;
}

export enum FormidableEvent {
  All = 'all',
  Blur = 'blur',
  Submit = 'submit',
  Change = 'change',
  Reset = 'reset',
  Fix = 'fix',
}

export interface FormidableState<T> {
  dirty?: boolean;
  submitted?: boolean;
  isSubmitting?: boolean;
  isValid?: boolean;
  errors?: ValidationMap<T>;
}

export type FormidableEventHandler<T> = (
  event: FormidableEvent,
  formState?: FormidableState<T>,
  formValues?: T,
) => void | Promise<void>;

export interface FormidableProps<T extends FormidableValues> {
  initialValues?: T;
  initialFormState?: FormidableState<T>;
  handleEvent?: FormidableEventHandler<T>;
  events?: FormidableEvent[];
  validationSchema?: ObjectSchema<T | undefined>;
  validateOn?: FormidableEvent[];
}

export interface FormidableComponentProps<T extends FormidableValues>
  extends FormidableProps<T>,
    HasClassName {
  children: ((props: FormidableContextProps<T>) => ReactNode) | ReactNode;
}

export type GetField<T> = (key: keyof T, defaultValue?: T[keyof T]) => T[keyof T] | undefined;
export type SetField<T> = (key: keyof T, value: T[keyof T], eventType: FormidableEvent) => void;
export type GetFieldError<T> = (key: keyof T) => ValidationError | undefined;

export type ValidateForm<T extends Record<string, unknown>> = (
  validationInput?: T,
  formState?: FormidableState<T>,
  validationSchema?: ObjectSchema<T> | undefined,
) => FormidableState<T>;

export type ValidateField<T extends Record<string, unknown>> = (
  key: keyof T,
  formValues?: T,
  validationSchema?: ObjectSchema<T>,
) => void;

export type ValidationMap<T> = Record<keyof T, ValidationError>;
export interface UseValidator<T> {
  errors: ValidationMap<T>;
  getError(name: keyof T): ValidationError;
  setError(name: keyof T, error?: ValidationError): void;
}

export interface FormidableContextProps<T extends FormidableValues> {
  formValues?: T;
  formState?: FormidableState<T>;
  getField: GetField<T>;
  setField: SetField<T>;
  getFieldError: GetFieldError<T>;
  validateForm: ValidateForm<T>;
  validateField: ValidateField<T>;
  handleChange(e: ChangeEvent<HTMLInputElement>): void;
  handleBlur(e: React.FocusEvent<HTMLInputElement>): void;
  handleSubmit(e: FormEvent<HTMLFormElement>): void;
  handleReset(e: FormEvent<HTMLFormElement>): void;
}
