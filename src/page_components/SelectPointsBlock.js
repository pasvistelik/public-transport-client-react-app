import React, { Component } from 'react';
import AppClient from 'public-transport-client';
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

                //formBackgroundColor: "#baff91",

                startPointStatusText: SelectPointsBlock.lastSelectedStartPointDescription,
                finalPointStatusText: SelectPointsBlock.lastSelectedFinalPointDescription,

                startPointStatus: SelectingPointStatus.selected,
                finalPointStatus: SelectingPointStatus.selected,

                startPointInputActive: true,
                finalPointInputActive: true,
            };
            //this.tryGoToAdvancedParamsAndButton();
            this.props.onSelected();
        }
        else if(AppClient.startOptimalRoutePoint == null && localStorage["canUseGeolocation"]){
            this.state = {
                startPointSearchInputValue: SelectPointsBlock.lastInputedStartPointSearchValue,
                finalPointSearchInputValue: SelectPointsBlock.lastInputedFinalPointSearchValue,

                finalPointStatusText: '',
                finalPointStatus: SelectingPointStatus.inputing,

                startPointInputActive: true,
                finalPointInputActive: false,

                startPointStatusText: "определение текущего местоположения...",
                startPointStatus: SelectingPointStatus.waiting
            };
        }
        else {
            this.state = {
                startPointSearchInputValue: SelectPointsBlock.lastInputedStartPointSearchValue,
                finalPointSearchInputValue: SelectPointsBlock.lastInputedFinalPointSearchValue,

                //formBackgroundColor: '#ffffff',

                startPointStatusText: '',
                finalPointStatusText: '',

                startPointStatus: SelectingPointStatus.inputing,
                finalPointStatus: SelectingPointStatus.inputing,

                startPointInputActive: false,
                finalPointInputActive: false,

                //startPointStatusText: "определение текущего местоположения...",
                //startPointStatus: SelectingPointStatus.waiting
            };
        }
        this.updateStartPointSearchInputValue = this.updateStartPointSearchInputValue.bind(this);
        this.updateFinalPointSearchInputValue = this.updateFinalPointSearchInputValue.bind(this);
        this.findStartPoint = this.findStartPoint.bind(this);
        this.findFinalPoint = this.findFinalPoint.bind(this);
        this.changeEditStartPointEnabledStatus = this.changeEditStartPointEnabledStatus.bind(this);
        this.changeEditFinalPointEnabledStatus = this.changeEditFinalPointEnabledStatus.bind(this);
        this.trySetCurrentPositionAsStartPoint = this.trySetCurrentPositionAsStartPoint.bind(this);
        this.trySetCurrentPositionAsFinalPoint = this.trySetCurrentPositionAsFinalPoint.bind(this);
        this.setStartOptimalRoutePoint = this.setStartOptimalRoutePoint.bind(this);
        this.setFinalOptimalRoutePoint = this.setFinalOptimalRoutePoint.bind(this);

        this.enableStartPointInputing = this.enableStartPointInputing.bind(this);
        this.enableFinalPointInputing = this.enableFinalPointInputing.bind(this);

        if(AppClient.startOptimalRoutePoint == null && localStorage["canUseGeolocation"]) this.trySetCurrentPositionAsStartPoint();
    }
    enableStartPointInputing(){
        this.setState({
            startPointInputActive: true
        });
    }
    enableFinalPointInputing(){
        this.setState({
            finalPointInputActive: true
        });
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
        this.setState({
            startPointStatusText: "определение текущего местоположения...",
            startPointStatus: SelectingPointStatus.waiting
        });
        localStorage["canUseGeolocation"] = true;
        //if(AppClient.myCurrentFindedPosition != null) return;

        /*this.setState({
            startPointStatusText: "определение текущего местоположения...",
            startPointStatus: SelectingPointStatus.waiting
        });*/

        AppClient.myCurrentFindedPosition = await AppClient.findCurrentDestinationCoords();
        if (AppClient.myCurrentFindedPosition != null) {
            this.setStartOptimalRoutePoint(AppClient.myCurrentFindedPosition, /*"текущее местоположение (рядом с " +*/ localStorage["lastCnownPositionCoordsDescription"] /*+ ")"*/);
        }
        else {
            this.setState({
                startPointStatusText: '',
                startPointStatus: SelectingPointStatus.inputing
            });
        }
    }
    async trySetCurrentPositionAsFinalPoint() {
        this.setState({
            finalPointStatusText: "определение текущего местоположения...",
            finalPointStatus: SelectingPointStatus.waiting
        });
        localStorage["canUseGeolocation"] = true;
        //if(AppClient.myCurrentFindedPosition != null) return;

        /*this.setState({
            startPointStatusText: "определение текущего местоположения...",
            startPointStatus: SelectingPointStatus.waiting
        });*/

        AppClient.myCurrentFindedPosition = await AppClient.findCurrentDestinationCoords();
        if (AppClient.myCurrentFindedPosition != null) {
            this.setFinalOptimalRoutePoint(AppClient.myCurrentFindedPosition, /*"текущее местоположение (рядом с " +*/ localStorage["lastCnownPositionCoordsDescription"] /*+ ")"*/);
        }
        else {
            this.setState({
                startPointStatusText: '',
                startPointStatus: SelectingPointStatus.inputing
            });
        }
    }
    async findStartPoint() {
        this.setState({
            startPointStatusText: 'поиск...',
            startPointStatus: SelectingPointStatus.waiting
        });
        const searchQueryStr = this.state.startPointSearchInputValue.toString();
        const findedPoints = await AppClient.findPointsByOsmGeocodingApi(searchQueryStr);
        
        if (findedPoints != null) {
            const firstFindedPoint = findedPoints[0];
            this.setStartOptimalRoutePoint(firstFindedPoint.coords, firstFindedPoint.description);
        }
        else {
            AppClient.startOptimalRoutePoint = null;
            this.setState({
                startPointStatusText: '',
                startPointStatus: SelectingPointStatus.inputing
            });
            this.tryGoToAdvancedParamsAndButton();
            alert("К сожалению, не удалось что-то найти по вашему запросу.");
        }
    }
    async findFinalPoint() {
        this.setState({
            finalPointStatusText: 'поиск...',
            finalPointStatus: SelectingPointStatus.waiting
        });
        const searchQueryStr = this.state.finalPointSearchInputValue.toString();
        const findedPoints = await AppClient.findPointsByOsmGeocodingApi(searchQueryStr);
        
        if (findedPoints != null) {
            const firstFindedPoint = findedPoints[0];
            this.setFinalOptimalRoutePoint(firstFindedPoint.coords, firstFindedPoint.description);
        }
        else {
            AppClient.finalOptimalRoutePoint = null;
            this.setState({
                finalPointStatusText: '',
                finalPointStatus: SelectingPointStatus.inputing
            });
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
                    startPointStatus: SelectingPointStatus.selected,
                    startPointInputActive: true
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
                    finalPointStatus: SelectingPointStatus.selected,
                    finalPointInputActive: true
                });
            }
            this.tryGoToAdvancedParamsAndButton();
        }
    }
    tryGoToAdvancedParamsAndButton() {
        if(AppClient.startOptimalRoutePoint != null && AppClient.finalOptimalRoutePoint != null) {
            this.setState({
                //formBackgroundColor: "#baff91"
            });
            this.props.onSelected();
        }
    }



    render() {
        //const pointsHistory = await PointsHistoryStorage.getAllPoints();
        //console.log(pointsHistory);
        let startPointBlock = 'Error...';
        if (this.state.startPointStatus === SelectingPointStatus.waiting) {
            
                    /*<label>
                        <span>Начальная точка: </span>
                        <span id="startPointStatusText">{this.state.startPointStatusText}</span>
                        <span id="startPointBlockButtonChange">(<a href="#" onClick={this.changeEditStartPointEnabledStatus}>изменить</a>)</span>
                    </label>*/
            startPointBlock = (
                <div>
                    
                    <div className="input-group" onClick={this.changeEditStartPointEnabledStatus}>
                        <span className="input-group-addon" style={{cursor:'pointer'}}>A</span>
                        <div className="progress-bar progress-bar-striped active waiting-gps with-rigth-border-radius" style={{cursor:'pointer'}}>{this.state.startPointStatusText}</div>
                        
                    </div>
                </div>
            );
        }
        else if (this.state.startPointStatus === SelectingPointStatus.selected) {
            
                    /*<label>
                        <span>Начальная точка: </span>
                        <span id="startPointStatusText">{this.state.startPointStatusText}</span>
                        <span id="startPointBlockButtonChange">(<a href="#" onClick={this.changeEditStartPointEnabledStatus}>изменить</a>)</span>
                    </label>
                    
                    <div className="input-group-btn">
                        <button onClick={this.changeEditStartPointEnabledStatus} className="btn btn-default" type="button"><i className="glyphicon glyphicon-edit"></i></button>
                    </div>*/
            startPointBlock = (
                <div>
                    <div className="input-group" onClick={this.changeEditStartPointEnabledStatus}>
                        <span className="input-group-addon" style={{cursor:'pointer'}}>A</span>
                        <input type="text" className="form-control" style={{cursor:'pointer'}} disabled value={this.state.startPointStatusText} name="search"/>
                        
                    </div>
                </div>
            );
        }
        else if (this.state.startPointStatus === SelectingPointStatus.inputing) {
            // if (!('onLine' in navigator) || navigator.onLine === true) //...
            var self = this;
            var onSubmitEvent = function(e){
                e.preventDefault();
                self.findStartPoint();
            }
            var pointsHistoryBlock = "", buttonSearch = "";
            var inputForStartPoint = "", buttonForStartPoint = "";
            if (this.state.startPointInputActive){
                inputForStartPoint = (
                    <input 
                        id="menu1" data-toggle="dropdown"
                        type="text" 
                        className="form-control" 
                        placeholder="Адрес или название места" 
                        value={this.state.startPointSearchInputValue}
                        onChange={this.updateStartPointSearchInputValue}
                        name={"search_point"+(new Date).getTime()}
                    />
                );
                pointsHistoryBlock = (
                    <PointsHistoryBlock 
                        filter={this.state.startPointSearchInputValue} 
                        setPointHandler={this.setStartOptimalRoutePoint}
                    />
                );
                buttonSearch = (
                    <button className="btn btn-default" type="button" onClick={this.findStartPoint}>
                        <i className="glyphicon glyphicon-search"></i>
                    </button>
                );
            }
            else {
                buttonForStartPoint = (
                    <span className="point-input">
                        <button onClick={this.enableStartPointInputing} className="btn btn-default dropdown-toggle for-point-input" type="button">
                            <span className="caret"></span>
                            Адрес или название места
                        </button>
                    </span>
                );
            }
            startPointBlock = (
                <div className="inForm">
                    <form onSubmit={onSubmitEvent}>
                    <div className="input-group">
                        <span className="input-group-addon">A</span>
                        {inputForStartPoint}
                        {buttonForStartPoint}
                        <div className="input-group-btn">
                            
                            <button className="btn btn-default with-gps-icon" type="button" onClick={this.trySetCurrentPositionAsStartPoint}>
                                <i className="glyphicon glyphicon-gps"><img src="../images/gps.png"/></i>
                            </button>
                            {buttonSearch}
                        </div>
                    </div>
                    </form>
                    {pointsHistoryBlock}
                </div>
            );
        }
        let finalPointBlock = 'Error...';
        if (this.state.finalPointStatus === SelectingPointStatus.waiting) {
            
                    /*<label>
                        <span>Начальная точка: </span>
                        <span id="startPointStatusText">{this.state.startPointStatusText}</span>
                        <span id="startPointBlockButtonChange">(<a href="#" onClick={this.changeEditStartPointEnabledStatus}>изменить</a>)</span>
                    </label>*/
            finalPointBlock = (
                <div>
                    
                    <div className="input-group" onClick={this.changeEditFinalPointEnabledStatus}>
                        <span className="input-group-addon" style={{cursor:'pointer'}}>B</span>
                        <div className="progress-bar progress-bar-striped active waiting-gps with-rigth-border-radius" style={{cursor:'pointer'}}>{this.state.finalPointStatusText}</div>
                        
                    </div>
                </div>
            );
        }
        else if (this.state.finalPointStatus === SelectingPointStatus.selected) {
            /*
            <label>
                <span>Конечная точка: </span>
                <span id="finalPointStatusText">{this.state.finalPointStatusText}</span>
                <span id="finalPointBlockButtonChange">(<a href="#" onClick={this.changeEditFinalPointEnabledStatus}>изменить</a>)</span>
            </label>

            <div className="input-group-btn">
                <button onClick={this.changeEditFinalPointEnabledStatus} className="btn btn-default" type="button"><i className="glyphicon glyphicon-edit"></i></button>
            </div>
            */
            finalPointBlock = (
                
                <div className="input-group" onClick={this.changeEditFinalPointEnabledStatus}>
                    <span className="input-group-addon" style={{cursor:'pointer'}}>B</span>
                    <input type="text" className="form-control" style={{cursor:'pointer'}} disabled value={this.state.finalPointStatusText} name="search"/>
                    
                </div>
            );
        }
        else if (this.state.finalPointStatus === SelectingPointStatus.inputing) {
            // if (!('onLine' in navigator) || navigator.onLine === true) //...
            var self = this;
            var onSubmitEvent = function(e){
                e.preventDefault();
                self.findFinalPoint();
            }
            var pointsHistoryBlock = "", buttonSearch = "";
            var inputForFinalPoint = "", buttonForFinalPoint = "";
            if (this.state.finalPointInputActive){
                inputForFinalPoint = (
                    <input 
                        id="menu1" data-toggle="dropdown"
                        type="text" 
                        className="form-control with-dropdown" 
                        placeholder="Адрес или название места" 
                        value={this.state.finalPointSearchInputValue}
                        onChange={this.updateFinalPointSearchInputValue}
                        name={"search_point"+(new Date).getTime()}
                    />
                );
                pointsHistoryBlock = (
                    <PointsHistoryBlock 
                        filter={this.state.finalPointSearchInputValue} 
                        setPointHandler={this.setFinalOptimalRoutePoint}
                    />
                );
                buttonSearch = (
                    <button className="btn btn-default" type="button" onClick={this.findFinalPoint}>
                        <i className="glyphicon glyphicon-search"></i>
                    </button>
                );
            }
            else {
                buttonForFinalPoint = (
                    <span className="point-input">
                        <span onClick={this.enableFinalPointInputing} className="btn btn-default dropdown-toggle for-point-input">
                            <span className="caret"></span>
                            Адрес или название места
                        </span>
                    </span>
                );
            }
            finalPointBlock = (
                <div className="inForm">
                    <form onSubmit={onSubmitEvent}>
                    <div className="input-group">
                        <span className="input-group-addon">B</span>
                        
                        {inputForFinalPoint}
                        {buttonForFinalPoint}
                        <span className="is-dropdown" onClick={this.updateFinalPointSearchInputValue}></span>
                        <div className="input-group-btn">
                            
                            <button className="btn btn-default with-gps-icon" type="button" onClick={this.trySetCurrentPositionAsFinalPoint}>
                                <i className="glyphicon glyphicon-gps"><img src="../images/gps.png"/></i>
                            </button>
                            {buttonSearch}
                            
                        </div>
                    </div>
                    </form>
                    <div id="for-final-point-history">
                        {pointsHistoryBlock}
                    </div> 
                </div>
            );
        }
        //style={{backgroundColor: this.state.formBackgroundColor}}
        //<form action="#"></form>
        return(
            <div id="start-final_points">
                <p>Сведения о прокладываемом маршруте:</p>
                
                <div style={{paddingBottom: '6px'}}>{startPointBlock}</div>
                <div style={{paddingBottom: '6px'}}>{finalPointBlock}</div>
                
            </div>
        );
    }
}

export default SelectPointsBlock;