import OptimalRoutesCollection from './../optimalRoutesCollection';
import ApiConfig from './../apiConfig';
import $ from 'jquery';
var apiPublicTransportServer = ApiConfig.apiPublicTransportServer;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Client.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class AppClient {
    static isStartFinalPointsSelected() {
        return AppClient.startOptimalRoutePoint != null && AppClient.finalOptimalRoutePoint != null;
    }
    static countWayButtonClicked = false;
    static isCountWayButtonClicked() {
        return AppClient.countWayButtonClicked;
    }

    static startOptimalRoutePoint = null;
    static finalOptimalRoutePoint = null;
    static myCurrentFindedPosition = null;

    static findedOptimalWays = null;
    static totalTimePercent = 1;
    static totalGoingTimePercent = 1;
    static totalTransportChangingCountPercent = 1;

    static sortedArr = new Array();
    static minimalTimeSeconds = 0;
    static minimalGoingTimeSeconds = 0;
    static minimalTransportChangingCount = 0;


    static fromPosition = null;
    static toPosition = null;
    static myStartTime = 0;
    static types = ["bus", "trolleybus"];
    static my_speed = 5;
    static my_dopTimeMinutes = 2;


    static strToCoords(str) {
        if (str === undefined || str == null) return undefined;
        var tmp = str.split(',');
        var myLat = parseFloat(tmp[0]);
        var myLng = parseFloat(tmp[1]);
        if (myLat >= -90 && myLat <= 90 && myLng >= -180 && myLng <= 180) return { lat: myLat, lng: myLng };
        else return undefined;
    }
    static strToSeconds(str) {
            if (str === undefined || str == null) return undefined;
            var tmp = str.split(':');
            var hours = parseInt(tmp[0]);
            var minutes = parseInt(tmp[1]);
            if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) return 3600 * hours + 60 * minutes;
            else return undefined;
        }
    static async findWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr) {

        var startOptimalRoutePoint = AppClient.strToCoords(fromPositionStr);
        var finalOptimalRoutePoint = AppClient.strToCoords(toPositionStr);
        var myStartTime = AppClient.strToSeconds(myStartTimeStr);

        if (startOptimalRoutePoint === undefined || finalOptimalRoutePoint === undefined || myStartTime === undefined) return null;
        
        var types = null;
        if (typesStr !== undefined) types = typesStr.split(',');
        if (types === undefined || types == null) types = ["bus", "trolleybus"];

        //var loadedFromServer = false;
        //var result = null;
        var paramsStr = "?from=" + fromPositionStr + "&to=" + toPositionStr + "&startTime=" + myStartTimeStr + "&dopTimeMinutes=" + my_dopTimeMinutes + "&goingSpeed=" + my_speed + "&transportTypes=" + typesStr;
        
        try {
            var response = await fetch(apiPublicTransportServer + "optimalRoute" + paramsStr);
            var data = await response.json();
            
            var startInitializingMoment = Date.now();
            AppClient.findedOptimalWays = data;
            
            console.log("Finded " + AppClient.findedOptimalWays.length + " optimal routes. Time = " + (Date.now() - startInitializingMoment) + " ms.");
            return data;

        } catch (e) {
            console.log("Start local counting...");
            var startInitializingMoment = Date.now();
            var res = new OptimalRoutesCollection(startOptimalRoutePoint, finalOptimalRoutePoint, myStartTime, types, parseFloat(my_speed), parseFloat(my_dopTimeMinutes));
            AppClient.findedOptimalWays = res.getOptimalWays();
            
            console.log("Finded " + AppClient.findedOptimalWays.length + " optimal routes. Time = " + (Date.now() - startInitializingMoment) + " ms.");

            return AppClient.findedOptimalWays;
        }
        
    }

    static customizeFindedOptimalWaysStart(totalTimePercentValue, totalGoingTimePercentValue, totalTransportChangingCountPercentValue) {
        if (AppClient.findedOptimalWays != null) {
            AppClient.totalTimePercent = totalTimePercentValue;
            AppClient.totalGoingTimePercent = totalGoingTimePercentValue;
            AppClient.totalTransportChangingCountPercent = totalTransportChangingCountPercentValue;

            AppClient.minimalTimeSeconds = parseFloat(AppClient.findedOptimalWays[0].totalTimeSeconds);
            AppClient.minimalGoingTimeSeconds = parseFloat(AppClient.findedOptimalWays[0].totalGoingTimeSeconds);
            AppClient.minimalTransportChangingCount = parseFloat(AppClient.findedOptimalWays[0].totalTransportChangingCount);
            for (var i = 1; i < AppClient.findedOptimalWays.length; i++) {
                if (parseFloat(AppClient.findedOptimalWays[i].totalTimeSeconds) < AppClient.minimalTimeSeconds) AppClient.minimalTimeSeconds = parseFloat(AppClient.findedOptimalWays[i].totalTimeSeconds);
                if (parseFloat(AppClient.findedOptimalWays[i].totalGoingTimeSeconds) < AppClient.minimalGoingTimeSeconds) AppClient.minimalGoingTimeSeconds = parseFloat(AppClient.findedOptimalWays[i].totalGoingTimeSeconds);
                if (parseFloat(AppClient.findedOptimalWays[i].totalTransportChangingCount) < AppClient.minimalTransportChangingCount) AppClient.minimalTransportChangingCount = parseFloat(AppClient.findedOptimalWays[i].totalTransportChangingCount);
            }
            if (AppClient.minimalTransportChangingCount < 1) AppClient.minimalTransportChangingCount = 1;

            AppClient.sortedArr = new Array();

            //

            var tmpTransportChangingCountEffictivity = 0;//parseFloat(findedOptimalWays[0].totalTransportChangingCount) == 0 ? 1 : (minimalTransportChangingCount / parseFloat(findedOptimalWays[0].totalTransportChangingCount));
            var max_rank = 0;//minimalTimeSeconds / parseFloat(findedOptimalWays[0].totalTimeSeconds) * totalTimePercent + minimalGoingTimeSeconds / parseFloat(findedOptimalWays[0].totalGoingTimeSeconds) * totalGoingTimePercent + tmpTransportChangingCountEffictivity * totalTransportChangingCountPercent;
            var index = -1;
            for (var j = 0; j < AppClient.findedOptimalWays.length/* && j < 3*/; j++) {
                max_rank = 0;//!!!
                index = -1;
                for (var i = 0; i < AppClient.findedOptimalWays.length; i++) {
                    if (/*jQuery.inArray(i, AppClient.sortedArr)*/ AppClient.sortedArr.indexOf(i) == -1) {
                        tmpTransportChangingCountEffictivity = parseFloat(AppClient.findedOptimalWays[i].totalTransportChangingCount) == 0 ? 1 : (AppClient.minimalTransportChangingCount / parseFloat(AppClient.findedOptimalWays[i].totalTransportChangingCount));
                        var tmp_rank = AppClient.minimalTimeSeconds / parseFloat(AppClient.findedOptimalWays[i].totalTimeSeconds) * AppClient.totalTimePercent + AppClient.minimalGoingTimeSeconds / parseFloat(AppClient.findedOptimalWays[i].totalGoingTimeSeconds) * AppClient.totalGoingTimePercent + tmpTransportChangingCountEffictivity * AppClient.totalTransportChangingCountPercent;
                        if (tmp_rank >= max_rank) {
                            max_rank = tmp_rank;
                            index = i;
                        }
                    }
                }
                if (index != -1) {
                    AppClient.sortedArr.push(index);
                }
                //!!!!!!!!!!!!!!addFindedWayToList(findedOptimalWays[j], minimalTimeSeconds, minimalGoingTimeSeconds, minimalTransportChangingCount);
            }
            return AppClient.sortedArr;
        }
    }

    static async findCurrentDestinationCoords() {
        if (navigator.geolocation) {

            async function getCurrentPositionDeferred() {
                var deferred = $.Deferred();
                navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject);
                return await deferred.promise();
            };

            var position = await getCurrentPositionDeferred();
            if (position === undefined || position == null) return null;

            var findedLat = parseFloat(position.coords.latitude.toFixed(4));
            var findedLng = parseFloat(position.coords.longitude.toFixed(4));

            localStorage["lastCnownPositionCoords"] = findedLat + "," + findedLng;

            var lastCnownPositionCoordsDescription = await AppClient.getDesinationDescription({lat: findedLat, lng: findedLng});
            if (lastCnownPositionCoordsDescription == null) lastCnownPositionCoordsDescription = "[" + findedLat + ", " + findedLng + "]";
            localStorage["lastCnownPositionCoordsDescription"] = lastCnownPositionCoordsDescription;

            var resultCoords = { lat: findedLat, lng: findedLng };

            return resultCoords;
        }
        return null;
    }

    static async getDesinationDescription(coords) {
        try {
            var response = await fetch("https://nominatim.openstreetmap.org/search?format=json&q=" + coords.lat + "," + coords.lng);
            var data = await response.json();
            if (data != null && data.length != 0) {
                return data[0].display_name;
            }
            return null;
        } catch (e) {
            //console.log("Booo");
            return null;
        }
    }

    static async getPointCoordsFromOsmGeocodingApi(strReq) {
        try {
            var response = await fetch("https://nominatim.openstreetmap.org/search?q=" + strReq + "&format=json");
            var data = await response.json();
            if (data != null && data.length != 0) {
                var tmpPoint =  data[0];
                var resultCoords = { lat: parseFloat(tmpPoint.lat), lng: parseFloat(tmpPoint.lon)};
                return resultCoords;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// End client.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default AppClient;