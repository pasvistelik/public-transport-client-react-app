﻿'use strict';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Algorithm.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*class GeoCoords {

}*/

function distance(a, b) {
    const earthRadius = 6372795;
    const pi180 = 0.017453;// 29251//Math.Round(Math.PI / 180, 5);
    var zz = 1, yy = 1;
    function TaylorSin(x) {
        yy = x * x;
        zz = x;
        return zz - (zz *= yy) / 6 + (zz *= yy) / 120;
    }
    function TaylorCos(x) {
        yy = x * x;
        zz = yy;
        return 1 - (yy) / 2 + (zz *= yy) / 24;
    }
    function TaylorAtan(x) {
        yy = x * x;
        zz = x;
        return zz - (zz *= yy) / 3 + (zz *= yy) / 5 - (zz *= yy) / 7 + (zz *= yy) / 9 - (zz *= yy) / 20;
    }

    // перевести координаты в радианы
    var lat1 = a.lat * pi180;
    var lat2 = b.lat * pi180;
    var long1 = a.lng * pi180;
    var long2 = b.lng * pi180;

    // косинусы и синусы широт и разницы долгот
    var cl1 = TaylorCos(lat1);
    var cl2 = TaylorCos(lat2);
    var sl1 = TaylorSin(lat1);
    var sl2 = TaylorSin(lat2);
    var delta = long2 - long1;
    var cdelta = TaylorCos(delta);
    var sdelta = TaylorSin(delta);

    // вычисления длины большого круга
    var tmp = cl2 * cdelta;
    var y = Math.sqrt(cl2 * cl2 * sdelta * sdelta + (cl1 * sl2 - sl1 * tmp) * (cl1 * sl2 - sl1 * tmp));
    var x = sl1 * sl2 + cl1 * tmp;

    //
    var ad = Math.atan2(y, x);//TaylorAtan(y/x);
    var dist = Math.ceil(ad * earthRadius);//(int)Math.Round(ad * earthRadius, 0);

    return dist;
}

function GetTimeForGoingTo(distance, goingSpeed) {
    return Math.floor(distance / (goingSpeed / 3.6));
}


function GetStationsAround(coords, radius) {
    var result = new Array();
    for (var i = 0, n = allStations.length, s = allStations[0]; i < n; s = allStations[++i]) {
        if (s != null && distance(s.coords, coords) < radius) result.push(s);
    }
    return result;
}

const TableType = { table: 1, periodic: 2 };

class Point {
    constructor(totalTimeSeconds, station_or_crds, fromWhere, r) {
        if (station_or_crds.hashcode != undefined) {
            this.station = station_or_crds;
            this.StationCode = station_or_crds.hashcode;
            station_or_crds.Point = this;
            this.coords = station_or_crds.coords;
        }
        else {
            this.coords = station_or_crds;
            this.station = null;
            this.StationCode = null;
        }
        this.totalTimeSeconds = totalTimeSeconds;
        this.fromWhere = fromWhere;
        this.myRoute = r;

        this.visited = false;

        this.prev = null;
    }
    tryUpdate(totalTimeSeconds, previousPoint, fromWhere, myRoute) {
        if (totalTimeSeconds < this.totalTimeSeconds) {
            //updatesHistory.AddLast(new Point(this));

            this.myRoute = myRoute;
            this.prev = previousPoint;
            this.totalTimeSeconds = totalTimeSeconds;
            this.fromWhere = fromWhere;

            return true;
        }
        return false;
    }
    Visited() {
        this.visited = true;
    }
    toString() {
        var from, to, tr, p;
        if (this.fromWhere != null) from = this.fromWhere.name;
        else from = "null";
        if (this.station != null) to = this.station.name;
        else to = "null";
        if (this.myRoute != null) tr = this.myRoute.type + " " + this.myRoute.number + " " + this.myRoute.from + " - " + this.myRoute.to;
        else tr = "пешком";
        if (this.prev != null) p = this.prev.toString();
        else p = "null";
        return /*p+" -->> */"(" + this.totalTimeSeconds + ") " + to + " (" + tr + ")"; // from " + from + " to
    }
    TotalGoingTime() {
        var goingTime = 0;
        var tmpP = this;
        //this.points.Add(tmpP.ToString());
        while (tmpP.prev != null) {
            if (tmpP.myRoute == null /*&& tmpP.myRoute.hashcode == null*/) goingTime += tmpP.totalTimeSeconds - tmpP.prev.totalTimeSeconds;
            tmpP = tmpP.prev;
        }
        return goingTime;
    }
    TotalTransportChangingCount() {
        var result = 0;
        var tmpP = this;
        //this.points.Add(tmpP.ToString());
        while (tmpP.prev != null) {
            if (tmpP.myRoute != null && tmpP.myRoute.hashcode != null && tmpP.myRoute != tmpP.prev.myRoute) result++;
            tmpP = tmpP.prev;
        }
        return result;
    }
}

class Points {
    constructor(startPoint, finalPoint) {
        this.prototype = Object.create(Array.prototype);
        this.startPoint = startPoint;
        this.finalPoint = finalPoint;
        this.currentSelectedPoint = null;
        //this.points = new Array();
    }
    Find(station_or_point) {
        if (station_or_point.hashcode != undefined) {
            //foreach (Point p in points) if (p.Station.hashcode == station.hashcode) return p;
            if (station_or_point.Point != null) return station_or_point.Point;
            var newCreatdPoint = new Point(2160000000, station_or_point, null, null);
            this.prototype.push(newCreatdPoint);
            return newCreatdPoint;
        }
        else {
            for (var i = 0, n = this.prototype.length, p = this.prototype[0]; i < n; p = this.prototype[++i]) {
                if (p.coords == point.coords && p.StationCode == station_or_point.StationCode) return p;
            }
            return null;
        }
    }
    Fill(stationsList, goingSpeed, reservedTime, myIgnoringFragments) {
        //foreach (Station st in stationsList)
        for (var i = 0, n = stationsList.length, st = stationsList[0]; i < n; st = stationsList[++i]) {
            if (myIgnoringFragments != null && myIgnoringFragments.Contains(st.hashcode, null, null)) continue;

            var add = new Point(2160000000, st, null, null);
            add.tryUpdate(GetTimeForGoingTo(distance(this.startPoint.coords, st.coords), goingSpeed) + reservedTime, this.startPoint, null, null);
            this.prototype.push(add);
        }
    }
    Next() {
        //DateTime t0 = DateTime.Now;
        if (this.currentSelectedPoint != null) this.currentSelectedPoint.Visited();

        //points.Sort();


        //currentSelectedPoint = points[0];
        this.currentSelectedPoint = this.SelectPointWithMinimalMark();

        //currentSelectedPoint.currentGraph = (Points)this.Clone();
        //DEBUG_timeToCreateNext += DateTime.Now - t0;
        return this.currentSelectedPoint;
        //return currentSelectedPoint.visited ? currentSelectedPoint = null : currentSelectedPoint;
    }
    SelectPointWithMinimalMark() {
        var p = null;
        //foreach (Point t in points) if (!(t.visited))
        for (var i = 0, n = this.prototype.length, t = this.prototype[0]; i < n; t = this.prototype[++i]) if (!(t.visited)) {
            p = t;
            break;
        }
        if (p == null) return p;
        for (var i = 0, n = this.prototype.length, t = this.prototype[0]; i < n; t = this.prototype[++i]) if (!(t.visited) && t.totalTimeSeconds < p.totalTimeSeconds) p = t;
        return p;
    }
    CountShortWay(ignoringRoutes, myIgnoringFragments, time, types, speed, reservedTime) {
        //TimeSpan overLimitResedvedTime = TimeSpan.FromMinutes(20);

        //DEBUG_timeToCreateNext = new TimeSpan();
        //var t0 = DateTime.Now, t1;
        //var /*t_total = new TimeSpan(),*/ t_giversin = new TimeSpan(), t_finding_time = new TimeSpan()/*, t_upd_in_stations = new TimeSpan()*/;
        //var /*t_updating_total = new TimeSpan(),*/ t_going_check_total = new TimeSpan(), t_stations = new TimeSpan(), t_without_finding_marks = new TimeSpan();
        for (var selectedPoint = this.Next(), selectedPointStation, selectedPointTotalTimeSeconds, selectedPointStationHashcode, selectedPointMyRoute, momentWhenComingToStation, routesOnStation, selectedPointCoords; selectedPoint != null; selectedPoint = this.Next()) {
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            if ((selectedPointTotalTimeSeconds = selectedPoint.totalTimeSeconds) > this.finalPoint.totalTimeSeconds/* + overLimitResedvedTime*/) //... Пропускаем и удаляем, если значение метки превышает минимальное время до пункта назначения.
            {
                //points.Remove(selectedPoint);//
                break;
                //continue;//
            }
            //var t4 = DateTime.Now;
            //var t3 = DateTime.Now;
            selectedPointStation = selectedPoint.station;
            selectedPointStationHashcode = selectedPointStation.hashcode;
            selectedPointMyRoute = selectedPoint.myRoute;
            if (selectedPointStation != null) {
                // Момент, когда мы прибудем на остановку:
                momentWhenComingToStation = time + selectedPointTotalTimeSeconds;

                //t1 = DateTime.Now;
                // Загружаем маршруты, проходящие через остановку:
                routesOnStation = null;// = routesOnStation = Database.GetRoutesOnStation(selectedPointStation.hashcode, canReadDataFromLocalCopy: true);
                if (selectedPointStation.routes != null) routesOnStation = selectedPointStation.routes;
                else continue;

                //t_total += DateTime.Now - t1;
                for (var i = 0, n = routesOnStation.length, selectedRoute = routesOnStation[0], nextStation; i < n; selectedRoute = routesOnStation[++i]) {
                    if (ignoringRoutes != null && ignoringRoutes.includes(selectedRoute)) continue;
                    if (types.includes(selectedRoute.type)) {
                        //t1 = DateTime.Now;
                        // Следующая остановка у данного тран спорта:
                        nextStation = selectedRoute.getNextStation(selectedPointStation);

                        /*// Код остановки, на которую попадем на данном транспорте:
                        string nextCode = selectedRoute.getNextStationCodeAfter(selectedPointStation.hashcode, canReadDataFromLocalCopy: true);*/
                        //t_total += DateTime.Now - t1;
                        if (nextStation/*nextCode*/ != null) // Если остановка не является конечной, то:
                        {
                            //t1 = DateTime.Now;
                            // Загружаем расписание:
                            var table = selectedRoute.GetTimetable(selectedPointStation);//Database.GetTimetable(selectedPointStation.hashcode, selectedRoute.hashcode, databaseMysqlConnection, canReadDataFromLocalCopy: true);
                            //t_total += DateTime.Now - t1;
                            // Блокируем попытку попасть указанным транспортом на указанную остановку:
                            if (myIgnoringFragments.Contains(nextStation.hashcode/*nextCode*/, selectedRoute.hashcode, selectedPointStationHashcode)) continue;

                            if (table.type == TableType.table) // Если это точное расписание, то:
                            {
                                // Минимальный начальный момент, с который можно начинать ожидать посадку:
                                var momentWhenAskingForGoing = momentWhenComingToStation;

                                // Резервируем дополнительное время, если будем пересаживаться на другой маршрут:
                                //if (selectedPoint.RouteCode == null || selectedPoint.RouteCode != selectedRoute.hashcode) momentWhenAskingForGoing += reservedTime;
                                if (selectedPointMyRoute != null && selectedPointMyRoute != selectedRoute) momentWhenAskingForGoing += reservedTime;

                                //t1 = DateTime.Now;
                                // Подсчитываем, сколько будем ожидать этот транспорт на остановке:
                                var waitingTime = table.FindTimeAfter(momentWhenAskingForGoing);
                                //t_finding_time += DateTime.Now - t1;

                                // Момент, когда мы сядем в транспорт:
                                var momentWhenSitInTransport = momentWhenAskingForGoing + waitingTime;
                                //t1 = DateTime.Now;
                                /*// Следующая остановка у данного транспорта:
                                Station nextStation = Database.GetStationByHashcode(nextCode, databaseMysqlConnection, canReadDataFromLocalCopy: true);*/

                                // И соответствующее расписание на этой остановке:
                                var tbl = selectedRoute.GetTimetable(nextStation);//Database.GetTimetable(nextStation.hashcode, selectedRoute.hashcode, databaseMysqlConnection, canReadDataFromLocalCopy: true);
                                //t_total += DateTime.Now - t1;
                                //t1 = DateTime.Now;
                                // (сколько будем ехать до следующей остановки):
                                var goingOnTransportTime = tbl.FindTimeAfter(momentWhenSitInTransport);
                                //t_finding_time += DateTime.Now - t1;

                                // Метка времени:
                                var onNextPointtotalTimeSeconds = momentWhenSitInTransport - momentWhenComingToStation + goingOnTransportTime + selectedPointTotalTimeSeconds;
                                //t1 = DateTime.Now;
                                if (this.Find(nextStation).tryUpdate(onNextPointtotalTimeSeconds, selectedPoint, selectedPointStation, selectedRoute)) {
                                    //console.log("upd...");
                                }
                                //t_updating_total += DateTime.Now - t1;
                            }
                            else if (table.type == TableType.periodic) {
                                throw new NotImplementedException();
                            }
                        }
                    }
                }
            }
            //t_upd_in_stations = TimeSpan.FromMilliseconds(t_updating_total.TotalMilliseconds);
            //t_stations += DateTime.Now - t3;
            selectedPointCoords = selectedPoint.coords;
            //t_without_finding_marks += DateTime.Now - t4;
            // Нет смысла идти пешком "транзитом" через остановку:
            /*//11111111111111111111111111!!!!!!!!!!!!!!!!!*/
            if (selectedPointMyRoute == null) continue;
            //t4 = DateTime.Now;
            //var t2 = DateTime.Now;
            // Попробуем пройти пешком до других "вершин":
            for (var j = 0, m = this.prototype.length, p = this.prototype[0], distanceToSelectedPoint, goingTime, newTime; j < m; p = this.prototype[++j])
                if (!p.visited && p != selectedPoint) {
                    // Блокируем попытку дойти пешком до указанной остановки:
                    if (myIgnoringFragments.Contains(p.StationCode, null, selectedPointStationHashcode)) continue;

                    //t1 = DateTime.Now;
                    distanceToSelectedPoint = distance(selectedPointCoords, p.coords);
                    //t_giversin += DateTime.Now - t1;

                    goingTime = GetTimeForGoingTo(distanceToSelectedPoint, speed/*, true, sp*/);

                    newTime = selectedPointTotalTimeSeconds + goingTime + reservedTime;
                    /*if (p != myFinishPoint)*/ // newTime += reservedTime;
                    //t1 = DateTime.Now;
                    if (p.tryUpdate(newTime, selectedPoint, selectedPointStation, null)) {
                        //console.log("upd...");
                    }
                    //t_updating_total += DateTime.Now - t1;
                }
            //t_going_check_total += DateTime.Now - t2;

            //t_without_finding_marks += DateTime.Now - t4;
            if (myIgnoringFragments.Contains(null, null, selectedPointStationHashcode)) continue;
            //t1 = DateTime.Now;

            var tryingNewTime = selectedPointTotalTimeSeconds + GetTimeForGoingTo(distance(selectedPointCoords, this.finalPoint.coords), speed);
            if (this.finalPoint.tryUpdate(tryingNewTime, selectedPoint, selectedPointStation, null)) {
                //console.log("upd: " + selectedPointStation.hashcode);
            }
            //t_updating_total += DateTime.Now - t1;
        }

        //t1 = DateTime.Now;
        // Сокращаем время ходьбы пешком до минимума и избавляемся от "бессмысленных" пересадок, сохраняя общее время неизменным:
        var currentPoint = this.finalPoint.prev;
        while (currentPoint != this.startPoint) {
            var r = currentPoint.myRoute;
            if (r != null) {
                var previousPoint = currentPoint.prev;
                if (previousPoint != this.startPoint && previousPoint.myRoute != r) // Если на предыдущую остановку мы добрались другим транспортом, то:
                {
                    var previousRouteStation = r.getPreviousStation(previousPoint.station);
                    if (previousRouteStation != null) {
                        var point = previousRouteStation.Point;
                        if (point != null && point.visited) {
                            var ttt = r.GetTimetable(previousRouteStation);
                            if (ttt != null) {
                                var ddd = time + previousPoint.totalTimeSeconds;
                                var moment = r.GetTimetable(currentPoint.station).FindTimeAfter(ddd);
                                var tmp_time = ttt.FindTimeBefore(ddd + moment);

                                var momentArriveOnCurrent = previousPoint.totalTimeSeconds + moment;
                                var momentSittingOnPrevious = momentArriveOnCurrent + tmp_time;
                                /*bool bbb = point.myRoute != null && point.myRoute.GetTimetable(point.station) != null && point.myRoute.GetTimetable(point.station).FindTimeAfter(time + point.totalTimeSeconds) <= previousPoint.totalTimeSeconds + moment + tmp_time;
                                if (bbb)
                                {
                                    previousPoint.myRoute = r;
                                    previousPoint.prev = point;////!bbb && point.totalTimeSeconds <= momentSittingOnPrevious &&
                            }
                            else */
                                if (/*point.TotalGoingTime>=previousPoint.TotalGoingTime || */point.totalTimeSeconds <= previousPoint.totalTimeSeconds/* && point.TotalGoingTime <= previousPoint.TotalGoingTime*/) {
                                    previousPoint.myRoute = r;
                                    previousPoint.prev = point;
                                }
                            }
                        }
                    }
                }
            }
            currentPoint = currentPoint.prev;
        }
    }


}


class IgnoringFragments {
    constructor() {
        this.prototype = Object.create(Array.prototype);
        if (arguments[0] != undefined && arguments[0] != null && arguments[0].length != 0) {
            try {
                this.prototype = this.prototype.concat(arguments[0]);
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    }
    Contains(stationCode, routeCode, fromStationCode) {
        for (var i = 0, n = this.prototype.length, r = this.prototype[0]; i < n; r = this.prototype[++i]) {
            if (r.routeCode == routeCode && r.stationCode == stationCode && r.fromStationCode == fromStationCode) return true;
        }
        return false;
    }
}

class OptimalRoutesCollection {
    constructor() {
        this.prototype = Object.create(Array.prototype);
    }
    GetOptimalWays() {
        var result = new Array();
        for (var i = 0, n = this.prototype.length, r = this.prototype[0]; i < n; r = this.prototype[++i]) {
            result.push(new OptimalWay(r));
        }
        return result;
    }
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
        //if (types == null) types = new RouteType[] { RouteType.bus, RouteType.trolleybus, /*RouteType.tram, RouteType.metro, RouteType.express_bus, RouteType.marsh*/ };
        this.types = types;//{ RouteType.bus };//

        var myIgnoringFragments = null;
        if (ignoringList != null) myIgnoringFragments = new IgnoringFragments(ignoringList);
        else myIgnoringFragments = new IgnoringFragments();

        var myStartPoint = new Point(0, nowPos, null, null);
        var myFinishPoint = new Point(2160000000, needPos, null, null);
        myFinishPoint.tryUpdate(GetTimeForGoingTo(distance(nowPos, needPos), goingSpeed) + 1200/*+ TimeSpan.FromMinutes(20)*/, myStartPoint, null, null);//!!!!!!!!!!!!!!!!!
        //myFinishPoint.tryUpdate(GetTimeForGoingTo(GoogleApi.GetWalkingDistance(nowPos, needPos), goingSpeed), myStartPoint, null, null);
        var myPoints = new Points(myStartPoint, myFinishPoint);
        // Получим "начальный" список станций:
        var stationsList = GetStationsAround(myPoints.startPoint.coords, distance(myPoints.startPoint.coords, myPoints.finalPoint.coords));
        myPoints.Fill(stationsList, goingSpeed, reservedTimeSeconds, myIgnoringFragments);

        // Находим кратчайшие пути до всех вершин:
        myPoints.CountShortWay(this.ignoringRoutes, myIgnoringFragments, time, types, goingSpeed, reservedTimeSeconds);

        var tmpP = myPoints.finalPoint;
        this.points.push(tmpP.toString());////
        while (tmpP.prev != null) {
            tmpP = tmpP.prev;//
            this.points.push(tmpP.toString());
            if (tmpP.prev == null && tmpP.coords != myPoints.startPoint.coords)
                throw new Exception("Где-то удалилась часть маршрута...");
        }

        this.totalTimeSeconds = myPoints.finalPoint.totalTimeSeconds;
        this.totalGoingTime = myPoints.finalPoint.TotalGoingTime();
        this.totalTransportChangingCount = myPoints.finalPoint.TotalTransportChangingCount();

        this.myPoints = myPoints;
        this.myIgnoringFragments = myIgnoringFragments;


        this.visited = false;
    }

    Visited() {
        this.visited = true;
    }
    static SelectOptimalRouteWithMinimalMark(points) {
        var p = null;
        //foreach (OptimalRoute t in points) if (!(t.visited))
        for (var i = 0, n = points.prototype.length, t = points.prototype[0]; i < n; t = points.prototype[++i]) if (!(t.visited)) {
            p = t;
            break;
        }
        if (p == null) return p;

        for (var i = 0, n = points.prototype.length, t = points.prototype[0]; i < n; t = points.prototype[++i]) if (!(t.visited) && t.totalTimeSeconds < p.totalTimeSeconds) p = t;

        return p;
    }



    static FindOptimalRoutes(nowPos, needPos, time, types, speed, dopTimeMinutes) {
        var findedOptimalRoutes = new OptimalRoutesCollection();

        findedOptimalRoutes.prototype.push(new OptimalRoute(nowPos, needPos, time, types, speed, dopTimeMinutes));

        var ignoringRoutes = new Array();

        var ignoringFragments = new IgnoringFragments();

        for (var selectedOptimalRoute = findedOptimalRoutes.prototype[0]; selectedOptimalRoute != null; selectedOptimalRoute.Visited(), selectedOptimalRoute = OptimalRoute.SelectOptimalRouteWithMinimalMark(findedOptimalRoutes)) {
            var ddd = 0.25;

            ignoringRoutes = new Array();
            // Проходим по всем ребрам выбранного пути и строим новые маршруты при удалении ребер:
            for (var tmpP = selectedOptimalRoute.myPoints.finalPoint; tmpP.prev != null; tmpP = tmpP.prev) {
                if (tmpP.myRoute != null && !ignoringRoutes.includes(tmpP.myRoute)) ignoringRoutes.push(tmpP.myRoute);
            }
            for (var i = 0, n = ignoringRoutes.length, r = ignoringRoutes[0]; i < n; r = ignoringRoutes[++i]) {
                if (selectedOptimalRoute.ignoringRoutes.includes(r)) continue;
                var ignoringRoutesAdd = new Array();
                ignoringRoutesAdd = ignoringRoutesAdd.concat(selectedOptimalRoute.ignoringRoutes);
                ignoringRoutesAdd.push(r);
                var tmpOptimalRoute = new OptimalRoute(nowPos, needPos, time, types, speed, dopTimeMinutes, ignoringRoutesAdd);

                if (tmpOptimalRoute.totalTimeSeconds <= findedOptimalRoutes.prototype[0].totalTimeSeconds / ddd) {
                    var tmpJSON = JSON.stringify(tmpOptimalRoute.points);
                    var ok = false;
                    for (var j = 0, m = findedOptimalRoutes.prototype.length, opt = findedOptimalRoutes.prototype[0]; j < m; opt = findedOptimalRoutes.prototype[++j]) {
                        if (JSON.stringify(opt.points) == tmpJSON) {
                            ok = true;
                            break;
                        }
                    }
                    if (ok) continue;
                    findedOptimalRoutes.prototype.push(tmpOptimalRoute);
                }
            }
        }
        return findedOptimalRoutes;
    }

}


class WayPoint {
    constructor(time, station, route, coords) {
        /*try
        {*/
        this.time = time;//.toString();
        this.station = station == null ? null : { hashcode: station.hashcode, name: station.name, routes: null, Coords: { lat: station.coords.lat, lng: station.coords.lng } };//station.name;//new Station(station.hashcode, station.nameRus, station.nameEn, station.nameBy, (int)(10000 * station.lat), (int)(10000 * station.lng), null, station.name); //station;
        this.route = route == null ? null : { vehicles: [], gpsTrack: null, hashcode: route.hashcode, number: route.number, type: route.type, from: route.from, to: route.to, owner: "", stations: null, timetables: null, stationsJSON: null }//route.from + " - " + route.to//new Route(route.hashcode, JsonConvert.SerializeObject(new string[] { route.from, route.to }), JsonConvert.SerializeObject(new string[] { route.from, route.to }), JsonConvert.SerializeObject(new string[] { route.from, route.to }), JsonConvert.SerializeObject(new string[] { route.from, route.to }), null, route.number, route.type, route.owner); //route;
        this.coords = coords;
        /*}
        catch (Exception ex)
        {

        }*/
    }
}
class OptimalWay {
    constructor(optimalRoute) {
        this.totalTimeSeconds = optimalRoute.totalTimeSeconds;
        this.totalGoingTimeSeconds = optimalRoute.totalGoingTime;
        this.totalTransportChangingCount = optimalRoute.totalTransportChangingCount;
        this.points = new Array();
        var optRoutePoints = optimalRoute.myPoints;
        //this.points.push(new WayPoint(optRoutePoints.startPoint.totalTimeSeconds, optRoutePoints.startPoint.station, optRoutePoints.startPoint.myRoute, optRoutePoints.startPoint.coords));

        //var tmp = new Array();
        for (var tmpP = optimalRoute.myPoints.finalPoint; tmpP/*.prev*/ != null; tmpP = tmpP.prev) {
            this.points.push(new WayPoint(tmpP.totalTimeSeconds, tmpP.station, tmpP.myRoute, tmpP.coords));
        }
        this.points.reverse();
        //this.points.concat(tmp);

        /*foreach (OptimalRoute.Points.Point p in optRoutePoints)
        {
            points.Add(new WayPoint(p.Station, p.myRoute, p.coords));
        }
        points.Add(new WayPoint(optRoutePoints.finalPoint.Station, optRoutePoints.finalPoint.myRoute, optRoutePoints.finalPoint.coords));*/
    }

}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// End algorithm.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
