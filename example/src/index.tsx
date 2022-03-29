import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

/* eslint-disable import/no-unresolved -- in the build pipeline this can not be resolved by eslint */
import '@eppendorf/css/dist/visionize/visionize.min.css';
/* eslint-enable import/no-unresolved -- in the build pipeline this can not be resolved by eslint */
import './app.scss';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
