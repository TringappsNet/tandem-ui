import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from '../src/Component/Redux/store/index';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const disableConsole = (): void => {
  if (process.env.NODE_ENV === 'production') {
    console.log = (): void => {};
    console.warn = (): void => {};
    console.error = (): void => {};
    console.info = (): void => {};
    console.debug = (): void => {};
  }
};

disableConsole();


root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
