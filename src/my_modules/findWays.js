function findWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr) {

    function strToCoords(str) {
        if (str == undefined || str == null) return undefined;
        var tmp = str.split(',');
        var myLat = parseFloat(tmp[0]);
        var myLng = parseFloat(tmp[1]);
        if (myLat >= -90 && myLat <= 90 && myLng >= -180 && myLng <= 180) return { lat: myLat, lng: myLng };
        else return undefined;
    }
    function strToSeconds(str) {
        if (str == undefined || str == null) return undefined;
        var tmp = str.split(':');
        var hours = parseInt(tmp[0]);
        var minutes = parseInt(tmp[1]);
        if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) return 3600 * hours + 60 * minutes;
        else return undefined;
    }

    var startOptimalRoutePoint = strToCoords(fromPositionStr);
    var finalOptimalRoutePoint = strToCoords(toPositionStr);
    var myStartTime = strToSeconds(myStartTimeStr);

    if (startOptimalRoutePoint == undefined || finalOptimalRoutePoint == undefined || myStartTime == undefined) return null;
    
    var types = null;
    if (typesStr != undefined) types = typesStr.split(',');
    if (types == undefined || types == null) types = ["bus", "trolleybus"];

    var loadedFromServer = false;
    //var result = null;
    var paramsStr = "?from=" + fromPositionStr + "&to=" + toPositionStr + "&startTime=" + myStartTimeStr + "&dopTimeMinutes=" + my_dopTimeMinutes + "&goingSpeed=" + my_speed + "&transportTypes=" + typesStr;
    fetch(apiPublicTransportServer + "optimalRoute" + paramsStr).then(function (response) {
        response.json().then(function (data) {
            var startInitializingMoment = Date.now();
            findedOptimalWays = data;
            customizeFindedOptimalWays();
            loadedFromServer = true;
            console.log("Finded " + findedOptimalWays.length + " optimal routes. Time = " + (Date.now() - startInitializingMoment) + " ms.");
        });
    }, function (err) {
        if (initialized) {
            var startInitializingMoment = Date.now();
            var res = OptimalRoute.FindOptimalRoutes(startOptimalRoutePoint, finalOptimalRoutePoint, myStartTime, types, parseFloat(my_speed), parseFloat(my_dopTimeMinutes));
            findedOptimalWays = res.GetOptimalWays();
            customizeFindedOptimalWays();
            console.log("Finded " + findedOptimalWays.length + " optimal routes. Time = " + (Date.now() - startInitializingMoment) + " ms.");
        }
        else {
            //loadAll();
            function loadData() {
                if (allStationsLoaded && allRoutesLoaded && allTimetablesLoaded) {
                    initialize(allStations, allRoutes, allTimetables);
                    var startInitializingMoment = Date.now();
                    var res = OptimalRoute.FindOptimalRoutes(startOptimalRoutePoint, finalOptimalRoutePoint, myStartTime, types, parseFloat(my_speed), parseFloat(my_dopTimeMinutes));
                    findedOptimalWays = res.GetOptimalWays();
                    customizeFindedOptimalWays();
                    console.log("Finded " + findedOptimalWays.length + " optimal routes. Time = " + (Date.now() - startInitializingMoment) + " ms.");
                }
                else setTimeout(loadData, 50);
            }
            loadData();
        }
    });
    
}