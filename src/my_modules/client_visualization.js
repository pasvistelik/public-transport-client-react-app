'use strict';

var startOptimalRoutePoint = null;
var finalOptimalRoutePoint = null;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Client visualization.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var myCurrentFindedPosition = null;
if (navigator.geolocation) {
    $("input[name=startPointSearch]").css({ "display": "none" });
    $("input[name=startPointSearchButton]").css({ "display": "none" });

    $("#startPointStatusText").text("определение текущего местоположения...");
    navigator.geolocation.getCurrentPosition(function (position) {

        var findedLat = parseFloat(position.coords.latitude.toFixed(4));
        var findedLng = parseFloat(position.coords.longitude.toFixed(4));
        var positionDescription = findedLat + ", " + findedLng;
        $("#startPointStatusText").text("текущее местоположение (" + positionDescription + ")");

        //fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + findedLat + "," + findedLng).then(function (response) {
        //    response.json().then(function (data) {
        //        if (data.results != undefined && data.results.length != 0) {
        //            positionDescription = data.results[0].formatted_address;
        //            $("#startPointStatusText").text("выбрано текущее местоположение (рядом с " + positionDescription + ")");
        //        }
        //    });
        //});

        localStorage["lastCnownPositionCoords"] = findedLat + "," + findedLng;

        fetch("https://nominatim.openstreetmap.org/search?format=json&q=" + findedLat + "," + findedLng).then(function (response) {
            response.json().then(function (data) {
                if (data != null && data.length != 0) {
                    positionDescription = data[0].display_name;
                    $("#startPointStatusText").text("выбрано текущее местоположение (рядом с " + positionDescription + ")");
                }
            });
        });

        $("#startPointBlockButtonChange").css({ "display": "inline-block" });

        myCurrentFindedPosition = { lat: findedLat, lng: findedLng };

        setStartOptimalRoutePoint(myCurrentFindedPosition);

    }, function (err) {
        $("#startPointStatusText").text("");
        $("#startPointBlockButtonChange").css({ "display": "none" });
        $("input[name=startPointSearch]").css({ "display": "block" });
        $("input[name=startPointSearchButton]").css({ "display": "block" });
    });
}

function enableEditStartPoint() {
    $("#startPointBlockButtonChange").css({ "display": "none" });
    $("input[name=startPointSearch]").css({ "display": "block" });
    $("input[name=startPointSearchButton]").css({ "display": "block" });
}
function enableEditFinalPoint() {
    $("#finalPointBlockButtonChange").css({ "display": "none" });
    $("input[name=finalPointSearch]").css({ "display": "block" });
    $("input[name=finalPointSearchButton]").css({ "display": "block" });
}

function setStartOptimalRoutePoint(currentLatLng, strReq) {
    if (strReq != undefined) {
        $("#startPointStatusText").text(strReq);
        $("input[name=startPointSearch]").css({ "display": "none" });
        $("input[name=startPointSearchButton]").css({ "display": "none" });
        $("#startPointBlockButtonChange").css({ "display": "inline-block" });
    }
    //$("#start_route").css("display", "none");
    //if (startOptimalRoutePoint != null) startOptimalRoutePoint.setMap(null);
    if (currentLatLng != null) {
        startOptimalRoutePoint = currentLatLng;
        //startOptimalRoutePoint = new google.maps.Marker({
        //    position: currentLatLng,
        //    title: 'Начальная точка маршрута',
        //    label: 'A',
        //    draggable: true
        //});
        //startOptimalRoutePoint.addListener('dragend', function () { tryCountOptimalRoute(); });
        //startOptimalRoutePoint.setMap(map);
        //map.setCenter(currentLatLng);
        tryCountOptimalRoute();
    }
}
function setFinalOptimalRoutePoint(currentLatLng, strReq) {
    if (strReq != undefined) {
        $("#finalPointStatusText").text(strReq);
        $("input[name=finalPointSearch]").css({ "display": "none" });
        $("input[name=finalPointSearchButton]").css({ "display": "none" });
        $("#finalPointBlockButtonChange").css({ "display": "inline-block" });
    }
    //$("#start_route").css("display", "none");
    //if (finalOptimalRoutePoint != null) finalOptimalRoutePoint.setMap(null);
    if (currentLatLng != null) {
        finalOptimalRoutePoint = currentLatLng;
        //finalOptimalRoutePoint = new google.maps.Marker({
        //    position: currentLatLng,
        //    title: 'Конечная точка маршрута',
        //    label: 'B',
        //    draggable: true
        //});
        //finalOptimalRoutePoint.addListener('dragend', function () { tryCountOptimalRoute(); });
        //finalOptimalRoutePoint.setMap(map);
        //map.setCenter(currentLatLng);
        tryCountOptimalRoute();
    }
}

function tryCountOptimalRoute() {
    if (startOptimalRoutePoint != null && finalOptimalRoutePoint != null) {

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

        //var southWest;// = new google.maps.LatLng(36.90731625763393, -86.51778523864743);
        //var northEast;// = new google.maps.LatLng(37.02763411292923, -86.37183015289304);

        ////alert(JSON.stringify(startOptimalRoutePoint.getPosition()).toString());
        //if (startOptimalRoutePoint.getPosition().lat() > finalOptimalRoutePoint.getPosition().lat()) {
        //    if (startOptimalRoutePoint.getPosition().lng() > finalOptimalRoutePoint.getPosition().lng()) {
        //        northEast = startOptimalRoutePoint.getPosition();
        //        southWest = finalOptimalRoutePoint.getPosition();
        //    }
        //    else {

        //        northEast = new google.maps.LatLng(startOptimalRoutePoint.getPosition().lat(), finalOptimalRoutePoint.getPosition().lng());
        //        southWest = new google.maps.LatLng(finalOptimalRoutePoint.getPosition().lat(), startOptimalRoutePoint.getPosition().lng());
        //    }
        //}
        //else {
        //    if (startOptimalRoutePoint.getPosition().lng() > finalOptimalRoutePoint.getPosition().lng()) {
        //        southWest = finalOptimalRoutePoint.getPosition();
        //        northEast = startOptimalRoutePoint.getPosition();
        //    }
        //    else {
        //        southWest = new google.maps.LatLng(finalOptimalRoutePoint.getPosition().lat(), startOptimalRoutePoint.getPosition().lng());
        //        northEast = new google.maps.LatLng(startOptimalRoutePoint.getPosition().lat(), finalOptimalRoutePoint.getPosition().lng());
        //    }
        //}
        ///*if (canRealTimeRecounting) {
        //    countWay(false);
        //}*/
        ////else {
        ///*var bounds = new google.maps.LatLngBounds(startOptimalRoutePoint.getPosition(), finalOptimalRoutePoint.getPosition());
        //map.fitBounds(bounds);*/
        //var today = new Date();
        //var h = today.getHours();
        //var m = today.getMinutes();
        //var strH;
        //if (h < 10) strH = "0" + h.toString();
        //else strH = h.toString();
        //var strM;
        //if (m < 10) strM = "0" + m.toString();
        //else strM = m.toString();
        //var timeStr = strH + ":" + strM;
        ////alert(timeStr);
        //$("input[name=time]").val(timeStr);
        ////alert($("input[name=time]").val().toString());
        //$("#start-final_points").css("display", "inherit");
        //$("#start_route").css("display", "inherit");
        //$("#results").css("display", "none");
        //$("#customization").css("display", "none");
        //$('#viev_menu_link').click();

        //if (widthMaximized == true) {
        //    /*$("#map").width('100%');
        //    $("#map").width(($("#map").outerWidth(true) - $("#menu").outerWidth(true)).toString());//!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //    $("#header").width('100%');
        //    $("#header").width(($("#header").outerWidth(false) - $("#menu").outerWidth(true)).toString());*/
        //    widthMaximized = false;
        //}
        ////countOptimalRoute(startOptimalRoutePoint.getPosition(), finalOptimalRoutePoint.getPosition());

        //var bounds = new google.maps.LatLngBounds(southWest, northEast);
        //map.fitBounds(bounds);
        //map.setCenter(new google.maps.LatLng((southWest.lat() + northEast.lat()) / 2, (southWest.lng() + northEast.lng()) / 2));
        ////map.setZoom(map.getZoom() - 1);
        ////}

    }
    else {
        //$("#start_route").css("display", "none");
    }
}

function getPointCoordsFromOsmGeocodingApi(strReq) {
    var deferred = new $.Deferred();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://nominatim.openstreetmap.org/search?q=" + strReq + "&format=json", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status == 200) {
            deferred.resolve(xhr.responseText);
        } else {
            deferred.resolve(JSON.stringify(null));
            //deferred.errback(xhr.statusText);
        }
    }
    xhr.send(null);
    return deferred;
}

function findPoint(inputName, type) {
    var strReq = $("input[name=" + inputName + "]").val().toString();
    //var tmp = getPointCoordsFromGoogleGeocodingApi(strReq);
    var tmp = getPointCoordsFromOsmGeocodingApi(strReq);
    return tmp.done(function (returnedPointsJSON) {
        var allPoints = JSON.parse(returnedPointsJSON.toString());
        //alert(returnedPointsJSON.toString());
        if (allPoints != null && allPoints.length != 0 && (type == "start" || type == "final")) {

            var coords = {
                lat: parseFloat(allPoints[0].lat),
                lng: parseFloat(allPoints[0].lon)
            };
            //var findedName = allPoints[0].display_name;//results[0].formatted_address;
            //$("input[name=" + inputName + "]").val(findedName);
            if (type == "start") setStartOptimalRoutePoint(coords, strReq);
            else setFinalOptimalRoutePoint(coords, strReq);
        }
        else {
            //alert('asddsgfgs');
            if (type == "start") {
                //if (startOptimalRoutePoint != null) startOptimalRoutePoint.setMap(null);
                startOptimalRoutePoint = null;
            }
            else if (type == "final") {
                //if (finalOptimalRoutePoint != null) finalOptimalRoutePoint.setMap(null);
                finalOptimalRoutePoint = null;
            }
            tryCountOptimalRoute();
            alert("К сожалению, не удалось что-то найти по вашему запросу.");
            //$("input[name=" + inputName + "]").val('');
            //return null;
        }
    });
}

function strToSeconds(str) {
    if (str == undefined || str == null) return undefined;
    var tmp = str.split(':');
    var hours = parseInt(tmp[0]);
    var minutes = parseInt(tmp[1]);
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) return 3600 * hours + 60 * minutes;
    else return undefined;
}
function countWay() {
    $("#start-final_points").css("display", "none");
    $("#start_route").css("display", "none");
    $("#buttonCountWay").css("display", "none");
    $("#waiting_route").css("display", "inherit");
    var types = new Array();
    $("input:checkbox[name=transportType]:checked").each(function () {
        types.push($(this).val());
    });


    var tmpMyDate = new Date();

    var myStartTimeStr = $("input[name=time]").val().toString();
    myStartTime = strToSeconds(myStartTimeStr);
    var test1 = tmpMyDate.getHours() * 3600 + (tmpMyDate.getMinutes() + 1) * 60;
    var test = test1 - myStartTime;
    if (test > 1 && test < 600) myStartTime = test1;

    var hoursStr = tmpMyDate.getHours().toString();
    if (hoursStr.length == 1) hoursStr = "0" + hoursStr;
    var minutesStr = tmpMyDate.getMinutes().toString();
    if (minutesStr.length == 1) minutesStr = "0" + minutesStr;
    myStartTimeStr = hoursStr + ":" + minutesStr;

    my_speed = $("input[name=goingSpeed]").val();
    my_dopTimeMinutes = $("input[name=reservedTime]").val();


    //myStartTime = 18 * 3600 + 0 * 60;

    //myStartTime = tmpMyDate.getHours() * 3600 + (tmpMyDate.getMinutes() + 1) * 60;

    var fromPositionStr = startOptimalRoutePoint.lat + "," + startOptimalRoutePoint.lng;
    var toPositionStr = finalOptimalRoutePoint.lat + "," + finalOptimalRoutePoint.lng;
    var typesStr = (types == null || types.length == 0) ? null : types[0];
    for (var i = 1, n = types.length; i < n; i++) typesStr += "," + types[i];

    var paramsStr = "from=" + fromPositionStr + "&to=" + toPositionStr + "&startTime=" + myStartTimeStr + "&dopTimeMinutes=" + my_dopTimeMinutes + "&goingSpeed=" + my_speed + "&transportTypes=" + typesStr;



    console.log("Start finding oprimal routes. Params: " + paramsStr);
    //var startInitializingMoment = Date.now();
    //for (var i = 0; i < 100; i++)

    //var res = OptimalRoute.FindOptimalRoutes(startOptimalRoutePoint, finalOptimalRoutePoint, myStartTime, types, my_speed, my_dopTimeMinutes);
    //findedOptimalWays = res.GetOptimalWays();

    findWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr);
    //console.log("\n\n"+JSON.stringify(res.GetOptimalWays()));
    //console.log("Finded " + findedOptimalWays.length + " optimal routes. Time = " + (Date.now() - startInitializingMoment) + " ms.");

    

    $("#waiting_route").css("display", "none");
    $("#customization").css("display", "block");
    $("#results").css("display", "block");


    //var r = getOptimalWays(startOptimalRoutePoint.getPosition(), finalOptimalRoutePoint.getPosition(), types, $("input[name=time]").val().toString(), $("input[name=reservedTime]").val().toString(), $("input[name=goingSpeed]").val().toString());
    //r.done(function (res33) {
    //    findedOptimalWays = JSON.parse(res33.toString());
    //    $("#waiting_route").css("display", "none");
    //    $("#results").css("display", "inherit");
    //    $("#customization").css("display", "inherit");
    //    customizeFindedOptimalWays(/*totalTimePercent, totalGoingTimePercent, totalTransportChangingCountPercent*/);
    //    //$("#results_only").height(/*($("body").height() - $("#only_customization").outerHeight(true)).toString()*/"200");
    //    /*if (needViewAdvancedMenu != false) */$('#viev_menu_link').click();
    //});
}

function customizeFindedOptimalWays() {
    var totalTimePercentValue = $("input[name=totalTimePercent]").val();
    var totalGoingTimePercentValue = $("input[name=totalGoingTimePercent]").val();
    var totalTransportChangingCountPercentValue = $("input[name=totalTransportChangingCountPercent]").val();
    customizeFindedOptimalWaysStart(totalTimePercentValue, totalGoingTimePercentValue, totalTransportChangingCountPercentValue);
    $('#customization_result').text("");
    for (var i = 0, n = sortedArr.length, sortedIndex = sortedArr[0]; i < n; sortedIndex = sortedArr[++i]) {
        addFindedWayToList(findedOptimalWays[sortedIndex]);
    }
}

//customizeFindedOptimalWays();

function addFindedWayToList(currentWay) {//, minimalTimeSeconds, minimalGoingTimeSeconds, minimalTransportChangingCount


    $('#customization_result').append(jQuery('<div/>'));
    var myDiv = $('#customization_result div:last-child');

    var tmpTotalTimeSecondsEffictivity = (minimalTimeSeconds / parseFloat(currentWay.totalTimeSeconds) * 100).toFixed(0);
    var tmpTotalGoingTimeSecondsEffictivity = (minimalGoingTimeSeconds / parseFloat(currentWay.totalGoingTimeSeconds) * 100).toFixed(0);
    var tmpTransportChangingCountEffictivity = (parseFloat(currentWay.totalTransportChangingCount) == 0 ? 100 : (minimalTransportChangingCount / parseFloat(currentWay.totalTransportChangingCount)) * 100).toFixed(0);

    var p1 = jQuery('<span/>', { text: tmpTotalTimeSecondsEffictivity.toString() + "%", title: 'TotalTimeSecondsEffictivity' });
    var p2 = jQuery('<span/>', { text: tmpTotalGoingTimeSecondsEffictivity.toString() + "%", title: 'TotalGoingTimeSecondsEffictivity' });
    var p3 = jQuery('<span/>', { text: tmpTransportChangingCountEffictivity.toString() + "%", title: 'TransportChangingCountEffictivity' });

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
    myDiv.click(function () {
        /*var result_points = new Array();
        for (var i = 0; i < currentWay.points.length; i++) {
            var nw = new google.maps.LatLng(
                currentWay.points[i].coords.xCoord,
                currentWay.points[i].coords.yCoord
            );
            result_points.push(nw);
        }*/
        //.......................
        setWayViewLine(currentWay);
        //alert("sending data...");
    });
    //alert('saddsfd');
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


        //my_text += " (" + currentWay.points[i].time + ")";
        myDiv.append(
            jQuery('<li/>').append(
                jQuery('<span/>', {
                    css: {
                        cursor: 'pointer',
                    },
                    text: my_text,
                    /*click: function () {
                        //alert("sending data...");
                        var xhr2 = xhrPut(apiPublicTransportServer + "stations/S157A8E088DD", "MY TEXT 123 !%^&*");
                        xhr2.done(function (res2) {
                            //alert(res2.toString());
                            $('#test_t').append(jQuery('<span/>', { text: res2 }));
                        });
                    }*/
                })
            )
        );
        /*var nw = new google.maps.LatLng(
            currentWay.points[i].coords.xCoord,
            currentWay.points[i].coords.yCoord
        );
        var tmpMarker = new google.maps.Marker({
            position: nw,
            map: map,
            //icon: image,
            title: my_text
        });
        tmpMarker.setMap(map);*/
    }
    /*if (wayViewLine != null) wayViewLine.setMap(null);
    wayViewLine = new google.maps.Polyline({
        path: result_points,
        geodesic: true,
        strokeColor: '#FF0000',//#FCD6A4
        strokeOpacity: 1.0,
        strokeWeight: 5
    });
    wayViewLine.setMap(map);
    wayViewLine.addListener('click', function () { flightPath.setMap(null); });*/
    //alert("Recounted: "+totalTimePercent.toString()+", "+totalGoingTimePercent.toString()+", "+totalTransportChangingCountPercent.toString());
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// End client visualization.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
