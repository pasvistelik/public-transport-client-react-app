import React from 'react';
import ReactDOM from 'react-dom';
import App from './page_components/App';
//import './index.css';

import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install();
/*import runtime from 'serviceworker-webpack-plugin/lib/runtime';
if ('serviceWorker' in navigator) {
  const registration = runtime.register();
}*/

ReactDOM.render(
  <App />,
  document.getElementById('page')
);
