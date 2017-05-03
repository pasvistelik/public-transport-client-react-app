import React, { Component } from 'react';
import AppClient from './../modules/public-transport-client/client';
//import PointsHistoryStorage from './../modules/client/pointsHistoryStorage';
import PointsHistoryBlock from './PointsHistoryBlock';

const SelectingPointStatus = {
    inputing: 0,
    selected: 1,
    waiting: 2
};

class SelectPointsBlock extends Component {
    static lastSelectedStartPointDescription = '';
    static lastSelectedFinalPointDescription = '';
    static lastInputedStartPointSearchValue = '';
    static lastInputedFinalPointSearchValue = '';
    constructor(props) {
        super(props);
        if (AppClient.startOptimalRoutePoint != null && AppClient.finalOptimalRoutePoint != null) {
            this.state = {
                startPointSearchInputValue: SelectPointsBlock.lastInputedStartPointSearchValue,
                finalPointSearchInputValue: SelectPointsBlock.lastInputedFinalPointSearchValue,

                formBackgroundColor: "#baff91",

                startPointStatusText: SelectPointsBlock.lastSelectedStartPointDescription,
                finalPointStatusText: SelectPointsBlock.lastSelectedFinalPointDescription,

                startPointStatus: SelectingPointStatus.selected,
                finalPointStatus: SelectingPointStatus.selected,
            };
            //this.tryGoToAdvancedParamsAndButton();
            this.props.onSelected();
        }
        else {
            this.state = {
                startPointSearchInputValue: SelectPointsBlock.lastInputedStartPointSearchValue,
                finalPointSearchInputValue: SelectPointsBlock.lastInputedFinalPointSearchValue,

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
        this.setStartOptimalRoutePoint = this.setStartOptimalRoutePoint.bind(this);
        this.setFinalOptimalRoutePoint = this.setFinalOptimalRoutePoint.bind(this);

        this.trySetCurrentPositionAsStartPoint();
    }
    updateStartPointSearchInputValue(evt) {
        SelectPointsBlock.lastInputedStartPointSearchValue = evt.target.value;
        this.setState({
            startPointSearchInputValue: SelectPointsBlock.lastInputedStartPointSearchValue
        });
    }
    updateFinalPointSearchInputValue(evt) {
        SelectPointsBlock.lastInputedFinalPointSearchValue = evt.target.value;
        this.setState({
            finalPointSearchInputValue: SelectPointsBlock.lastInputedFinalPointSearchValue
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
        const searchQueryStr = this.state.startPointSearchInputValue.toString();
        const findedPoints = await AppClient.findPointsByOsmGeocodingApi(searchQueryStr);
        
        if (findedPoints != null) {
            const firstFindedPoint = findedPoints[0];
            this.setStartOptimalRoutePoint(firstFindedPoint.coords, firstFindedPoint.description);
        }
        else {
            AppClient.startOptimalRoutePoint = null;
            this.tryGoToAdvancedParamsAndButton();
            alert("К сожалению, не удалось что-то найти по вашему запросу.");
        }
    }
    async findFinalPoint() {
        const searchQueryStr = this.state.finalPointSearchInputValue.toString();
        const findedPoints = await AppClient.findPointsByOsmGeocodingApi(searchQueryStr);
        
        if (findedPoints != null) {
            const firstFindedPoint = findedPoints[0];
            this.setFinalOptimalRoutePoint(firstFindedPoint.coords, firstFindedPoint.description);
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
                SelectPointsBlock.lastSelectedStartPointDescription = strReq;
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
                SelectPointsBlock.lastSelectedFinalPointDescription = strReq;
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
        //const pointsHistory = await PointsHistoryStorage.getAllPoints();
        //console.log(pointsHistory);
        let startPointBlock = 'Error...';
        if (this.state.startPointStatus === SelectingPointStatus.selected || this.state.startPointStatus === SelectingPointStatus.waiting) {
            startPointBlock = (
                <label>
                    <span>Начальная точка: </span>
                    <span id="startPointStatusText">{this.state.startPointStatusText}</span>
                    <span id="startPointBlockButtonChange">(<a href="#" onClick={this.changeEditStartPointEnabledStatus}>изменить</a>)</span>
                </label>
            );
        }
        else if (this.state.startPointStatus === SelectingPointStatus.inputing) {
            let buttonSearch = '', inputSearch = '';
            if (!('onLine' in navigator) || navigator.onLine === true) {
                buttonSearch = (
                    <input name="startPointSearchButton" type="button" value="Найти" onClick={this.findStartPoint}/>
                );
                inputSearch = (
                    <input 
                        name="startPointSearch" 
                        value={this.state.startPointSearchInputValue} 
                        onChange={this.updateStartPointSearchInputValue} 
                        type="text"
                    />
                );
            }
            startPointBlock = (
                <div className="inForm">
                    <label>
                        <span>Начальная точка: </span>
                        <span id="startPointStatusText">{this.state.startPointStatusText}</span>
                        {inputSearch}
                    </label>
                    {buttonSearch}
                    <PointsHistoryBlock setPointHandler={this.setStartOptimalRoutePoint}/>
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
            let buttonSearch = '', inputSearch = '';
            if (!('onLine' in navigator) || navigator.onLine === true) {
                buttonSearch = (
                    <input name="finalPointSearchButton" type="button" value="Найти" onClick={this.findFinalPoint}/>
                );
                inputSearch = (
                    <input 
                        name="finalPointSearch" 
                        value={this.state.finalPointSearchInputValue} 
                        onChange={this.updateFinalPointSearchInputValue} 
                        type="text"
                    />
                );
            }
            finalPointBlock = (
                <div className="inForm">
                    <label>
                        <span>Конечная точка: </span>
                        <span id="finalPointStatusText">{this.state.finalPointStatusText}</span>
                        {inputSearch}
                    </label>
                    {buttonSearch}
                    <PointsHistoryBlock setPointHandler={this.setFinalOptimalRoutePoint}/>
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