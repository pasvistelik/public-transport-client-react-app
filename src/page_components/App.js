import React, { Component } from 'react';
import './../styles/style.css';
import ConfirmParamsBlock from "./ConfirmParamsBlock"; 
import ResultsAndCustomization from "./ResultsAndCustomization";

const AppStates = {
  confirmingParamsBlock: 0,
  viewingResults: 1
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
    return (
      <div className="App">
        <div id="application">
          <p>
            <b>PublicTransportProject</b> - поиск наилучшего маршрута на общественном транспорте. {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div id="content">
          <div id="my_elements">
            {element}
          </div>
        </div>
      </div>
    );
  }
}

export default App;