import React, { Component } from 'react';
import AppClient from './../modules/public-transport-client/client';

class FindedWay extends Component {
  render() {      
    const currentWay = this.props.way;

    const tmpTotalTimeSecondsEffictivity = (AppClient.minimalTimeSeconds / parseFloat(currentWay.totalTimeSeconds) * 100).toFixed(0);
    const tmpTotalGoingTimeSecondsEffictivity = (AppClient.minimalGoingTimeSeconds / parseFloat(currentWay.totalGoingTimeSeconds) * 100).toFixed(0);
    const tmpTransportChangingCountEffictivity = (parseFloat(currentWay.totalTransportChangingCount) === 0 ? 100 : (AppClient.minimalTransportChangingCount / parseFloat(currentWay.totalTransportChangingCount)) * 100).toFixed(0);

    let p1ClassName;
    if (tmpTotalTimeSecondsEffictivity > 85) p1ClassName = "effectivityPercentGold";
    else if (tmpTotalTimeSecondsEffictivity > 50) p1ClassName = "effectivityPercentPlatinum";
    else p1ClassName = "effectivityPercentSilver";
    
    let p2ClassName;
    if (tmpTotalGoingTimeSecondsEffictivity > 85) p2ClassName = "effectivityPercentGold";
    else if (tmpTotalGoingTimeSecondsEffictivity > 50) p2ClassName = "effectivityPercentPlatinum";
    else p2ClassName = "effectivityPercentSilver";
    
    let p3ClassName;
    if (tmpTransportChangingCountEffictivity > 85) p3ClassName = "effectivityPercentGold";
    else if (tmpTransportChangingCountEffictivity > 50) p3ClassName = "effectivityPercentPlatinum";
    else p3ClassName = "effectivityPercentSilver";

    var p1 = (<span className={p1ClassName} title="TotalTimeSecondsEffictivity">{tmpTotalTimeSecondsEffictivity.toString()}%</span>);
    var p2 = (<span className={p2ClassName} title="TotalGoingTimeSecondsEffictivity">{tmpTotalGoingTimeSecondsEffictivity.toString()}%</span>);
    var p3 = (<span className={p3ClassName} title="TransportChangingCountEffictivity">{tmpTransportChangingCountEffictivity.toString()}%</span>);

    let stepsList = [];
    for (var i = 1, stationsCounter = 1; i < currentWay.points.length; i++) {
        var my_text = "";
        if (currentWay.points[i].route == null) {
            stationsCounter = 1;
            if (currentWay.points[i].station == null) my_text = "Идите пешком к пункту назначения.";
            else {
                my_text = "Идите к остановке \"";
                if (currentWay.points[i].station.name.toString() !== "") my_text += currentWay.points[i].station.name.toString();
                else my_text += currentWay.points[i].station.name.toString();
                my_text += "\"";
            }
        }
        else {
            if (i + 1 < currentWay.points.length && currentWay.points[i + 1].route != null && currentWay.points[i].route.type === currentWay.points[i + 1].route.type && currentWay.points[i].route.number === currentWay.points[i + 1].route.number) {
                stationsCounter++;
                continue;
            }
            let tmpText;
            if (stationsCounter%10 > 4 || stationsCounter%10 === 0 || (stationsCounter > 10 && stationsCounter <= 14)) tmpText = "остановок";
            else if(stationsCounter%10 === 1) tmpText = "остановку";
            else if(stationsCounter%10 > 1 && stationsCounter%10 < 5) tmpText = "остановки";
            else tmpText = "остановок";
            my_text = "Проедьте "+stationsCounter+" "+tmpText+" до \"";
            if (currentWay.points[i].station.name.toString() !== "") my_text += currentWay.points[i].station.name.toString();
            else my_text += currentWay.points[i].station.name.toString();
            my_text += "\" на транспорте \"" + currentWay.points[i].route.type.toString() + " " + currentWay.points[i].route.number.toString() + "\"";
        }

        var hours = Math.floor(currentWay.points[i].time / 3600);
        var hoursStr = hours.toString();
        if (hours < 10) hoursStr = "0" + hoursStr;
        var minutes = Math.floor((currentWay.points[i].time - hours * 3600) / 60);
        var minutesStr = minutes.toString();
        if (minutes < 10) minutesStr = "0" + minutesStr;
        var seconds = currentWay.points[i].time - hours * 3600 - minutes * 60;
        var secondsStr = seconds.toString();
        if (seconds < 10) secondsStr = "0" + secondsStr;
        my_text += " (" + hoursStr + ":" + minutesStr + ":" + secondsStr + ")";

        stepsList.push(<li key={i}><span style={{cursor: 'pointer'}}>{my_text}</span></li>);
    }
    
    



    return(
      <div>
        <div className="resultLink">
          {p1}{p2}{p3}
          <ul>{stepsList}</ul>
        </div>
      </div>
    );
  }
}

export default FindedWay;