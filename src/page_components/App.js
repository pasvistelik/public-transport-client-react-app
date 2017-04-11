import React, { Component } from 'react';
import './../styles/style.css';

//import './scripts/jquery/jquery-3.2.0.min';
//import AppClientVisualization from './modules/client/client_visualization.js';
//import $ from 'jquery';
//import AppClient from './modules/client/client';

import MyApp from "./MyApp";
import ResultsAndCustomization from "./ResultsAndCustomization";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div id="application">
          <p>
            <b>PublicTransportProject</b> - поиск наилучшего маршрута на общественном транспорте. {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div id="content">
          <div id="my_elements">
            <MyApp/>
            <ResultsAndCustomization/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;