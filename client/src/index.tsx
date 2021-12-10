import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './app/App';
import './index.css';
import store from './app/state/store';
import { loadAndDispatchInitialData } from './app/state/initial-data';
import { fetchUsers } from './features/users/users-slice';

// Load combined initial data via single fetch here unless an optional query param is present.
// Else data will be loaded as in the original "redux-essentials" tutorial: users are loaded
// here and posts are loaded as an effect of the PostsList component's rendering.
const urlParams = new URLSearchParams(window.location.search);
const loadCombinedInitialData = !urlParams.has('orig-loading');

if (loadCombinedInitialData)
  loadAndDispatchInitialData(); // single fetch of all app data
else
  store.dispatch(fetchUsers()); // vs. as in original tutorial

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
