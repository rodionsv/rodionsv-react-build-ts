import React from 'react';

import ReactDOM from 'react-dom';
import { hot } from 'react-hot-ts';

import { App } from './App';
import { REACT_HOT_LOADER_ENABLE } from './constants/environment';

import { renderApp } from './index';

let container: HTMLDivElement | null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  if (container) document.body.removeChild(container);
  container = null;
});

jest.mock('react-dom', () => ({
  render: jest.fn(),
}));

describe('index.js', () => {
  it('should call renderApp function which will call render of a whole app', () => {
    renderApp();
    expect(ReactDOM.render).toHaveBeenCalledWith(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')
    );
  });
});

describe('index.js hot reload', () => {
  const OLD_ENV = process.env;
  const NOT_CALLED_FUNCTIONS_CALL_TIMES = 0;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  const hotModuleMock = jest.fn(reactApp => {
    hot(module)(reactApp);
  });

  const callHotModule = () => {
    if (process.env.REACT_HOT_LOADER === REACT_HOT_LOADER_ENABLE) {
      hotModuleMock(renderApp);
    }
  };

  it('should call not hot module for appRender function if hot module react hot loader is not true', () => {
    process.env.REACT_HOT_LOADER = 'not true';
    callHotModule();
    expect(hotModuleMock).toHaveBeenCalledTimes(NOT_CALLED_FUNCTIONS_CALL_TIMES);
  });

  it('should call hot module for appRender function if hot module react hot loader is true', () => {
    process.env.REACT_HOT_LOADER = 'true';
    callHotModule();
    expect(hotModuleMock).toHaveBeenCalledWith(renderApp);
  });
});
