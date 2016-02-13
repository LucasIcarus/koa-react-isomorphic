import 'babel-polyfill';
import './client/lib/index';

import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'app/client/components/main/app';
import routes from './routes';
import configureStore from './client/stores/index';

function render(store, appDOM) {
  ReactDOM.render(<App store={store} routes={routes} />, appDOM);
}

$(document).ready(() => {
  const appDOM = document.getElementById('app');
  const store = configureStore(window.__data);

  if (process.env.NODE_ENV === 'development' && !process.env.SERVER_RENDERING) {
    const { clientFetchData } = require('./client/helpers/fetch-data');

    clientFetchData(routes, store.getState().routing.location, store).then(() => {
      render(store, appDOM);
    });
  } else {
    render(store, appDOM);
  }
});
