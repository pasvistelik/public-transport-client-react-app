import React, { Component } from 'react';
import AppClient from './../modules/client/client';

const SelectingPointStatus = {
    inputing: 0,
    selected: 1,
    waiting: 2
};

class SelectPointsBlock extends Component {
    constructor(props) {
        super(props);
        if (AppClient.startOptimalRoutePoint != null && AppClient.finalOptimalRoutePoint != null) {
            this.state = {
                startPointSearchInputValue: '',
                finalPointSearchInputValue: '',

                formBackgroundColor: '#ffffff',

                startPointStatusText: '',
                finalPointStatusText: '',

                startPointStatus: SelectingPointStatus.selected,
                finalPointStatus: SelectingPointStatus.selected,
            };
            this.tryGoToAdvancedParamsAndButton();
        }
        else {
            this.state = {
                startPointSearchInputValue: '',
                finalPointSearchInputValue: '',

                formBackgroundColor: '#ffffff',

                //startPointStatusText: '',
                finalPointStatusText: '',

                //startPointStatus: SelectingPointStatus.inputing,
                finalPointStatus: SelectingPointStatus.inputing,

                startPointStatusText: "определение текущего местоположения...",
                startPointStatus: SelectingPointStatus.waiting
            };
        }
        this.updateStartPointSearchInputValue = this.updateStartPointSearchInputValue.bind(this);
        this.updateFinalPointSearchInputValue = this.updateFinalPointSearchInputValue.bind(this);
        this.findStartPoint = this.findStartPoint.bind(this);
        this.findFinalPoint = this.findFinalPoint.bind(this);
        this.changeEditStartPointEnabledStatus = this.changeEditStartPointEnabledStatus.bind(this);
        this.changeEditFinalPointEnabledStatus = this.changeEditFinalPointEnabledStatus.bind(this);
        this.trySetCurrentPositionAsStartPoint = this.trySetCurrentPositionAsStartPoint.bind(this);

        this.trySetCurrentPositionAsStartPoint();
    }
    updateStartPointSearchInputValue(evt) {
        this.setState({
            startPointSearchInputValue: evt.target.value
        });
    }
    updateFinalPointSearchInputValue(evt) {
        this.setState({
            finalPointSearchInputValue: evt.target.value
        });
    }
    async trySetCurrentPositionAsStartPoint() {
        if(AppClient.myCurrentFindedPosition != null) return;

        /*this.setState({
            startPointStatusText: "определение текущего местоположения...",
            startPointStatus: SelectingPointStatus.waiting
        });*/

        AppClient.myCurrentFindedPosition = await AppClient.findCurrentDestinationCoords();
        if (AppClient.myCurrentFindedPosition != null) {
            this.setStartOptimalRoutePoint(AppClient.myCurrentFindedPosition, "текущее местоположение (рядом с " + localStorage["lastCnownPositionCoordsDescription"] + ")");
        }
        else {
            this.setState({
                startPointStatusText: '',
                startPointStatus: SelectingPointStatus.inputing
            });
        }
    }
    async findStartPoint() {
        var tmp = this.state.startPointSearchInputValue;
        var strReq = tmp.toString();
        var resultPoint = await AppClient.getPointCoordsFromOsmGeocodingApi(strReq);
        
        if (resultPoint != null) {
            this.setStartOptimalRoutePoint(resultPoint, strReq);
        }
        else {
            AppClient.startOptimalRoutePoint = null;
            this.tryGoToAdvancedParamsAndButton();
            alert("К сожалению, не удалось что-то найти по вашему запросу.");
        }
    }
    async findFinalPoint() {
        var tmp = this.state.finalPointSearchInputValue;
        var strReq = tmp.toString();
        var resultPoint = await AppClient.getPointCoordsFromOsmGeocodingApi(strReq);
        
        if (resultPoint != null) {
            this.setFinalOptimalRoutePoint(resultPoint, strReq);
        }
        else {
            AppClient.finalOptimalRoutePoint = null;
            this.tryGoToAdvancedParamsAndButton();
            alert("К сожалению, не удалось что-то найти по вашему запросу.");
        }
    }
    changeEditStartPointEnabledStatus() {
        this.setState({
            startPointStatus: SelectingPointStatus.inputing
        });
    }
    changeEditFinalPointEnabledStatus() {
        this.setState({
            finalPointStatus: SelectingPointStatus.inputing
        });
    }
    setStartOptimalRoutePoint(currentLatLng, strReq) {
        if (currentLatLng != null) {
            AppClient.startOptimalRoutePoint = currentLatLng;
            if (strReq !== undefined) {
                this.setState({
                    startPointStatusText: strReq,
                    startPointStatus: SelectingPointStatus.selected
                });
            }
            this.tryGoToAdvancedParamsAndButton();
        }
    }
    setFinalOptimalRoutePoint(currentLatLng, strReq) {
        if (currentLatLng != null) {
            AppClient.finalOptimalRoutePoint = currentLatLng;
            if (strReq !== undefined) {
                this.setState({
                    finalPointStatusText: strReq,
                    finalPointStatus: SelectingPointStatus.selected
                });
            }
            this.tryGoToAdvancedParamsAndButton();
        }
    }
    tryGoToAdvancedParamsAndButton() {
        if(AppClient.startOptimalRoutePoint != null && AppClient.finalOptimalRoutePoint != null) {
            this.setState({
                formBackgroundColor: "#baff91"
            });
            this.props.onSelected();
        }
    }


    render() {
        let startPointBlock = 'Error...';
        if (this.state.startPointStatus === SelectingPointStatus.selected) {
            startPointBlock = (
                <label>
                    <span>Начальная точка: </span>
                    <span id="startPointStatusText">{this.state.startPointStatusText}</span>
                    <span id="startPointBlockButtonChange">(<a href="#" onClick={this.changeEditStartPointEnabledStatus}>изменить</a>)</span>
                </label>
            );
        }
        else if (this.state.startPointStatus === SelectingPointStatus.inputing) {
            startPointBlock = (
                <div className="inForm">
                    <label>
                        <span>Начальная точка: </span>
                        <span id="startPointStatusText">{this.state.startPointStatusText}</span>
                        <input 
                            name="startPointSearch" 
                            value={this.state.startPointSearchInputValue} 
                            onChange={this.updateStartPointSearchInputValue} 
                            type="text"
                        />
                    </label>
                    <input name="startPointSearchButton" type="button" value="Найти" onClick={this.findStartPoint}/>
                </div>
            );
        }
        else if (this.state.startPointStatus === SelectingPointStatus.waiting) {
            startPointBlock = (
                <label>
                    <span>Начальная точка: </span>
                    <span id="startPointStatusText">{this.state.startPointStatusText}</span>
                </label>
            );
        }
        let finalPointBlock = 'Error...';
        if (this.state.finalPointStatus === SelectingPointStatus.selected) {
            finalPointBlock = (
                <label>
                    <span>Конечная точка: </span>
                    <span id="finalPointStatusText">{this.state.finalPointStatusText}</span>
                    <span id="finalPointBlockButtonChange">(<a href="#" onClick={this.changeEditFinalPointEnabledStatus}>изменить</a>)</span>
                </label>
            );
        }
        else if (this.state.finalPointStatus === SelectingPointStatus.inputing) {
            finalPointBlock = (
                <div className="inForm">
                    <label>
                        <span>Конечная точка: </span>
                        <span id="finalPointStatusText">{this.state.finalPointStatusText}</span>
                        <input 
                            name="finalPointSearch" 
                            value={this.state.finalPointSearchInputValue} 
                            onChange={this.updateFinalPointSearchInputValue} 
                            type="text"
                        />
                    </label>
                    <input name="finalPointSearchButton" type="button" value="Найти" onClick={this.findFinalPoint}/>
                </div>
            );
        }
        return(
            <div id="start-final_points" style={{backgroundColor: this.state.formBackgroundColor}}>
                <p>Сведения о прокладываемом маршруте:</p>
                <form action="#">
                    {startPointBlock}
                    {finalPointBlock}
                </form>
            </div>
        );
    }
}

export default SelectPointsBlock;