import React, { Component } from 'react';
import AppClient from 'public-transport-client';
import Results from './Results';
import Customization from './Customization';

const ResultStatus = {
  pending: 0,
  success: 1,
  error: -1
};

class ResultsAndCustomization extends Component{
  constructor(props) {
    super(props);
    this.state = {
      status: ResultStatus.pending,
      totalTimePercentValue: 1,
      totalGoingTimePercentValue: 0.5,
      totalTransportChangingCountPercentValue:0.05,
      findedOptimalWays: []
    };
    this.handleTotalTimePercentValueChange = this.handleTotalTimePercentValueChange.bind(this);
    this.handleTotalGoingTimePercentValueChange = this.handleTotalGoingTimePercentValueChange.bind(this);
    this.handleTotalTransportChangingCountPercentValueChange = this.handleTotalTransportChangingCountPercentValueChange.bind(this);
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
      AppClient.customizeFindedOptimalWaysStart(totalTimePercentValue, totalGoingTimePercentValue, totalTransportChangingCountPercentValue);

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
    this.customizeFindedOptimalWays();
  }
  handleTotalGoingTimePercentValueChange(value) {
    this.setState({
      totalGoingTimePercentValue: value
    });
    this.customizeFindedOptimalWays();
  }
  handleTotalTransportChangingCountPercentValueChange(value) {
    this.setState({
      totalTransportChangingCountPercentValue: value
    });
    this.customizeFindedOptimalWays();
  }
  customizeFindedOptimalWays() {
      const totalTimePercentValue = this.state.totalTimePercentValue;
      const totalGoingTimePercentValue = this.state.totalGoingTimePercentValue;
      const totalTransportChangingCountPercentValue = this.state.totalTransportChangingCountPercentValue;
      AppClient.customizeFindedOptimalWaysStart(totalTimePercentValue, totalGoingTimePercentValue, totalTransportChangingCountPercentValue);
      
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
          <form action="#"><input className="block_elem" type="button" value="Назад" onClick={this.props.onCanceled}/></form>
          <Customization 
            onTotalTimePercentValueChange={this.handleTotalTimePercentValueChange} 
            onTotalGoingTimePercentValueChange={this.handleTotalGoingTimePercentValueChange} 
            onTotalTransportChangingCountPercentValueChange={this.handleTotalTransportChangingCountPercentValueChange} 
            totalTimePercentValue={this.state.totalTimePercentValue}
            totalGoingTimePercentValue={this.state.totalGoingTimePercentValue}
            totalTransportChangingCountPercentValue={this.state.totalTransportChangingCountPercentValue}
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