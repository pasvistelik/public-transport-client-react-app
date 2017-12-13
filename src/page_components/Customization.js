import React, { Component } from 'react';

class Customization extends Component {
  constructor(props) {
    super(props);
    this.handleTotalTimePercentValueChange = this.handleTotalTimePercentValueChange.bind(this);
    this.handleTotalGoingTimePercentValueChange = this.handleTotalGoingTimePercentValueChange.bind(this);
    this.handleTotalTransportChangingCountPercentValueChange = this.handleTotalTransportChangingCountPercentValueChange.bind(this);
    this.handleTotalWaitingTimePercentValueChange = this.handleTotalWaitingTimePercentValueChange.bind(this);
    this.handleRiskPercentValueChange = this.handleRiskPercentValueChange.bind(this);
  }
  handleTotalTimePercentValueChange(event) {
    this.props.onTotalTimePercentValueChange(event.target.value);
  }
  handleTotalGoingTimePercentValueChange(event) {
    this.props.onTotalGoingTimePercentValueChange(event.target.value);
  }
  handleTotalTransportChangingCountPercentValueChange(event) {
    this.props.onTotalTransportChangingCountPercentValueChange(event.target.value);
  }
  handleTotalWaitingTimePercentValueChange(event) {
    this.props.onTotalWaitingTimePercentValueChange(event.target.value);
  }
  handleRiskPercentValueChange(event) {
    this.props.onRiskPercentValueChange(event.target.value);
  }
  render() {
    return(
      <div id="customization">
        <details id="customize" className="btn btn-default btn-block" style={{textAlign:'left'}}>
          <summary>Customization</summary>
          <div>
            <form action="#">
              <label>Уровни значимости по критериям:</label>
                <div className="form-group"><label className="block_elem"><input type="range" min="0" max="100" step="5" value={this.props.totalTimePercentValue} onChange={this.handleTotalTimePercentValueChange}/> Минимум времени: {Math.round(this.props.totalTimePercentValue)} %</label></div>
                <div className="form-group"><label className="block_elem"><input type="range" min="0" max="100" step="5" value={this.props.totalGoingTimePercentValue} onChange={this.handleTotalGoingTimePercentValueChange}/> Минимум ходьбы: {Math.round(this.props.totalGoingTimePercentValue)} %</label></div>
                <div className="form-group"><label className="block_elem"><input type="range" min="0" max="100" step="5" value={this.props.totalTransportChangingCountPercentValue} onChange={this.handleTotalTransportChangingCountPercentValueChange}/> Минимум пересадок: {Math.round(this.props.totalTransportChangingCountPercentValue)} %</label></div>
                <div className="form-group"><label className="block_elem"><input type="range" min="0" max="100" step="5" value={this.props.totalWaitingTimePercentValue} onChange={this.handleTotalWaitingTimePercentValueChange}/> Минимум ожидания: {Math.round(this.props.totalWaitingTimePercentValue)} %</label></div>
                <div className="form-group"><label className="block_elem"><input type="range" min="0" max="100" step="5" value={this.props.riskPercentValue} onChange={this.handleRiskPercentValueChange}/> Минимум риска: {Math.round(this.props.riskPercentValue)} %</label></div>
            </form>
          </div>
        </details>
      </div>
    );
  }
}

export default Customization;