# components

Components exposed by `formidable`.

## `<Formidable<T>>`

The main component that initialises the `FormidableProvider` and offers `FormidableContext` to be used in it's children either by using it directly, using `withFormidable` to wrap your components or `useFormidableContext` and other [hooks](./hooks.md). This component allows passing a type to allow type safety, it is not madatory though since we try to guess the shape of your form values by infering the type of `initialValues`.

### props

Since this library was developed with typescript you should have full type support. If you need further details look into our type definition file and play around with your ide's autcompletion.

#### `initialValues: T`

Initial values to be used for form fields and their values.

#### `initialFormState: FormidableState`

```typescript
export interface FormidableState {
  dirty?: boolean;
  submitted?: boolean;
  isSubmitting?: boolean;
  isValid?: boolean;
  errors?: ValidationError;
}
```

Initial values to be used for the forms state. `ValidationError` is the error returned by [yup](https://github.com/jquense/yup) when the validation returns errors.

#### `handleEvents: FormidableEventHandler<T>`

```typescript
export type FormidableEventHandler<T> = (
  event: FormidableEvent,
  formState?: FormidableState,
  formValues?: T,
) => void | Promise<void>;
```

Event handler that captures all events defined in [`events`](#events-formidableevents) and returns the `eventType: FormidableEvent<T>`, the current `formState: FormidableState` and `formValues: T`.

#### `events: FormidableEvents`

List of events you want to trigger `handleEvents` with.

```typescript
export enum FormidableEvent {
  All = 'all',
  Blur = 'blur',
  Submit = 'submit',
  Change = 'change',
  Reset = 'reset',
  Fix = 'fix',
}
```
