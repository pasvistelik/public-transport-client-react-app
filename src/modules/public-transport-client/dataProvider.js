//var fetch = require('node-fetch');
import initialize from './../public-transport-initialize-data/initialize';

import ApiConfig from './config';
//var apiPublicTransportServer = ApiConfig.apiPublicTransportServer;

/*var strGetStations = apiPublicTransportServer + "stations/";
strGetStations = "json/stations.json";
strGetStations = "https://publictransportproject.000webhostapp.com/new/json/stations.json"; 

var strGetRoutes = apiPublicTransportServer + "routes/";
strGetRoutes = "json/routes.json";
strGetRoutes = "https://publictransportproject.000webhostapp.com/new/json/routes.json";

var strGetTimetables = apiPublicTransportServer + "timetables/";
strGetTimetables = "json/timetables.json";
strGetTimetables = "https://publictransportproject.000webhostapp.com/new/json/timetables.json";*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Load data.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var allStations = null;
var allRoutes = null;
var allTimetables = null;

//var updatingFromServerInterval = 5000;

var loadingStarted = false;

var allStationsLoaded = false, allRoutesLoaded = false,  allTimetablesLoaded = false;
var allStationsJSON = null, allRoutesJSON = null, allTimetablesJSON = null;

async function loadDataOnly() {
    if(!allStationsLoaded){
        if (localStorage["allStationsJSON"] === undefined || localStorage["allStationsJSON"] == null) {
            console.log("Downloading stations from server...");

            let response = await fetch(ApiConfig.apiGetStationsUrl);
            allStationsJSON = await response.text();
            allStations = JSON.parse(allStationsJSON);//await response.json();

            if (allStations !== undefined && allStations != null) localStorage["allStationsJSON"] = allStationsJSON;
            allStationsLoaded = true;
            console.log("Stations loaded from server.");
        }
        else {
            allStations = JSON.parse(localStorage["allStationsJSON"]);
            allStationsLoaded = true;
            console.log("Stations loaded from localStorage.");
        }
    }

    if(!allRoutesLoaded){
        if (localStorage["allRoutesJSON"] === undefined || localStorage["allRoutesJSON"] == null) {
            console.log("Downloading routes from server...");

            let response = await fetch(ApiConfig.apiGetRoutesUrl);
            allRoutesJSON = await response.text();
            allRoutes = JSON.parse(allRoutesJSON);//await response.json();

            if (allRoutes !== undefined && allRoutes != null) localStorage["allRoutesJSON"] = allRoutesJSON;
            allRoutesLoaded = true;
            console.log("Routes loaded from server.");
        }
        else {
            allRoutes = JSON.parse(localStorage["allRoutesJSON"]);
            allRoutesLoaded = true;
            console.log("Routes loaded from localStorage.");
        }
    }

    if(!allTimetablesLoaded){
        if (localStorage["allTimetablesJSON"] === undefined || localStorage["allTimetablesJSON"] == null) {
            console.log("Downloading timetables from server...");

            let response = await fetch(ApiConfig.apiGetTimetablesUrl);
            allTimetablesJSON = await response.text();
            allTimetables = JSON.parse(allTimetablesJSON);//await response.json();

            if (allTimetables !== undefined && allTimetables != null) localStorage["allTimetablesJSON"] = allTimetablesJSON;
            allTimetablesLoaded = true;
            console.log("Timetables loaded from server.");
        }
        else {
            allTimetables = JSON.parse(localStorage["allTimetablesJSON"]);
            allTimetablesLoaded = true;
            console.log("Timetables loaded from localStorage.");
        }
    }
}

async function loadData() {
    if(!loadingStarted){
        loadingStarted = true;

        await loadDataOnly();

        if (allStationsLoaded && allRoutesLoaded && allTimetablesLoaded) {
            initialize(allStations, allRoutes, allTimetables);
        }
    }
}


//loadData();

class DataProvider {
    static getAllStations() {
        return allStations;
    }
    static getAllRoutes() {
        return allRoutes;
    }
    static getAllTimetables() {
        return allTimetables;
    }
    static getAllStationsJSON() {
        return allStationsJSON;
    }
    static getAllRoutesJSON() {
        return allRoutesJSON;
    }
    static getAllTimetablesJSON() {
        return allTimetablesJSON;
    }
    static async loadDataAndInitialize() {
        await loadData();
    }
    static async loadDataOnly() {
        await loadDataOnly();
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// End load data.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default DataProvider;