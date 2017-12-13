import React, { Component } from 'react';
import AppClient from 'public-transport-client';

class FindedWay extends Component {
  render() {      
    const currentWay = this.props.way;
    //console.log(currentWay);
    
    const tmpTotalTimeSecondsEffictivity = (AppClient.minimalTimeSeconds / parseFloat(currentWay.totalTimeSeconds) * 100).toFixed(0);
    const tmpTotalGoingTimeSecondsEffictivity = (AppClient.minimalGoingTimeSeconds / parseFloat(currentWay.totalGoingTimeSeconds) * 100).toFixed(0);
    //const tmpTotalGoingTimeSecondsEffictivity = (100 - parseFloat(currentWay.totalWaitingTime) / parseFloat(currentWay.totalGoingTimeSeconds) * 100).toFixed(0);
    const tmpTransportChangingCountEffictivity = (parseFloat(currentWay.totalTransportChangingCount) === 0 ? 100 : (AppClient.minimalTransportChangingCount / parseFloat(currentWay.totalTransportChangingCount)) * 100).toFixed(0);
    //const tmpTotalWaitingTimeSecondsEffictivity = (AppClient.minimalWaitingTimeSeconds / parseFloat(currentWay.totalWaitingTime) * 100).toFixed(0);
    const tmpTotalWaitingTimeSecondsEffictivity = (100 - parseFloat(currentWay.totalWaitingTime) / parseFloat(currentWay.totalTimeSeconds) * 100).toFixed(0);
    
    var ttttt = Math.ceil(currentWay.riskEffectivity * 100);
    const tmpRiskTimeSecondsEffictivity = ttttt;//(AppClient.minimalRiskTimeSeconds / parseFloat(currentWay.minimalWaitingTime) * 100).toFixed(0);

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
    
    let p4ClassName;
    if (tmpTotalWaitingTimeSecondsEffictivity > 85) p4ClassName = "effectivityPercentGold";
    else if (tmpTotalWaitingTimeSecondsEffictivity > 50) p4ClassName = "effectivityPercentPlatinum";
    else p4ClassName = "effectivityPercentSilver";
    
    let p5ClassName;
    if (tmpRiskTimeSecondsEffictivity > 85) p5ClassName = "effectivityPercentGold";
    else if (tmpRiskTimeSecondsEffictivity > 50) p5ClassName = "effectivityPercentPlatinum";
    else p5ClassName = "effectivityPercentSilver";


    

  var p1 = (<span className={p1ClassName} title="TotalTimeSecondsEffictivity"><img alt="" src="../images/timer.png"/>{/*tmpTotalTimeSecondsEffictivity.toString()*/toHHMMSS(currentWay.totalTimeSeconds)}</span>);
    var p2 = (<span className={p2ClassName} title="TotalGoingTimeSecondsEffictivity"><img alt="" src="../images/walking.png"/>{/*tmpTotalGoingTimeSecondsEffictivity.toString()*/toHHMMSS(currentWay.totalGoingTimeSeconds)}</span>);
    var p3 = (<span className={p3ClassName} title="TransportChangingCountEffictivity"><img alt="" src="../images/change.png"/>{/*tmpTransportChangingCountEffictivity.toString()*/currentWay.totalTransportChangingCount}</span>);
    var p4 = (<span className={p4ClassName} title="TotalWaitingTimeSecondsEffictivity"><img alt="" src="../images/wait.png"/>{/*tmpTotalWaitingTimeSecondsEffictivity.toString()*/toHHMMSS(currentWay.totalWaitingTime)}</span>);
    var p5 = (<span className={p5ClassName} title="RiskTimeSecondsEffictivity"><img alt="" src="../images/good.png"/>{tmpRiskTimeSecondsEffictivity.toString()}%</span>);

    //if(currentWay.minimalWaitingTime<=0) console.log(currentWay);

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
            //if (currentWay.points[i].station.name.toString() !== "") my_text += currentWay.points[i].station.name.toString(); else 
            my_text += currentWay.points[i].station.name.toString();
            my_text += "\" на транспорте \"" + currentWay.points[i].route.type.toString() + " " + currentWay.points[i].route.number.toString() + "\"";
        
            stationsCounter = 1;
        }

        /*var hours = Math.floor(currentWay.points[i].time / 3600);
        var hoursStr = hours.toString();
        if (hours < 10) hoursStr = "0" + hoursStr;
        var minutes = Math.floor((currentWay.points[i].time - hours * 3600) / 60);
        var minutesStr = minutes.toString();
        if (minutes < 10) minutesStr = "0" + minutesStr;
        var seconds = currentWay.points[i].time - hours * 3600 - minutes * 60;
        var secondsStr = seconds.toString();
        if (seconds < 10) secondsStr = "0" + secondsStr;
        my_text += " (" + hoursStr + ":" + minutesStr + ":" + secondsStr + ")";*/

        if (i === currentWay.points.length - 1){
          stepsList.push(<li key={i}><span style={{cursor: 'pointer'}}>{my_text} (arrive = {toHHMMSS(currentWay.points[i].arrivalTime)})</span></li>);
        }
        else {
          stepsList.push(<li key={i}><span style={{cursor: 'pointer'}}>{my_text} (arrive = {toHHMMSS(currentWay.points[i].arrivalTime)}, dispatch = {toHHMMSS(currentWay.points[i].dispatchTime)})</span></li>);
        }
        

    }
    
    



    return(
      <div>
        <div className="resultLink">
          {p1}{p2}{p3}{p4}{p5}
          <ul>{stepsList}</ul>
        </div>
      </div>
    );
  }
}

export default FindedWay;

function toHHMMSS(sec_num) {
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  var result = "";
  if (hours > 0) result = hours+':'+minutes+':'+seconds
  else result = minutes+':'+seconds
  return result;
}