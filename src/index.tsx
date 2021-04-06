import React from 'react';

import ReactDOM from 'react-dom';
import 'styles/main.css';
import { hot } from 'react-hot-ts';

import { App } from './App';
import { REACT_HOT_LOADER_ENABLE } from './constants/environment';

export const renderApp = (): void => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
};

renderApp();

if (process.env.REACT_HOT_LOADER === REACT_HOT_LOADER_ENABLE) {
  hot(module)(renderApp);
}
