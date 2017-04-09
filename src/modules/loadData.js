//var fetch = require('node-fetch');
import initialize from './initialize';

import ApiConfig from './apiConfig';
var apiPublicTransportServer = ApiConfig.apiPublicTransportServer;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Load data.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var allStations = null;
var allRoutes = null;
var allTimetables = null;

var updatingFromServerInterval = 5000;

var loadingStarted = false;

var allStationsLoaded = false, allRoutesLoaded = false,  allTimetablesLoaded = false;
var allStationsJSON = null, allRoutesJSON = null, allTimetablesJSON = null;

function waitLoadDataEnd() {
    if (allStationsLoaded && allRoutesLoaded && allTimetablesLoaded) {
        initialize(allStations, allRoutes, allTimetables);
    }
    else setTimeout(waitLoadDataEnd, 50);
}

function loadData() {
    if(!loadingStarted){
        loadingStarted = true;

        /*console.log("Downloading stations from server...");
        var strGetStations = apiPublicTransportServer + "stations/";
        strGetStations = "json/stations.json";
        strGetStations = "https://publictransportproject.000webhostapp.com/new/json/stations.json";
        //strGetStations = "http://ptp.local/json/stations.json";
        fetch(strGetStations).then(function (response) {
            response.text().then(function (data) {
                allStations = JSON.parse(allStationsJSON = data);
                allStationsLoaded = true;
                console.log("Stations loaded from server.");
            });
        });


        console.log("Downloading routes from server...");
        var strGetRoutes = apiPublicTransportServer + "routes/";
        strGetRoutes = "json/routes.json";
        strGetRoutes = "https://publictransportproject.000webhostapp.com/new/json/routes.json";
        //strGetRoutes = "http://ptp.local/json/routes.json";
        fetch(strGetRoutes).then(function (response) {
            response.text().then(function (data) {
                allRoutes = JSON.parse(allRoutesJSON = data);
                allRoutesLoaded = true;
                console.log("Routes loaded from server.");
            });
        });



        console.log("Downloading timetables from server...");
        var strGetTimetables = apiPublicTransportServer + "timetables/";
        strGetTimetables = "json/timetables.json";
        strGetTimetables = "https://publictransportproject.000webhostapp.com/new/json/timetables.json";
        //strGetTimetables = "http://ptp.local/json/timetables.json";
        fetch(strGetTimetables).then(function (response) {
            response.text().then(function (data) {
                allTimetables = JSON.parse(allTimetablesJSON = data);
                allTimetablesLoaded = true;
                console.log("Timetables loaded from server.");
            });
        });*/


        if (localStorage["allStationsJSON"] == undefined || localStorage["allStationsJSON"] == null) {
            console.log("Downloading stations from server...");
            var strGetStations = apiPublicTransportServer + "stations/";
            fetch(strGetStations).then(function (response) {
                response.text().then(function (data) {
                    allStations = JSON.parse(allStationsJSON = data);
                    if (allStations != undefined && allStations != null) localStorage["allStationsJSON"] = allStationsJSON;
                    allStationsLoaded = true;
                    console.log("Stations loaded from server.");
                });
            });
        }
        else {
            allStations = JSON.parse(localStorage["allStationsJSON"]);
            allStationsLoaded = true;
            console.log("Stations loaded from localStorage.");
        }

        if (localStorage["allRoutesJSON"] == undefined || localStorage["allRoutesJSON"] == null) {
            console.log("Downloading routes from server...");
            var strGetRoutes = apiPublicTransportServer + "routes/";
            fetch(strGetRoutes).then(function (response) {
                response.text().then(function (data) {
                    allRoutes = JSON.parse(allRoutesJSON = data);
                    if (allRoutes != undefined && allRoutes != null) localStorage["allRoutesJSON"] = allRoutesJSON;
                    allRoutesLoaded = true;
                    console.log("Routes loaded from server.");
                });
            });
        }
        else {
            allRoutes = JSON.parse(localStorage["allRoutesJSON"]);
            allRoutesLoaded = true;
            console.log("Routes loaded from localStorage.");
        }

        if (localStorage["allTimetablesJSON"] == undefined || localStorage["allTimetablesJSON"] == null) {
            console.log("Downloading timetables from server...");
            var strGetTimetables = apiPublicTransportServer + "timetables/";
            fetch(strGetTimetables).then(function (response) {
                response.text().then(function (data) {
                    allTimetables = JSON.parse(allTimetablesJSON = data);
                    if (allTimetables != undefined && allTimetables != null) localStorage["allTimetablesJSON"] = allTimetablesJSON;
                    allTimetablesLoaded = true;
                    console.log("Timetables loaded from server.");
                });
            });
        }
        else {
            allTimetables = JSON.parse(localStorage["allTimetablesJSON"]);
            allTimetablesLoaded = true;
            console.log("Timetables loaded from localStorage.");
        }


        waitLoadDataEnd();
    }
}


//loadData();

class MyDatabase {
    static getAllStations() {
        loadData();
        return allStations;
    }
    static getAllRoutes() {
        loadData();
        return allRoutes;
    }
    static getAllTimetables() {
        loadData();
        return allTimetables;
    }
    static getAllStationsJSON() {
        loadData();
        return allStationsJSON;
    }
    static getAllRoutesJSON() {
        loadData();
        return allRoutesJSON;
    }
    static getAllTimetablesJSON() {
        loadData();
        return allTimetablesJSON;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// End load data.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//export default {getAllStations, getAllRoutes, getAllTimetables, getAllStationsJSON, getAllRoutesJSON, getAllTimetablesJSON, loadData};
export default MyDatabase;