import React, { Component } from 'react';

class Customization extends Component {
  constructor(props) {
    super(props);
    this.handleTotalTimePercentValueChange = this.handleTotalTimePercentValueChange.bind(this);
    this.handleTotalGoingTimePercentValueChange = this.handleTotalGoingTimePercentValueChange.bind(this);
    this.handleTotalTransportChangingCountPercentValueChange = this.handleTotalTransportChangingCountPercentValueChange.bind(this);
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
  render() {
    return(
      <div id="customization">
        <details id="customize">
          <summary>Customization</summary>
          <div>
            <form action="#">
              <label>
                Уровни значимости по критериям:
                <label className="block_elem"><input type="range" min="0" max="1" step="0.05" value={this.props.totalTimePercentValue} onChange={this.handleTotalTimePercentValueChange}/> Минимум времени: {Math.round(100 * this.props.totalTimePercentValue)} %</label>
                <label className="block_elem"><input type="range" min="0" max="1" step="0.05" value={this.props.totalGoingTimePercentValue} onChange={this.handleTotalGoingTimePercentValueChange}/> Минимум ходьбы: {Math.round(100 * this.props.totalGoingTimePercentValue)} %</label>
                <label className="block_elem"><input type="range" min="0" max="1" step="0.05" value={this.props.totalTransportChangingCountPercentValue} onChange={this.handleTotalTransportChangingCountPercentValueChange}/> Минимум пересадок: {Math.round(100 * this.props.totalTransportChangingCountPercentValue)} %</label>
              </label>
            </form>
          </div>
        </details>
      </div>
    );
  }
}

export default Customization;