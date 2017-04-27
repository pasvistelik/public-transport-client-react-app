'use strict';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Client.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var findedOptimalWays = null;
var totalTimePercent = 1;
var totalGoingTimePercent = 1;
var totalTransportChangingCountPercent = 1;

var sortedArr = new Array();
var minimalTimeSeconds = 0;
var minimalGoingTimeSeconds = 0;
var minimalTransportChangingCount = 0;


var fromPosition = null;
var toPosition = null;
var myStartTime = 0;
var types = ["bus", "trolleybus"];
var my_speed = 5;
var my_dopTimeMinutes = 2;



function customizeFindedOptimalWaysStart(totalTimePercentValue, totalGoingTimePercentValue, totalTransportChangingCountPercentValue) {
    if (findedOptimalWays != null) {
        totalTimePercent = totalTimePercentValue;
        totalGoingTimePercent = totalGoingTimePercentValue;
        totalTransportChangingCountPercent = totalTransportChangingCountPercentValue;

        minimalTimeSeconds = parseFloat(findedOptimalWays[0].totalTimeSeconds);
        minimalGoingTimeSeconds = parseFloat(findedOptimalWays[0].totalGoingTimeSeconds);
        minimalTransportChangingCount = parseFloat(findedOptimalWays[0].totalTransportChangingCount);
        for (var i = 1; i < findedOptimalWays.length; i++) {
            if (parseFloat(findedOptimalWays[i].totalTimeSeconds) < minimalTimeSeconds) minimalTimeSeconds = parseFloat(findedOptimalWays[i].totalTimeSeconds);
            if (parseFloat(findedOptimalWays[i].totalGoingTimeSeconds) < minimalGoingTimeSeconds) minimalGoingTimeSeconds = parseFloat(findedOptimalWays[i].totalGoingTimeSeconds);
            if (parseFloat(findedOptimalWays[i].totalTransportChangingCount) < minimalTransportChangingCount) minimalTransportChangingCount = parseFloat(findedOptimalWays[i].totalTransportChangingCount);
        }
        if (minimalTransportChangingCount < 1) minimalTransportChangingCount = 1;

        sortedArr = new Array();

        //

        var tmpTransportChangingCountEffictivity = 0;//parseFloat(findedOptimalWays[0].totalTransportChangingCount) == 0 ? 1 : (minimalTransportChangingCount / parseFloat(findedOptimalWays[0].totalTransportChangingCount));
        var max_rank = 0;//minimalTimeSeconds / parseFloat(findedOptimalWays[0].totalTimeSeconds) * totalTimePercent + minimalGoingTimeSeconds / parseFloat(findedOptimalWays[0].totalGoingTimeSeconds) * totalGoingTimePercent + tmpTransportChangingCountEffictivity * totalTransportChangingCountPercent;
        var index = -1;
        for (var j = 0; j < findedOptimalWays.length/* && j < 3*/; j++) {
            max_rank = 0;//!!!
            index = -1;
            for (var i = 0; i < findedOptimalWays.length; i++) {
                if (jQuery.inArray(i, sortedArr) == -1) {
                    tmpTransportChangingCountEffictivity = parseFloat(findedOptimalWays[i].totalTransportChangingCount) == 0 ? 1 : (minimalTransportChangingCount / parseFloat(findedOptimalWays[i].totalTransportChangingCount));
                    var tmp_rank = minimalTimeSeconds / parseFloat(findedOptimalWays[i].totalTimeSeconds) * totalTimePercent + minimalGoingTimeSeconds / parseFloat(findedOptimalWays[i].totalGoingTimeSeconds) * totalGoingTimePercent + tmpTransportChangingCountEffictivity * totalTransportChangingCountPercent;
                    if (tmp_rank >= max_rank) {
                        max_rank = tmp_rank;
                        index = i;
                    }
                }
            }
            if (index != -1) {
                sortedArr.push(index);
            }
            //!!!!!!!!!!!!!!addFindedWayToList(findedOptimalWays[j], minimalTimeSeconds, minimalGoingTimeSeconds, minimalTransportChangingCount);
        }
        return sortedArr;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// End client.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
