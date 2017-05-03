import React from 'react';
import ReactDOM from 'react-dom';
import App from './page_components/App';

//import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';

ReactDOM.render(
  <App />,
  document.getElementById('page')
);

//OfflinePluginRuntime.install();
if ('serviceWorker' in navigator) {
  //const registration = 
  runtime.register();
}
