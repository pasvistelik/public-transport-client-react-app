import React, { Component } from 'react';
import './styles/style.css';

//import './scripts/jquery/jquery-3.2.0.min';
//import AppClientVisualization from './modules/client/client_visualization.js';
import $ from 'jquery';
import AppClient from './modules/client/client';

class MyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startPointSearchInputValue: '',
      finalPointSearchInputValue: '',

      busChecked: true,
      trolleybusChecked: true,
      express_busChecked: false,
      marshChecked: false,
      tramChecked: false,
      metroChecked: false,
      selectedTime: "12:00",
      selectedGoingSpeed: 5,
      selectedReservedTime: 2,

      totalTimePercentValue: 1,
      totalGoingTimePercentValue: 0.5,
      totalTransportChangingCountPercentValue:0.05
    };
    this.updateStartPointSearchInputValue = this.updateStartPointSearchInputValue.bind(this);
    this.updateFinalPointSearchInputValue = this.updateFinalPointSearchInputValue.bind(this);
    this.updateTotalTimePercentValue = this.updateTotalTimePercentValue.bind(this);
    this.updateTotalGoingTimePercentValue = this.updateTotalGoingTimePercentValue.bind(this);
    this.updateTotalTransportChangingCountPercentValue = this.updateTotalTransportChangingCountPercentValue.bind(this);
    this.findStartPoint = this.findStartPoint.bind(this);
    this.findFinalPoint = this.findFinalPoint.bind(this);
    this.countWay = this.countWay.bind(this);
    this.customizeFindedOptimalWays = this.customizeFindedOptimalWays.bind(this);
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
      this.goToAdvancedParamsAndButton();
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
      this.goToAdvancedParamsAndButton();
      alert("К сожалению, не удалось что-то найти по вашему запросу.");
    }
  }
  render() {
    if (AppClient.isCountWayButtonClicked() && AppClient.isStartFinalPointsSelected()){
      return(null);
    }
    else{
      this.trySetCurrentPositionAsStartPoint();
      return(
        <div>
          <div id="start-final_points">
            <p>Сведения о прокладываемом маршруте:</p>
            <div>
              <form action="#">
                <label>Начальная точка: <span id="startPointStatusText"></span><span id="startPointBlockButtonChange">(<a href="#" onClick={this.enableEditStartPoint}>изменить</a>)</span><input name="startPointSearch" value={this.state.startPointSearchInputValue} onChange={this.updateStartPointSearchInputValue} type="text"/></label><input name="startPointSearchButton" type="button" value="Найти" onClick={this.findStartPoint}/>
                <label>Конечная точка: <span id="finalPointStatusText"></span><span id="finalPointBlockButtonChange">(<a href="#" onClick={this.enableEditFinalPoint}>изменить</a>)</span><input name="finalPointSearch" value={this.state.finalPointSearchInputValue} onChange={this.updateFinalPointSearchInputValue} type="text"/></label><input name="finalPointSearchButton" type="button" value="Найти" onClick={this.findFinalPoint}/>
              </form>
            </div>
          </div>
          <div id="advanced_params_and_button">
            <details id="start_route">
              <summary>Дополнительные параметры построения маршрута</summary>
              <div>
                <form action="#">
                  <label>
                      Виды транспорта:
                  </label>
                  <label className="checkbox_elem"><input name="transportType" type="checkbox" value="bus"/> Автобус</label>
                  <label className="checkbox_elem"><input name="transportType" type="checkbox" value="trolleybus"/> Троллейбус</label>
                  <label className="checkbox_elem"><input name="transportType" type="checkbox" value="express_bus"/> Экспресс-автобус</label>
                  <label className="checkbox_elem"><input name="transportType" disabled type="checkbox" value="marsh"/> Маршрутка</label>
                  <label className="checkbox_elem"><input name="transportType" disabled type="checkbox" value="tram"/> Трамвай</label>
                  <label className="checkbox_elem"><input name="transportType" disabled type="checkbox" value="metro"/> Метро</label>

                  <label>Время отправки: <input name="time" type="time" defaultValue="12:00"/></label>
                  <label className="block_elem">Going speed: <input name="goingSpeed" type="range" min="2" max="10" step="0.5" defaultValue="5"/></label>
                  <label className="block_elem">Reserved time: <input name="reservedTime" type="range" min="0" max="5" step="0.5" defaultValue="2"/></label>
                </form>
              </div>
            </details>
            <form id="buttonCountWay" action="#">
              <input className="checkbox_elem" type="button" value="Проложить маршрут" onClick={this.countWay}/>
            </form>
          </div>
          <div>
        <div id="waiting_route">
          <p>Идет поиск маршрута. Подождите немного...</p>
        </div>
        <div id="customization">
          <form action="#"><input className="block_elem" type="button" value="Назад" onClick={this.goToAdvancedParamsAndButton}/></form>
          <details id="customize">
            <summary>Customization</summary>
            <div>
              <form action="#">
                <label>
                  Уровни значимости по критериям:
                  <label className="block_elem"><input name="totalTimePercent" onInput={this.customizeFindedOptimalWays} type="range" min="0" max="1" step="0.05" value={this.state.totalTimePercentValue} onChange={this.updateTotalTimePercentValue}/>Минимум времени</label>
                  <label className="block_elem"><input name="totalGoingTimePercent" onInput={this.customizeFindedOptimalWays} type="range" min="0" max="1" step="0.05" value={this.state.totalGoingTimePercentValue} onChange={this.updateTotalGoingTimePercentValue}/>Минимум ходьбы</label>
                  <label className="block_elem"><input name="totalTransportChangingCountPercent" onInput={this.customizeFindedOptimalWays} type="range" min="0" max="1" step="0.05" value={this.state.totalTransportChangingCountPercentValue} onChange={this.updateTotalTransportChangingCountPercentValue}/>Минимум пересадок</label>
                </label>
              </form>
            </div>
          </details>
        </div>
        <div id="results">
          <p>Найденные пути:</p>
          <div id="customization_result">(...result...)</div>
        </div>
      </div>
        </div>
      );
    }
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
  updateTotalTimePercentValue(evt) {
    this.setState({
      totalTimePercentValue: evt.target.value
    });
  }
  updateTotalGoingTimePercentValue(evt) {
    this.setState({
      totalGoingTimePercentValue: evt.target.value
    });
  }
  updateTotalTransportChangingCountPercentValue(evt) {
    this.setState({
      totalTransportChangingCountPercentValue: evt.target.value
    });
  }

  
  async countWay() {
        AppClient.countWayButtonClicked = true;
        $("#start-final_points").css("display", "none");
        $("#start_route").css("display", "none");
        $("#buttonCountWay").css("display", "none");
        $("#waiting_route").css("display", "inherit");
        var types = [];
        if(this.state.busChecked) types.push("bus");
        if(this.state.trolleybusChecked) types.push("trolleybus");
        $("input:checkbox[name=transportType]:checked").each(function () {
            types.push($(this).val());
        });


        var tmpMyDate = new Date();

        var myStartTimeStr = this.state.selectedTime.toString();
        AppClient.myStartTime = AppClient.strToSeconds(myStartTimeStr);
        var test1 = tmpMyDate.getHours() * 3600 + (tmpMyDate.getMinutes() + 1) * 60;
        var test = test1 - AppClient.myStartTime;
        if (test > 1 && test < 600) AppClient.myStartTime = test1;

        var hoursStr = tmpMyDate.getHours().toString();
        if (hoursStr.length == 1) hoursStr = "0" + hoursStr;
        var minutesStr = tmpMyDate.getMinutes().toString();
        if (minutesStr.length == 1) minutesStr = "0" + minutesStr;
        myStartTimeStr = hoursStr + ":" + minutesStr;

        AppClient.my_speed = this.state.selectedGoingSpeed;
        AppClient.my_dopTimeMinutes = this.state.selectedReservedTime;

        var fromPositionStr = AppClient.startOptimalRoutePoint.lat + "," + AppClient.startOptimalRoutePoint.lng;
        var toPositionStr = AppClient.finalOptimalRoutePoint.lat + "," + AppClient.finalOptimalRoutePoint.lng;
        var typesStr = (types == null || types.length == 0) ? null : types[0];
        for (var i = 1, n = types.length; i < n; i++) typesStr += "," + types[i];

        var paramsStr = "from=" + fromPositionStr + "&to=" + toPositionStr + "&startTime=" + myStartTimeStr + "&dopTimeMinutes=" + AppClient.my_dopTimeMinutes + "&goingSpeed=" + AppClient.my_speed + "&transportTypes=" + typesStr;



        console.log("Start finding oprimal routes. Params: " + paramsStr);
        
        await AppClient.findWays(fromPositionStr, toPositionStr, myStartTimeStr, AppClient.my_dopTimeMinutes, AppClient.my_speed, typesStr);
        this.customizeFindedOptimalWays();

        $("#waiting_route").css("display", "none");
        $("#customization").css("display", "block");
        $("#results").css("display", "block");

    }
    async trySetCurrentPositionAsStartPoint() {
        if(AppClient.myCurrentFindedPosition != null) return;
        $("input[name=startPointSearch]").css({ "display": "none" });
        $("input[name=startPointSearchButton]").css({ "display": "none" });

        $("#startPointStatusText").text("определение текущего местоположения...");

        AppClient.myCurrentFindedPosition = await AppClient.findCurrentDestinationCoords();
        if (AppClient.myCurrentFindedPosition != null) {
            this.setStartOptimalRoutePoint(AppClient.myCurrentFindedPosition, "текущее местоположение (рядом с " + localStorage["lastCnownPositionCoordsDescription"] + ")");

            $("#startPointBlockButtonChange").css({ "display": "inline-block" });
        }
        else {
            $("#startPointStatusText").text("");
            $("#startPointBlockButtonChange").css({ "display": "none" });
            $("input[name=startPointSearch]").css({ "display": "block" });
            $("input[name=startPointSearchButton]").css({ "display": "block" });
        }
    }
    
    enableEditStartPoint() {
        $("#startPointBlockButtonChange").css({ "display": "none" });
        $("input[name=startPointSearch]").css({ "display": "block" });
        $("input[name=startPointSearchButton]").css({ "display": "block" });
    }
    enableEditFinalPoint() {
        $("#finalPointBlockButtonChange").css({ "display": "none" });
        $("input[name=finalPointSearch]").css({ "display": "block" });
        $("input[name=finalPointSearchButton]").css({ "display": "block" });
    }

    setStartOptimalRoutePoint(currentLatLng, strReq) {
        if (strReq !== undefined) {
            $("#startPointStatusText").text(strReq);
            $("input[name=startPointSearch]").css({ "display": "none" });
            $("input[name=startPointSearchButton]").css({ "display": "none" });
            $("#startPointBlockButtonChange").css({ "display": "inline-block" });
        }
        if (currentLatLng != null) {
            AppClient.startOptimalRoutePoint = currentLatLng;
            this.goToAdvancedParamsAndButton();
        }
    }
    setFinalOptimalRoutePoint(currentLatLng, strReq) {
        if (strReq !== undefined) {
            $("#finalPointStatusText").text(strReq);
            $("input[name=finalPointSearch]").css({ "display": "none" });
            $("input[name=finalPointSearchButton]").css({ "display": "none" });
            $("#finalPointBlockButtonChange").css({ "display": "inline-block" });
        }
        if (currentLatLng != null) {
            AppClient.finalOptimalRoutePoint = currentLatLng;
            this.goToAdvancedParamsAndButton();
        }
    }

    goToAdvancedParamsAndButton() {
        AppClient.countWayButtonClicked = false;
        if (AppClient.startOptimalRoutePoint != null && AppClient.finalOptimalRoutePoint != null) {

            $("#advanced_params_and_button").css({ "display": "block" });

            $("#customization").css("display", "none");
            $("#results").css("display", "none");
            $("#start-final_points").css({ "display": "block" });
            $("#advanced_params_and_button").css({ "display": "block" });
            $("#buttonCountWay").css("display", "block");
            $("#start_route").css("display", "block");

            var tmpMyDate = new Date();
            var hoursStr = tmpMyDate.getHours().toString();
            if (hoursStr.length == 1) hoursStr = "0" + hoursStr;
            var minutesStr = tmpMyDate.getMinutes().toString();
            if (minutesStr.length == 1) minutesStr = "0" + minutesStr;
            $("input[name=time]").val(hoursStr + ":" + minutesStr);

            $("#start-final_points").css({ "background-color": "#baff91" });

        }
    }



    customizeFindedOptimalWays() {
      
        var totalTimePercentValue = this.state.totalTimePercentValue;
        var totalGoingTimePercentValue = this.state.totalGoingTimePercentValue;
        var totalTransportChangingCountPercentValue = this.state.totalTransportChangingCountPercentValue;
        AppClient.customizeFindedOptimalWaysStart(totalTimePercentValue, totalGoingTimePercentValue, totalTransportChangingCountPercentValue);
        $('#customization_result').text("");
        for (var i = 0, n = AppClient.sortedArr.length, sortedIndex = AppClient.sortedArr[0]; i < n; sortedIndex = AppClient.sortedArr[++i]) {
            this.addFindedWayToList(AppClient.findedOptimalWays[sortedIndex]);
        }
    }

    //customizeFindedOptimalWays();

    addFindedWayToList(currentWay) {//, minimalTimeSeconds, minimalGoingTimeSeconds, minimalTransportChangingCount


        $('#customization_result').append($('<div/>'));
        var myDiv = $('#customization_result div:last-child');

        var tmpTotalTimeSecondsEffictivity = (AppClient.minimalTimeSeconds / parseFloat(currentWay.totalTimeSeconds) * 100).toFixed(0);
        var tmpTotalGoingTimeSecondsEffictivity = (AppClient.minimalGoingTimeSeconds / parseFloat(currentWay.totalGoingTimeSeconds) * 100).toFixed(0);
        var tmpTransportChangingCountEffictivity = (parseFloat(currentWay.totalTransportChangingCount) == 0 ? 100 : (AppClient.minimalTransportChangingCount / parseFloat(currentWay.totalTransportChangingCount)) * 100).toFixed(0);

        var p1 = $('<span/>', { text: tmpTotalTimeSecondsEffictivity.toString() + "%", title: 'TotalTimeSecondsEffictivity' });
        var p2 = $('<span/>', { text: tmpTotalGoingTimeSecondsEffictivity.toString() + "%", title: 'TotalGoingTimeSecondsEffictivity' });
        var p3 = $('<span/>', { text: tmpTransportChangingCountEffictivity.toString() + "%", title: 'TransportChangingCountEffictivity' });

        if (tmpTotalTimeSecondsEffictivity > 85) p1.addClass("effectivityPercentGold");
        else if (tmpTotalTimeSecondsEffictivity > 50) p1.addClass("effectivityPercentPlatinum");
        else p1.addClass("effectivityPercentSilver");

        if (tmpTotalGoingTimeSecondsEffictivity > 85) p2.addClass("effectivityPercentGold");
        else if (tmpTotalGoingTimeSecondsEffictivity > 50) p2.addClass("effectivityPercentPlatinum");
        else p2.addClass("effectivityPercentSilver");

        if (tmpTransportChangingCountEffictivity > 85) p3.addClass("effectivityPercentGold");
        else if (tmpTransportChangingCountEffictivity > 50) p3.addClass("effectivityPercentPlatinum");
        else p3.addClass("effectivityPercentSilver");

        myDiv.append(p1);
        myDiv.append(p2);
        myDiv.append(p3);

        myDiv.addClass("resultLink");
        /*myDiv.click(function () {
            setWayViewLine(currentWay);
        });*/
        for (var i = 1; i < currentWay.points.length; i++) {
            var my_text = "";
            if (currentWay.points[i].route == null) {
                if (currentWay.points[i].station == null) my_text = "Идите пешком к пункту назначения.";
                else {
                    my_text = "Идите к остановке \"";
                    if (currentWay.points[i].station.name.toString() != "") my_text += currentWay.points[i].station.name.toString();
                    else my_text += currentWay.points[i].station.name.toString();
                    my_text += "\"";
                }
            }
            else {
                if (i + 1 < currentWay.points.length && currentWay.points[i + 1].route != null && currentWay.points[i].route.type == currentWay.points[i + 1].route.type && currentWay.points[i].route.number == currentWay.points[i + 1].route.number) continue;
                my_text = "Доедьте до остановки \"";
                if (currentWay.points[i].station.name.toString() != "") my_text += currentWay.points[i].station.name.toString();
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


            myDiv.append(
                $('<li/>').append(
                    $('<span/>', {
                        css: {
                            cursor: 'pointer',
                        },
                        text: my_text
                    })
                )
            );
        }
    }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div id="application">
          <p>
            <b>PublicTransportProject</b> - поиск наилучшего маршрута на общественном транспорте. {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div id="content">
          <div id="my_elements">
            <MyApp/>
          </div>
        </div>
      </div>
    );
  }


}

export default App;
