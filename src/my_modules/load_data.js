'use strict';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Load data.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var allStations = null;
var allRoutes = null;
var allTimetables = null;

var updatingFromServerInterval = 5000;

// Отправка GET-запроса:
function xhrGet(url) {
    var deferred = new $.Deferred();
    var xhr = new XMLHttpRequest();
    let canSendAsyncRequest = true;
    if (arguments.length > 1 && arguments[1] == false) canSendAsyncRequest = false;
    xhr.open("GET", url, canSendAsyncRequest);
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status == 200) {
            deferred.resolve(xhr.responseText);
        } else {
            //return null;//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //deferred.errback(xhr.statusText);
        }
    }
    xhr.send(null);
    return deferred;
}

var allStationsLoaded = false, allRoutesLoaded = false, allTimetablesLoaded = false;


function tryLoadDataFromLocalstorage(fieldName) {
    var objInStorage = localStorage[fieldName];
    if (objInStorage == undefined || objInStorage == null) {
        return { loaded: false, data: null };
    }
    else {
        return { loaded: true, data: JSON.parse(objInStorage) };
    }
}

function tryLoadDataFromServer(reqStr, variableForSavingData, fieldNameForSaveInLocalstorage)
{
    console.log("Downloading data from " + reqStr + " ...");
    fetch(reqStr).then(function (response) {
        response.text().then(function (data) {
            variableForSavingData = JSON.parse(localStorage[fieldNameForSaveInLocalstorage] = data);
        });
    });
}

function loadAll() {
    //allStationsLoaded = tryLoadDataFromLocalstorage("allStationsJSON", allStations);
    //if (!allStationsLoaded) {
    //    var strGet = apiPublicTransportServer + "stations/";
    //    tryLoadDataFromServer(strGet, allStations, "allStationsJSON");
    //}

    //allRoutesLoaded = tryLoadDataFromLocalstorage("allRoutesJSON", allRoutes);
    //if (!allRoutesLoaded) {
    //    var strGet = apiPublicTransportServer + "routes/";
    //    tryLoadDataFromServer(strGet, allRoutes, "allRoutesJSON");
    //}

    //allTimetablesLoaded = tryLoadDataFromLocalstorage("allTimetablesJSON", allTimetables);
    //if (!allTimetablesLoaded) {
    //    var strGet = apiPublicTransportServer + "timetables/";
    //    tryLoadDataFromServer(strGet, allTimetables, "allTimetablesJSON");
    //}

    if (localStorage["allStationsJSON"] == undefined || localStorage["allStationsJSON"] == null) {
        console.log("Downloading stations from server...");
        var strGet = apiPublicTransportServer + "stations/";
        //strGet = "json/stations.json";
        //strGet = "https://publictransportproject.000webhostapp.com/new/json/stations.json";
        var gettingStations = xhrGet(strGet);
        gettingStations.done(function (returnedStationsJSON) {
            allStations = JSON.parse(returnedStationsJSON.toString());
            if (allStations != null) localStorage["allStationsJSON"] = returnedStationsJSON.toString();
            allStationsLoaded = true;
            console.log("Stations loaded from server.");
        });
    }
    else {
        allStations = JSON.parse(localStorage["allStationsJSON"]);
        allStationsLoaded = true;
        console.log("Stations loaded from localStorage.");
    }

    if (localStorage["allRoutesJSON"] == undefined || localStorage["allRoutesJSON"] == null) {
        console.log("Downloading routes from server...");
        var strGet = apiPublicTransportServer + "routes/";
        //strGet = "json/routes.json";
        //strGet = "https://publictransportproject.000webhostapp.com/new/json/routes.json";
        var gettingRoutes = xhrGet(strGet);
        gettingRoutes.done(function (returnedRoutesJSON) {
            allRoutes = JSON.parse(returnedRoutesJSON.toString());
            if (allRoutes != null) localStorage["allRoutesJSON"] = returnedRoutesJSON.toString();
            allRoutesLoaded = true;
            console.log("Routes loaded from server.");
        });
    }
    else {
        allRoutes = JSON.parse(localStorage["allRoutesJSON"]);
        allRoutesLoaded = true;
        console.log("Routes loaded from localStorage.");
    }

    if (localStorage["allTimetablesJSON"] == undefined || localStorage["allTimetablesJSON"] == null) {
        console.log("Downloading timetables from server...");
        var strGet = apiPublicTransportServer + "timetables/";
        //strGet = "json/timetables.json";
        //strGet = "https://publictransportproject.000webhostapp.com/new/json/timetables.json";
        var gettingTimetables = xhrGet(strGet);
        gettingTimetables.done(function (returnedTimetablesJSON) {
            allTimetables = JSON.parse(returnedTimetablesJSON.toString());
            if (allTimetables != null) localStorage["allTimetablesJSON"] = returnedTimetablesJSON.toString();
            allTimetablesLoaded = true;
            console.log("Timetables loaded from server.");
        });
    }
    else {
        allTimetables = JSON.parse(localStorage["allTimetablesJSON"]);
        allTimetablesLoaded = true;
        console.log("Timetables loaded from localStorage.");
    }
}

loadAll();

//function loadData() {
//    if (allStationsLoaded && allRoutesLoaded && allTimetablesLoaded) {
//        initialize(allStations, allRoutes, allTimetables);
//    }
//    else setTimeout(loadData, 50);
//}
//loadData();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// End load data.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
