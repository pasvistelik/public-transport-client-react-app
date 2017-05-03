import React, { Component } from 'react';
import AppClient from './../modules/public-transport-client/client';

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

            busChecked: true,
            trolleybusChecked: true,
            express_busChecked: false,
            marshChecked: false,
            tramChecked: false,
            metroChecked: false,
            selectedTime: tmpTime,
            selectedGoingSpeed: 5,
            selectedReservedTime: 2,
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
    }
    handleBusCheckedChanged() {
        this.setState({
            busChecked: !this.state.busChecked
        });
    }
    handleTrolleybusCheckedChanged() {
        this.setState({
            busCtrolleybusCheckedhecked: !this.state.trolleybusChecked
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
        this.setState({
            selectedReservedTime: event.target.value
        });
    }
    handleSelectedGoingSpeedChanged(event) {
        this.setState({
            selectedGoingSpeed: event.target.value
        });
    }
    countWay() {
        AppClient.my_dopTimeMinutes = this.state.selectedReservedTime;
        AppClient.my_speed = this.state.selectedGoingSpeed;
        
        var myStartTimeStr = this.state.selectedTime.toString();

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
    render() {
        return(
            <div id="advanced_params_and_button">
                <details id="start_route">
                <summary>Дополнительные параметры построения маршрута</summary>
                <div>
                    <form action="#">
                        <label>
                            Виды транспорта:
                        </label>
                        <label className="checkbox_elem"><input name="transportType" checked={this.state.busChecked} onChange={this.handleBusCheckedChanged} type="checkbox" value="bus"/> Автобус</label>
                        <label className="checkbox_elem"><input name="transportType" checked={this.state.trolleybusChecked} onChange={this.handleTrolleybusCheckedChanged} type="checkbox" value="trolleybus"/> Троллейбус</label>
                        <label className="checkbox_elem"><input name="transportType" checked={this.state.express_busChecked} onChange={this.handleExpress_busCheckedChanged} type="checkbox" value="express_bus"/> Экспресс-автобус</label>
                        <label className="checkbox_elem"><input name="transportType" checked={this.state.marshChecked} onChange={this.handleMarshCheckedChanged} disabled type="checkbox" value="marsh"/> Маршрутка</label>
                        <label className="checkbox_elem"><input name="transportType" checked={this.state.tramChecked} onChange={this.handleTramCheckedChanged} disabled type="checkbox" value="tram"/> Трамвай</label>
                        <label className="checkbox_elem"><input name="transportType" checked={this.state.metroChecked} onChange={this.handleMetroCheckedChanged} disabled type="checkbox" value="metro"/> Метро</label>

                        <label>Время отправки: <input name="time" type="time" value={this.state.selectedTime} onChange={this.handleSelectedTimeChanged}/></label>
                        <label className="block_elem">Going speed: <input name="goingSpeed" type="range" min="2" max="10" step="0.5" value={this.state.selectedGoingSpeed} onChange={this.handleSelectedGoingSpeedChanged}/></label>
                        <label className="block_elem">Reserved time: <input name="reservedTime" type="range" min="0" max="5" step="0.5" value={this.state.selectedReservedTime} onChange={this.handleSelectedReservedTimeChanged}/></label>
                    </form>
                </div>
                </details>
                <form id="buttonCountWay" action="#">
                    <input className="checkbox_elem" type="button" value="Проложить маршрут" onClick={this.countWay}/>
                </form>
            </div>
        );
    }
}

export default FillWayInfoBlock;