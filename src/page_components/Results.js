import React, { Component } from 'react';
import FindedWay from './FindedWay';

class Results extends Component {
  render() {
    return(
      <div id="results">
        <p>Найденные пути:</p>
        <div id="customization_result">
          { this.props.findedOptimalWays.map(function(item, index){
            return <FindedWay key={index} way={item}/>;
          })}
        </div>
      </div>
    );
  }
}

export default Results;