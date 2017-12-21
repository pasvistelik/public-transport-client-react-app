import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AppClient from 'public-transport-client';

var TimeTypes = {
    dispatchNow: 0,
    dispatchAfter: 1,
    dispatchAt: 2,
    arriveBefore: 3
}

class FillWayInfoBlock extends Component {
    constructor(props) {
        super(props);

        let tmpMyDate = new Date();
        let hoursStr = tmpMyDate.getHours().toString();
        if (hoursStr.length === 1) hoursStr = "0" + hoursStr;
        let minutesStr = tmpMyDate.getMinutes().toString();
        if (minutesStr.length === 1) minutesStr = "0" + minutesStr;
        let tmpTime = hoursStr + ":" + minutesStr;

        this.state = {
            timeType: TimeTypes.dispatchNow,

            busChecked: true,
            trolleybusChecked: true,
            express_busChecked: false,
            marshChecked: false,
            tramChecked: false,
            metroChecked: false,
            selectedTime: tmpTime,
            selectedGoingSpeed: AppClient.goingSpeed,
            selectedReservedTime: AppClient.dopTimeMinutes,
            isNeedCountingOnServer: JSON.parse(AppClient.isNeedCountingOnServer)
        };
        this.countWay = this.countWay.bind(this);
        
        this.handleBusCheckedChanged = this.handleBusCheckedChanged.bind(this);
        this.handleTrolleybusCheckedChanged = this.handleTrolleybusCheckedChanged.bind(this);
        this.handleExpress_busCheckedChanged = this.handleExpress_busCheckedChanged.bind(this);
        this.handleMarshCheckedChanged = this.handleMarshCheckedChanged.bind(this);
        this.handleTramCheckedChanged = this.handleTramCheckedChanged.bind(this);
        this.handleMetroCheckedChanged = this.handleMetroCheckedChanged.bind(this);
        this.handleSelectedTimeChanged = this.handleSelectedTimeChanged.bind(this);
        this.handleSelectedReservedTimeChanged = this.handleSelectedReservedTimeChanged.bind(this);
        this.handleSelectedGoingSpeedChanged = this.handleSelectedGoingSpeedChanged.bind(this);
        this.handleCountingOnServerFlagChanged = this.handleCountingOnServerFlagChanged.bind(this);
    }
    handleCountingOnServerFlagChanged(event) {
        AppClient.isNeedCountingOnServer = JSON.stringify(event.target.checked);
        this.setState({
            isNeedCountingOnServer: JSON.parse(AppClient.isNeedCountingOnServer)
        });
    }
    handleBusCheckedChanged() {
        this.setState({
            busChecked: !this.state.busChecked
        });
    }
    handleTrolleybusCheckedChanged() {
        this.setState({
            trolleybusChecked: !this.state.trolleybusChecked
        });
    }
    handleExpress_busCheckedChanged() {
        this.setState({
            express_busChecked: !this.state.express_busChecked
        });
    }
    handleMarshCheckedChanged() {
        this.setState({
            marshChecked: !this.state.marshChecked
        });
    }
    handleTramCheckedChanged() {
        this.setState({
            tramChecked: !this.state.tramChecked
        });
    }
    handleMetroCheckedChanged() {
        this.setState({
            metroChecked: !this.state.metroChecked
        });
    }
    handleSelectedTimeChanged(event) {
        this.setState({
            selectedTime: event.target.value
        });
    }
    handleSelectedReservedTimeChanged(event) {
        AppClient.dopTimeMinutes = event.target.value;
        this.setState({
            selectedReservedTime: event.target.value
        });
    }
    handleSelectedGoingSpeedChanged(event) {
        AppClient.goingSpeed = event.target.value;
        this.setState({
            selectedGoingSpeed: event.target.value
        });
    }
    countWay() {        
        var myStartTimeStr = this.state.selectedTime.toString();
        if (this.state.timeType === TimeTypes.dispatchNow) {
            var tmpDate = new Date();
            myStartTimeStr = tmpDate.getHours() + ":" + tmpDate.getMinutes() + ":" + tmpDate.getSeconds(); //!!!
        }
        else if (this.state.timeType === TimeTypes.dispatchAt) {
            myStartTimeStr = this.state.selectedTime.toString();
        }

        let selectedTypes = [];
        if(this.state.busChecked) selectedTypes.push("bus");
        if(this.state.trolleybusChecked) selectedTypes.push("trolleybus");
        if(this.state.express_busChecked) selectedTypes.push("express_bus");
        if(this.state.marshChecked) selectedTypes.push("marsh");
        if(this.state.tramChecked) selectedTypes.push("tram");
        if(this.state.metroChecked) selectedTypes.push("metro");
        AppClient.types = selectedTypes;

        let fromPositionStr = AppClient.startOptimalRoutePoint.lat + "," + AppClient.startOptimalRoutePoint.lng;
        let toPositionStr = AppClient.finalOptimalRoutePoint.lat + "," + AppClient.finalOptimalRoutePoint.lng;
        let typesStr = (selectedTypes == null || selectedTypes.length === 0) ? null : selectedTypes[0];
        for (var i = 1, n = selectedTypes.length; i < n; i++) typesStr += "," + selectedTypes[i];

        this.props.onConfirmed(fromPositionStr, toPositionStr, myStartTimeStr, this.state.selectedReservedTime, this.state.selectedGoingSpeed, typesStr);
    }
    /*
    <div className="input-group">
        <span className="input-group-addon">Отправление</span>
        <div className="input-group-btn">
            
            <button className="btn btn-default" type="button">
                    сейчас
            </button>
            <button className="btn btn-default" type="button">
                    через
            </button>
            <button className="btn btn-default" type="button">
                    в
            </button>
            <button className="btn btn-default" type="button">
                    до
            </button>
        </div>
    </div>
    */
    render() {
        var self = this;
        var selectedTimeTypeDescription="сейчас";
        var timeInput = (<input id="current-time" disabled value={new Date().toLocaleTimeString()}/>);
        if (this.state.timeType === TimeTypes.dispatchAt){
            selectedTimeTypeDescription = "Отправление в:";
            timeInput = (<input name="time" className="time-select" type="time" value={this.state.selectedTime} onChange={self.handleSelectedTimeChanged}/>);
        }
        else if (this.state.timeType === TimeTypes.dispatchAfter){
            selectedTimeTypeDescription = "Отправление в:";
            timeInput = (<input name="time" className="time-select" type="time" value={this.state.selectedTime} onChange={self.handleSelectedTimeChanged}/>);
        }
        var setDispatchAt = function(){
            self.setState({timeType: TimeTypes.dispatchAt});
        }
        var setDispatchNow = function(){
            self.setState({timeType: TimeTypes.dispatchNow});
        }
        var setDispatchAfter = function(event){
            //console.log(event.target.value);
            let d = new Date();
            d.setMinutes(d.getMinutes() + parseInt(event.target.value));

            let hoursStr = d.getHours().toString();
            if (hoursStr.length === 1) hoursStr = "0" + hoursStr;
            let minutesStr = d.getMinutes().toString();
            if (minutesStr.length === 1) minutesStr = "0" + minutesStr;
            let secondsStr = d.getSeconds().toString();
            if (secondsStr.length === 1) secondsStr = "0" + secondsStr;
            let tmpTime = hoursStr + ":" + minutesStr + ":" + secondsStr;

            console.log("Selected dispatch time: "+tmpTime);
            self.setState({
                timeType: TimeTypes.dispatchAfter,
                selectedTime: tmpTime
            });
        }
        return(
            <div id="advanced_params_and_button">
                
                <p>
                <div className="input-group icon-button-time">
                    <span className="input-group-addon"><span className="glyphicon glyphicon-time"></span></span>
                    
                    
                    <button className="btn btn-default dropdown-toggle" type="button" id="menu3" data-toggle="dropdown">
                        <span className="caret"></span> &nbsp;
                        {selectedTimeTypeDescription}
                    </button>
                    <ul className="dropdown-menu"  role="menu" aria-labelledby="menu3">
                        <li role="presentation" className="dropdown-header">По времени отправления:</li>
                        <li role="presentation">
                            <div className="menu-item-with-table">
                                <table className="table-with-buttons">
                                    <tr>
                                        <td><button onClick={setDispatchNow} className="btn btn-default">сейчас</button></td>
                                        <td><button onClick={setDispatchAt} className="btn btn-default">выбрать время</button></td>
                                    </tr>
                                </table>
                            </div>
                        </li>
                        <li role="presentation" className="dropdown-header">Отправление через X минут:</li>
                        <li role="presentation">
                            <div className="menu-item-with-table">
                                <table className="table-with-buttons">
                                    <tr>
                                        <td><button type="button" onClick={setDispatchAfter} className="btn btn-default" value="1">1</button></td>
                                        <td><button type="button" onClick={setDispatchAfter} className="btn btn-default" value="2">2</button></td>
                                        <td><button type="button" onClick={setDispatchAfter} className="btn btn-default" value="3">3</button></td>
                                        <td><button type="button" onClick={setDispatchAfter} className="btn btn-default" value="5">5</button></td>
                                    </tr>
                                    <tr>
                                        <td><button type="button" onClick={setDispatchAfter} className="btn btn-default" value="10">10</button></td>
                                        <td><button type="button" onClick={setDispatchAfter} className="btn btn-default" value="15">15</button></td>
                                        <td><button type="button" onClick={setDispatchAfter} className="btn btn-default" value="20">20</button></td>
                                        <td><button type="button" onClick={setDispatchAfter} className="btn btn-default" value="30">30</button></td>
                                    </tr>
                                    <tr>
                                        <td><button type="button" onClick={setDispatchAfter} className="btn btn-default" value="40">40</button></td>
                                        <td><button type="button" onClick={setDispatchAfter} className="btn btn-default" value="50">50</button></td>
                                        <td><button type="button" onClick={setDispatchAfter} className="btn btn-default" value="60">60</button></td>
                                        <td><button type="button" onClick={setDispatchAfter} className="btn btn-default" value="90">90</button></td>
                                    </tr>
                                </table>
                            </div>
                        </li>
                        <li role="presentation" className="divider"></li>
                        <li role="presentation" className="dropdown-header">По времени прибытия:</li>
                        <li role="presentation">
                            <div className="menu-item-with-table">
                                <table className="table-with-buttons">
                                    <tr>
                                        <td><button disabled className="btn btn-default">Успеть до...</button></td>
                                    </tr>
                                </table>
                            </div>
                        </li>
                        <li role="presentation" className="dropdown-header">Быть через X минут:</li>
                        <li role="presentation">
                            <div className="menu-item-with-table">
                                <table className="table-with-buttons">
                                    <tr>
                                        <td><button disabled className="btn btn-default">1</button></td>
                                        <td><button disabled className="btn btn-default">2</button></td>
                                        <td><button disabled className="btn btn-default">3</button></td>
                                        <td><button disabled className="btn btn-default">5</button></td>
                                    </tr>
                                    <tr>
                                        <td><button disabled className="btn btn-default">10</button></td>
                                        <td><button disabled className="btn btn-default">15</button></td>
                                        <td><button disabled className="btn btn-default">20</button></td>
                                        <td><button disabled className="btn btn-default">30</button></td>
                                    </tr>
                                    <tr>
                                        <td><button disabled className="btn btn-default">40</button></td>
                                        <td><button disabled className="btn btn-default">50</button></td>
                                        <td><button disabled className="btn btn-default">60</button></td>
                                        <td><button disabled className="btn btn-default">90</button></td>
                                    </tr>
                                </table>
                            </div>
                        </li>
                    </ul> 
                    
                    <span className="input-group-addon with-input">
                        {timeInput}
                    </span>
                </div>
                </p>
                
                

                <p>
                    <button type="button" onClick={this.countWay} className="btn btn-primary btn-lg btn-block">Проложить маршрут</button>
                </p>

                <p><details id="start_route" className="btn btn-default btn-block" style={{textAlign:'left'}}>
                <summary>Дополнительные параметры</summary>
                <div>
                    <form action="#">
                        <label>
                            Используемые виды транспорта:
                        </label>
                        <div className="checkbox"><label className="checkbox_elem"><input name="transportType" checked={this.state.busChecked} onChange={this.handleBusCheckedChanged} type="checkbox" value="bus"/> Автобус</label></div>
                        <div className="checkbox"><label className="checkbox_elem"><input name="transportType" checked={this.state.trolleybusChecked} onChange={this.handleTrolleybusCheckedChanged} type="checkbox" value="trolleybus"/> Троллейбус</label></div>
                        <div className="checkbox"><label className="checkbox_elem"><input name="transportType" checked={this.state.express_busChecked} onChange={this.handleExpress_busCheckedChanged} type="checkbox" value="express_bus"/> Экспресс-автобус</label></div>
                        <div className="checkbox"><label className="checkbox_elem"><input name="transportType" checked={this.state.marshChecked} onChange={this.handleMarshCheckedChanged} disabled type="checkbox" value="marsh"/> Маршрутка</label></div>
                        <div className="checkbox"><label className="checkbox_elem"><input name="transportType" checked={this.state.tramChecked} onChange={this.handleTramCheckedChanged} disabled type="checkbox" value="tram"/> Трамвай</label></div>
                        <div className="checkbox"><label className="checkbox_elem"><input name="transportType" checked={this.state.metroChecked} onChange={this.handleMetroCheckedChanged} disabled type="checkbox" value="metro"/> Метро</label></div>

                        <br/>
                        <div className="checkbox"><label className="checkbox_elem"><input name="isNeedCountingOnServer" checked={this.state.isNeedCountingOnServer} onChange={this.handleCountingOnServerFlagChanged} type="checkbox"/> Count ways on a server.</label></div>
                        
                        <div className="form-group"><label className="block_elem">Going speed: <input name="goingSpeed" type="range" min="1" max="10" step="0.5" value={this.state.selectedGoingSpeed} onChange={this.handleSelectedGoingSpeedChanged}/> {this.state.selectedGoingSpeed} км/ч</label></div>
                        <div className="form-group"><label className="block_elem">Reserved time: <input name="reservedTime" type="range" min="-6" max="6" step="0.5" value={this.state.selectedReservedTime} onChange={this.handleSelectedReservedTimeChanged}/> {this.state.selectedReservedTime} мин.</label></div>
                    </form>
                </div>
                </details></p>
                
                
            </div>
        );
    }
}
/*
<form id="buttonCountWay" action="#">
    <input className="checkbox_elem" type="button" value="Проложить маршрут" onClick={this.countWay}/>
</form>
*/
export default FillWayInfoBlock;

function tick() {
    let tmp = document.getElementById("current-time");
    if (tmp) tmp.value = new Date().toLocaleTimeString();
}
setInterval(tick, 1000);