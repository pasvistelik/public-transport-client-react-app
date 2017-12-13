import React, { Component } from 'react';
import './../styles/style1.css';
//import './../styles/bootstrap.min.css';
import 'react-bootstrap';
import ConfirmParamsBlock from "./ConfirmParamsBlock"; 
import ResultsAndCustomization from "./ResultsAndCustomization";


const AppStates = {
  confirmingParamsBlock: 0,
  viewingResults: 1,
  configureAppParams: 2
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        status: AppStates.confirmingParamsBlock,

        fromPositionStr: null, 
        toPositionStr: null, 
        myStartTimeStr: null, 
        my_dopTimeMinutes: null, 
        my_speed: null, 
        typesStr: null
    };
    this.handleConfirmed = this.handleConfirmed.bind(this);
    this.handleCanceled = this.handleCanceled.bind(this);
    this.openConfig = this.openConfig.bind(this);
  }
  handleConfirmed(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr) {
    this.setState({
      status: AppStates.viewingResults,
      fromPositionStr: fromPositionStr, 
      toPositionStr: toPositionStr, 
      myStartTimeStr: myStartTimeStr, 
      my_dopTimeMinutes: my_dopTimeMinutes, 
      my_speed: my_speed, 
      typesStr: typesStr
    });
  }
  handleCanceled() {
    this.setState({
      status: AppStates.confirmingParamsBlock
    });
  }
  openConfig(){
    this.setState({
      status: AppStates.configureAppParams
    });
  }
  render() {
    let element;
    if (this.state.status === AppStates.confirmingParamsBlock) {
      element = (
        <ConfirmParamsBlock onConfirmed={this.handleConfirmed}/>
      );
    }
    else if (this.state.status === AppStates.viewingResults) {
      element = (
        <ResultsAndCustomization 
          onCanceled={this.handleCanceled}
          fromPositionStr={this.state.fromPositionStr}
          toPositionStr={this.state.toPositionStr}
          myStartTimeStr={this.state.myStartTimeStr}
          my_dopTimeMinutes={this.state.my_dopTimeMinutes}
          my_speed={this.state.my_speed}
          typesStr={this.state.typesStr}
        />
      );
    }
    else if (this.state.status === AppStates.configureAppParams) {
      //<AppParamsBlock onConfirmed={this.handleConfirmed}/>
      element = (
        <div>
          ...
        </div>
      );
    }
    /*
    <div id="application">
      <p>
        <b>OptimalWay</b> - поиск наилучшего маршрута на общественном транспорте. 
      </p>
    </div>
    */
    return (
      <div className="App">

      

        
        <div id="content">
          <div id="my_elements">
            <div className="container">
              <div id="config-app-button" onClick={this.openConfig}><span className="glyphicon glyphicon-cog"></span></div>
              {element}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;