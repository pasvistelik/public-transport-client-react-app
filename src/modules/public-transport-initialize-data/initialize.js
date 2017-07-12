﻿///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Initailize.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getNextStation(currentStation) {
    for (let j = 0; j <= 1; j++) {
        for (let t = 0, nn = this.stations[j].length; t < nn; t++) {
            if (this.stations[j][t] === currentStation) {
                if (t + 1 !== nn) return this.stations[j][t + 1];
                else return null;
            }
        }
    }
    return null;
}
function getPreviousStation(currentStation) {
    for (let j = 0; j <= 1; j++) {
        for (let t = 0, nn = this.stations[j].length; t < nn; t++) {
            if (this.stations[j][t] === currentStation) {
                if (t !== nn) return this.stations[j][t - 1];
                else return null;
            }
        }
    }
    return null;
}
function getTimetable(station) {
    for (let j = 0; j <= 1; j++) {
        for (let i = 0, n = this.stations[j].length; i < n; i++) {
            if (this.stations[j][i] === station) {
                return this.timetables[j][i];
            }
        }
    }
    return null;
}
function findTimeAfter(time) {
    var dateTmp = new Date();
    dateTmp.setMinutes(0);
    dateTmp.setHours(0);
    dateTmp.setSeconds(time);
    var day = dateTmp.getDay();
    //foreach (Table t in table)
    for (let kkk = 0, mnkk = this.table.length, t = this.table[0]; kkk < mnkk; t = this.table[++kkk]) {
        if (t.days.includes(day)) {

            //foreach (SimpleTime st in t.times)
            for (let iik = 0, mnii = t.times.length, st = t.times[0], stTime; iik < mnii; st = t.times[++iik]) {
                //MessageBox.Show("Проверяем: прибытие в " + TimeSpan.FromMinutes(st.hour * 60 + st.minute).ToString()+", мы в "+ TimeSpan.FromSeconds(time.Second + time.Minute * 60 + time.Hour * 3600).ToString());
                //
                stTime = st.hour * 3600 + st.minute * 60;
                if (stTime >= time/*.Second + time.Minute * 60 + time.Hour * 3600*/ /*time.Hour >= st.hour && time.Minute >= st.minute*/) {
                    //MessageBox.Show("Ближайшее время: " + st.ToString());
                    return stTime - time/*TimeSpan.FromSeconds(time.Second + time.Minute * 60 + time.Hour * 3600)*/;
                }
            }
            if (t.times.length !== 0) return t.times[0].hour * 3600 + t.times[0].minute * 60 - time/*TimeSpan.FromSeconds(time.Second + time.Minute * 60 + time.Hour * 3600)*/ + 86400;
            break;
        }
    }
    return 2160000000;
    //throw new Exception();
}
function findTimeBefore(time) {
    var dateTmp = new Date();
    dateTmp.setMinutes(0);
    dateTmp.setHours(0);
    dateTmp.setSeconds(time);
    var day = dateTmp.getDay();
    for (let kkk = 0, mnkk = this.table.length, t = this.table[0], ok = false, st; kkk < mnkk; t = this.table[++kkk]) {
        if (t.days.includes(day)) {
            ok = false;
            st = null;
            for (let iik = 0, mnii = t.times.length, stt = t.times[0]; iik < mnii; stt = t.times[++iik]) {
                //MessageBox.Show("Проверяем: прибытие в " + TimeSpan.FromMinutes(st.hour * 60 + st.minute).ToString()+", мы в "+ TimeSpan.FromSeconds(time.Second + time.Minute * 60 + time.Hour * 3600).ToString());
                //
                if (stt.hour * 3600 + stt.minute * 60 <= time/*time.Hour >= st.hour && time.Minute >= st.minute*/) {
                    ok = true;
                    st = stt;
                    //MessageBox.Show("Ближайшее время: " + st.ToString());
                }
                else break;
            }
            if (ok) return st.hour * 3600 + st.minute * 60 - time;
            if (t.times.length !== 0) return t.times[0].hour * 3600 + t.times[0].minute * 60 - time - 86400;
            break;
        }
    }
    return 0;//TimeSpan.FromDays(0/*-25000*/);
    //throw new Exception();
}


function initialize(allStations, allRoutes, allTimetables) {
    //alert(allStations.length);
    //alert(allRoutes.length);
    //alert(allTimetables.length);

    console.log("Start initializing...");
    var startInitializingMoment = Date.now();

    var tmpUsedStations = [];

    function bindRoutesStationsTimetables(station, tmpArr, tabArr, rr) {
        if (station.routes == null) station.routes = [];
        //console.log(station.routes);//!!!
        if (!(station.routes.includes(rr))) station.routes.push(rr);
        tmpArr.push(station);

        var tmp = allTimetables.find(function (element, index, array) {
            return element.stationCode === station.hashcode && element.routeCode === rr.hashcode;
        });
        var tmpTab = (tmp == null) ? null : tmp;

        tabArr.push(tmpTab);
    }

    // Удаляем станции, через которые не идет ни один маршрут
    let newAllStations = [];
    for (let i = 0, n = allStations.length, currentStation = allStations[0]; i < n; currentStation = allStations[++i]) {
        if (currentStation.routesCodes != null && currentStation.routesCodes.length !== 0) {
            newAllStations.push(currentStation);
        }
    }
    allStations = newAllStations;

    console.log("Time = " + (Date.now() - startInitializingMoment) + " ms.");
    
    for (let i = 0, n = allRoutes.length, rr = allRoutes[0]; i < n; rr = allRoutes[++i]) {

        rr.getNextStation = getNextStation; 
        rr.getPreviousStation = getPreviousStation;
        rr.getTimetable = getTimetable;

        if (rr.stationsCodes == null || rr.stationsCodes.length === 0) continue;

        try {
            //if (rr.stationsCodes[rr.stationsCodes.Length - 1] != ']') continue;//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            rr.stations = [[],[]];
            rr.timetables = [[],[]];



            for (let index = 0, tmpArr = [], tabArr = [] ; index <= 1; index++) {
                var rr_stationsCodes = rr.stationsCodes;
                if (rr_stationsCodes[index] == null || rr_stationsCodes[index].length === 0) continue;
                for (let j = 0, m = rr_stationsCodes[index].length, stationCode = rr_stationsCodes[index][0]; j < m; stationCode = rr_stationsCodes[index][++j]) {
                    var tmpUsed = false;
                    for (let k = 0, mn = allStations.length, station = allStations[0]; k < mn; station = allStations[++k]) {
                        if (station != null && station.hashcode === stationCode) {
                            bindRoutesStationsTimetables(station, tmpArr, tabArr, rr);
                            tmpUsed = true;
                            break;
                        }
                    }
                    if (!tmpUsed) {
                        for (let k = 0, mn = allStations.length, station = allStations[0]; k < mn; station = allStations[++k]) {
                            if (station != null && station.hashcode === stationCode) {
                                bindRoutesStationsTimetables(station, tmpArr, tabArr, rr);
                                if (!tmpUsedStations.includes(station)) tmpUsedStations.push(station);
                                break;
                            }
                        }
                    }
                }
                rr.stations[index] = tmpArr;
                rr.timetables[index] = tabArr;

            }
        }
        catch (ex) {
            console.log(ex/*.message*/);
            continue;
        }
    }
    

    for (let i = 0, n = allTimetables.length, timetable = allTimetables[0]; i < n; timetable = allTimetables[++i]) {
        timetable.findTimeAfter = findTimeAfter;
        timetable.findTimeBefore = findTimeBefore;
    }

    //...
    /*
    for (let i = 0, n = allStations.length, currentStation = allStations[0]; i < n; currentStation = allStations[i]) {
        if (currentStation.routes == undefined || currentStation.routes == null || currentStation.routes.length == 0) {
            allStations.splice(i, 1);
            n = allStations.length;
        }
        else i++;
    }
    */

    console.log("Initialized. Time = " + (Date.now() - startInitializingMoment) + " ms.");
    //console.log("\n\n" + JSON.stringify(allTimetables[0]) + "\n\n");
    //alert(distance({ lat: allStations[0].xCoord, lng: allStations[0].yCoord }, { lat: allStations[5].xCoord, lng: allStations[5].yCoord }));


    //for (let t = 0; t < 1000; t++) var ttt = GetStationsAround(allStations[0].coords, 30000).length;
    //console.log("test. Time = " + (Date.now() - startInitializingMoment) + " ms.");


    //global.initialized = true;
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// End initailize.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default initialize;