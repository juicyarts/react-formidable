import {
  object as yupObject,
  number as yupNumber,
  string as yupString,
  ObjectSchema,
} from 'yup';

export type ExtendedSchema<T extends Record<string, unknown>> = ObjectSchema<T>;

export type MockFormType = {
  firstName: string;
  age: number;
};

export const mockFormData: MockFormType = {
  firstName: 'max',
  age: 1,
};

export const NameRegex = /^[a-zA-Z0-9 :./_/-]*$/;

export const mockFormSchema = yupObject().shape({
  firstName: yupString().required().max(10).matches(NameRegex),
  age: yupNumber().required().positive().min(12).max(22),
});
