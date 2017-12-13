import React, { Component } from 'react';
import AppClient from 'public-transport-client';
import Results from './Results';
import Customization from './Customization';

const ResultStatus = {
  pending: 0,
  success: 1,
  error: -1
};

const PercentValueChanged = {
  totalTime: 0,
  goingTime: 1,
  transportChangingCount: 2,
  waitingTime: 3,
  risk: 4
};

class ResultsAndCustomization extends Component{
  constructor(props) {
    super(props);
    this.state = {
      status: ResultStatus.pending,
      totalTimePercentValue: AppClient.totalTimePercentValue,
      totalGoingTimePercentValue: AppClient.totalGoingTimePercentValue,
      totalTransportChangingCountPercentValue: AppClient.totalTransportChangingCountPercentValue,
      totalWaitingTimePercentValue: AppClient.totalWaitingTimePercentValue,
      riskPercentValue: AppClient.riskPercentValue,
      findedOptimalWays: []
    };
    this.handleTotalTimePercentValueChange = this.handleTotalTimePercentValueChange.bind(this);
    this.handleTotalGoingTimePercentValueChange = this.handleTotalGoingTimePercentValueChange.bind(this);
    this.handleTotalTransportChangingCountPercentValueChange = this.handleTotalTransportChangingCountPercentValueChange.bind(this);
    this.handleTotalWaitingTimePercentValueChange = this.handleTotalWaitingTimePercentValueChange.bind(this);
    this.handleRiskPercentValueChange = this.handleRiskPercentValueChange.bind(this);
    this.customizeFindedOptimalWays = this.customizeFindedOptimalWays.bind(this);
    this.countWays = this.countWays.bind(this);

    this.countWays();
  }
  async countWays() {
    const fromPositionStr = this.props.fromPositionStr;
    const toPositionStr = this.props.toPositionStr;
    const myStartTimeStr = this.props.myStartTimeStr;
    const my_dopTimeMinutes = this.props.my_dopTimeMinutes;
    const my_speed = this.props.my_speed;
    const typesStr = this.props.typesStr;
    const paramsStr = "from=" + fromPositionStr + "&to=" + toPositionStr + "&startTime=" + myStartTimeStr + "&dopTimeMinutes=" + my_dopTimeMinutes + "&goingSpeed=" + my_speed + "&transportTypes=" + typesStr;
    console.log("Start finding oprimal routes. Params: " + paramsStr);

    const resultWays = await AppClient.findWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr);
    if (resultWays != null) {
      const totalTimePercentValue = this.state.totalTimePercentValue;
      const totalGoingTimePercentValue = this.state.totalGoingTimePercentValue;
      const totalTransportChangingCountPercentValue = this.state.totalTransportChangingCountPercentValue;
      const totalWaitingTimePercentValue = this.state.totalWaitingTimePercentValue;
      const riskPercentValue = this.state.riskPercentValue;
      AppClient.customizeFindedOptimalWaysStart(totalTimePercentValue, totalGoingTimePercentValue, totalTransportChangingCountPercentValue, totalWaitingTimePercentValue, riskPercentValue);

      this.setState({
        status: ResultStatus.success,
        //findedOptimalWays: resultWays,
        findedOptimalWays: AppClient.findedOptimalWays
      });
      //this.customizeFindedOptimalWays();//
    }
    else {
      this.setState({
        status: ResultStatus.error
      });
    }
  }
  handleTotalTimePercentValueChange(value) {
    this.setState({
      totalTimePercentValue: value
    });
    this.customizeFindedOptimalWays(PercentValueChanged.totalTime, value);
  }
  handleTotalGoingTimePercentValueChange(value) {
    this.setState({
      totalGoingTimePercentValue: value
    });
    this.customizeFindedOptimalWays(PercentValueChanged.goingTime, value);
  }
  handleTotalTransportChangingCountPercentValueChange(value) {
    this.setState({
      totalTransportChangingCountPercentValue: value
    });
    this.customizeFindedOptimalWays(PercentValueChanged.transportChangingCount, value);
  }
  handleTotalWaitingTimePercentValueChange(value) {
    this.setState({
      totalWaitingTimePercentValue: value
    });
    this.customizeFindedOptimalWays(PercentValueChanged.waitingTime, value);
  }
  handleRiskPercentValueChange(value) {
    this.setState({
      riskPercentValue: value
    });
    this.customizeFindedOptimalWays(PercentValueChanged.risk, value);
  }
  customizeFindedOptimalWays(type, value) {
      let totalTimePercentValue = this.state.totalTimePercentValue;
      let totalGoingTimePercentValue = this.state.totalGoingTimePercentValue;
      let totalTransportChangingCountPercentValue = this.state.totalTransportChangingCountPercentValue;
      let totalWaitingTimePercentValue = this.state.totalWaitingTimePercentValue;
      let riskPercentValue = this.state.riskPercentValue;
      switch(type) {
        case PercentValueChanged.totalTime: {totalTimePercentValue = value; break;}
        case PercentValueChanged.goingTime: {totalGoingTimePercentValue = value; break;}
        case PercentValueChanged.transportChangingCount: {totalTransportChangingCountPercentValue = value; break;}
        case PercentValueChanged.waitingTime: {totalWaitingTimePercentValue = value; break;}
        case PercentValueChanged.risk: {riskPercentValue = value; break;}
        default: break;
      }
      AppClient.customizeFindedOptimalWaysStart(totalTimePercentValue, totalGoingTimePercentValue, totalTransportChangingCountPercentValue, totalWaitingTimePercentValue, riskPercentValue);
      
      this.setState({
        findedOptimalWays: AppClient.findedOptimalWays
      });
  }

  //customizeFindedOptimalWays();


  render() {
    switch(this.state.status){
      case ResultStatus.pending: return(
        <div id="waiting_route">
          <p>Идет поиск маршрута. Подождите немного...</p>
        </div>
      );
      case ResultStatus.success: return(
        <div>
          <p><form action="#"><input className="block_elem" type="button" className="btn btn-default btn-block" value="Назад" onClick={this.props.onCanceled}/></form></p>
          <Customization 
            onTotalTimePercentValueChange={this.handleTotalTimePercentValueChange} 
            onTotalGoingTimePercentValueChange={this.handleTotalGoingTimePercentValueChange} 
            onTotalTransportChangingCountPercentValueChange={this.handleTotalTransportChangingCountPercentValueChange} 
            onTotalWaitingTimePercentValueChange={this.handleTotalWaitingTimePercentValueChange} 
            onRiskPercentValueChange={this.handleRiskPercentValueChange} 
            totalTimePercentValue={this.state.totalTimePercentValue}
            totalGoingTimePercentValue={this.state.totalGoingTimePercentValue}
            totalTransportChangingCountPercentValue={this.state.totalTransportChangingCountPercentValue}
            totalWaitingTimePercentValue={this.state.totalWaitingTimePercentValue}
            riskPercentValue={this.state.riskPercentValue}
          />
          <Results findedOptimalWays={this.state.findedOptimalWays} />
        </div>
      );
      case ResultStatus.error: return(
        <div>
          <form action="#"><input className="block_elem" type="button" value="Назад" onClick={this.props.onCanceled}/></form>
          Error...
        </div>
      );
      default: return;
    }
  }
}

export default ResultsAndCustomization;