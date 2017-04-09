import Points from './points';
import GeoCoords from './geoCoords';
var distance = GeoCoords.distance;
import IgnoringFragments from './ignoringFragments';

//import {getAllStations, getAllRoutes, getAllTimetables, getAllStationsJSON, getAllRoutesJSON, getAllTimetablesJSON, loadData} from './loadData';
import MyDatabase from './loadData';

var allStations = null;

function getStationsAround(coords, radius) {
    if(allStations == null) allStations =  MyDatabase.getAllStations();
    var result = new Array();
    for (var i = 0, n = allStations.length, s = allStations[0]; i < n; s = allStations[++i]) {
        if (s != null && distance(s.coords, coords) < radius) result.push(s);
    }
    return result;
}

class OptimalRoute {
    constructor(nowPos, needPos, time, types, goingSpeed, dopTimeMinutes, ignoringRoutesAdd, ignoringList) {
        if (ignoringRoutesAdd != undefined && ignoringRoutesAdd != null) this.ignoringRoutes = ignoringRoutesAdd;
        else this.ignoringRoutes = new Array();

        this.points = new Array();

        this.needPos = needPos;
        this.nowPos = nowPos;
        this.goingSpeed = goingSpeed;
        this.time = time;
        var reservedTimeSeconds = 60 * dopTimeMinutes;

        this.types = types;

        var myIgnoringFragments = null;
        if (ignoringList != null) myIgnoringFragments = new IgnoringFragments(ignoringList);
        else myIgnoringFragments = new IgnoringFragments();

        var myPoints = new Points(nowPos, needPos);
        // Получим "начальный" список станций:
        var stationsList = getStationsAround(myPoints.startPoint.coords, distance(myPoints.startPoint.coords, myPoints.finalPoint.coords));
        myPoints.fillStartData(stationsList, goingSpeed, reservedTimeSeconds, myIgnoringFragments);

        // Находим кратчайшие пути до всех вершин:
        myPoints.countShortWay(this.ignoringRoutes, myIgnoringFragments, time, types, goingSpeed, reservedTimeSeconds);

        var tmpP = myPoints.finalPoint;
        this.points.push(tmpP.toString());////
        while (tmpP.previousPoint != null) {
            tmpP = tmpP.previousPoint;//
            this.points.push(tmpP.toString());
            if (tmpP.previousPoint == null && tmpP.coords != myPoints.startPoint.coords)
                throw new Error("Где-то удалилась часть маршрута...");
        }

        this.totalTimeSeconds = myPoints.finalPoint.totalTimeSeconds;
        this.totalGoingTime = myPoints.finalPoint.getTotalGoingTime();
        this.totalTransportChangingCount = myPoints.finalPoint.getTotalTransportChangingCount();

        this.myPoints = myPoints;
        this.myIgnoringFragments = myIgnoringFragments;


        this.isVisited = false;
    }

    setVisited() {
        this.isVisited = true;
    }

}

export default OptimalRoute;