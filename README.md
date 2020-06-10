<center><img width="60%" src="./docs/formidable.svg">
  <br>
  <img src="https://vignette.wikia.nocookie.net/meme/images/1/15/Wine.gif/revision/latest/scale-to-width-down/340?cb=20171029023215"></center>

<br>

`formidable` is a library that abstracts away form related logic to let you focus on the important parts of your application. This library was built in conjunction with an application of ours which needed advanced form handling. We have a strong focus on building our own libraries to keep external dependencies and license issues related to them as low as possible since we need to be auditdable in regards to medical & laboratory guidelines.

`formidable` uses [yup](https://github.com/jquense/yup) to allow validation of fields. This is the only external depency we have here since yup does a great job and is commonly used in our applications.

After building and maintainig this for nearly a year and starting to outsource this into it's own library i observed that i unintentionally (partly) rebuilt [formik](https://jaredpalmer.com/formik/). However given the things mentioned, the fact that we already built it and some additional functionality we have it should be fine for us to keep developing our own library.

I'm going to use this library as a precedent for eppendorfs contribution to open source by publishing our internal libraries. We'll see how that goes...

# installation

```shell
$ yarn add @eppendorf/react-formidable
```

# simple usage example with typescript

```tsx
import Formidable, {
  Form,
  Field,
  FormidableEvent,
  FormidableState,
} from '@eppendorf/react-formidable'

// define an interface/type for your formValues to allow strongly typed forms
interface FormValues {
  name: string;
}

const formValues: FormValues = {
  name: 'Bob';
};

function SomeComponent(): FunctionComponentElement<unknown> {
  function onFormEvent(formEvent: FormidableEvent, formState?: FormidableState, values?: FormValues): void {
    console.debug('FormEvent:', formEvent, formState, values);
  }

  return (
    <Formidable<FormValues>
      initialValues={formValues}
      events={[FormidableEvent.All]}
      handleEvent={onFormEvent}
    >
      <Form>
        <Field<FormValues> type="text" name="name" />
      </Form>
    </Formidable>
  )
}
```

View [examples](./docs/examples.md), [components](./docs/components.md) or [hooks](./docs/hooks) for more details.

# development

This project is built using [rollup](https://rollupjs.org/) since rollup is a little more handy for library development. The example project at `./example` uses [snowpack](https://www.snowpack.dev/) which is a pretty fast development server builder/runner which is better suited for a demo application than our whole react-scripts-ts setup. Snowpack doesn't bundle the sources in development mode which makes it pretty efficient and fast when using hot module replacement.

The idea is that you can build and test your library using rollup and run a demo application with snowpack. In `./example/src/app.tsx` you can decide which version to point to (built/src) to allow switching between development and build modes

## install

```bash
# install library dependencies
$ yarn install

# install example application dependencies
$ cd example && yarn install
```

## start

Make sure you run yarn install in the `./example` folder before doing this.

```bash
# starts snowpack example appication
$ yarn start
```

Runs the app in the development mode. Open <http://localhost:8080> to view it in the browser.

Changes you make to the files in `./example/src` or `./src` folder will refresh the corresponding file in the browser.

## build

We use [rollup](https://rollupjs.org/) and [babel](https://babeljs.io/) to generate builds for different targets. See `./rollup.config.js`.

```bash
# builds your library at ./dist
$ yarn build
```

You can change the import in `./example/src/app.tsx` to point to the built version of the lib.

## test

We use jest with enzyme for testing, the config is placed in the `./package.json`

```bash
# run yarn in watch mode
$ yarn test
# run yarn in ci mode
$ yarn test:ci
```
