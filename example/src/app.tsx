import React, { FunctionComponentElement } from 'react';

import AsyncForm from './async-initial-values';
import NativeForm from './native-elements';
import OnBoardForm from './onboard-components';

function App(): FunctionComponentElement<unknown> {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="p-s">
            <h1>Formidable Testing & Examples</h1>
            <p>
              This Example application uses @eppendorf/css/visionize for its
              styling
            </p>
          </div>
        </div>
      </div>
      <OnBoardForm />
      <NativeForm />
      <AsyncForm />
    </div>
  );
}

export default App;
