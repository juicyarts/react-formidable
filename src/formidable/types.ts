import { ReactNode, ChangeEvent, FormEvent } from 'react';
import { ObjectSchema, ValidationError } from 'yup';

export type ExtractValues<V> = V extends FormidableState<infer T> ? T : never;

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
  Focus = 'focus',
  Reset = 'reset',
  Fix = 'fix',
}

export type GetField<T> = (key: keyof T, defaultValue?: T[keyof T]) => T[keyof T] | undefined;
export type GetFieldInteraction<T> = (key: keyof T) => boolean;
export type GetFormInteraction = () => boolean;
export type GetFieldError<T> = (key: keyof T) => ValidationError | undefined;
export type SetField<T> = (key: keyof T, value: T[keyof T], eventType: FormidableEvent) => void;
export type HandleChange = (e: ChangeEvent<HTMLInputElement>) => void;
export type HandleBlur = (e: React.FocusEvent<HTMLInputElement>) => void;
export type HandleFocus = (e: React.FocusEvent<HTMLInputElement>) => void;
export type HandleSubmit = (e: FormEvent<HTMLFormElement>) => void;
export type HandleReset = (e: FormEvent<HTMLFormElement>) => void;
export type ValidationMap<T> =
  | Record<keyof T, ValidationError | undefined>
export type InteractionStateMap<T> =
  | Record<keyof T, boolean | undefined>;

export interface FormidableState<T> {
  values: T;
  dirty: InteractionStateMap<T>;
  touched: InteractionStateMap<T>;
  submitted: boolean;
  errors: ValidationMap<T>;
}

export type FormidableEventHandler<T> = (
  formValues?: T,
  formState?: Omit<FormidableState<T>, 'values'>,
  event?: FormidableEvent,
) => void | Promise<void>;

export interface FormidableProps<T extends FormidableValues> {
  initialValues: T;
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

export type ValidateForm<T extends Record<string, unknown>> = (
  validationInput?: T,
  validationSchema?: ObjectSchema<T> | undefined,
) => void;

export type ValidateField<T extends Record<string, unknown>> = (
  key: keyof T,
  formValues?: T,
  validationSchema?: ObjectSchema<T>,
) => void;

export interface UseValidator<T> {
  setError(
    name: keyof T,
    error?: ValidationError,
    currentFormState?: FormidableState<T>,
  ): FormidableState<T>;
}

export interface UseField<T extends FormidableValues> {
  value?: T[keyof T];
  fieldState: {
    dirty: boolean;
    touched: boolean;
    errors?: ValidationError;
  };
  setField: SetField<T>;
  // validateField: ValidateField<T>;
}

export interface UseForm<T extends FormidableValues> {
  formValues?: T;
  formState?: FormidableState<T>;
  getFormTouched: GetFormInteraction;
  getFormDirty: GetFormInteraction;
  // validateForm: ValidateForm<T>;
  handleSubmit: HandleSubmit;
  handleReset: HandleReset;
}

export interface FormidableContextProps<T extends FormidableValues> extends UseForm<T> {
  getField: GetField<T>;
  setField: SetField<T>;
  getFieldError: GetFieldError<T>;
  getFieldTouched: GetFieldInteraction<T>;
  getFieldDirty: GetFieldInteraction<T>;
  getFormDirty: GetFormInteraction;
  // validateField: ValidateField<T>;
  handleChange: HandleChange;
  handleBlur: HandleBlur;
  handleFocus: HandleFocus;
}
