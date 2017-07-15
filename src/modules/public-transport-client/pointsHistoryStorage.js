import distance from 'geo-coords-distance';

const dbName = "public_transport";
const storeName = "points_history";

async function getPointsHistoryStorageConnection() {
    let promise = new Promise(function (resolve, reject) {
        let request = indexedDB.open(dbName, 1);
        request.onerror = function(event) {
            reject(event.target.error);
        }
        request.onsuccess = function(event) {
            resolve(event.target.result);
        }
        request.onupgradeneeded = async function(event) {
            let db = event.target.result;
            let objectStore = db.createObjectStore(storeName, { keyPath: "key", autoIncrement:true});
            objectStore.createIndex("description", "description", { unique: true });
            objectStore.createIndex("lat", "lat", { unique: false });
            objectStore.createIndex("lng", "lng", { unique: false });
            
            let result = await getPointsHistoryStorageConnection();
            resolve(result);
        }
    });
    return await promise;
}

async function getAllPoints() {
    let promise = new Promise(async function (resolve, reject) {
        let items = [];
        let db = await getPointsHistoryStorageConnection();
        //console.log(db);
        let transaction = db.transaction([storeName]);
        let objectStore = transaction.objectStore(storeName);

        //let request = objectStore.getAll();
        
        var request = objectStore.openCursor();
        request.onsuccess = function(evt) {                    
            var cursor = evt.target.result;
            if (cursor) {
                items.push(cursor.value);
                cursor.continue();
            }
            else resolve(items);
        };
        request.onerror = function(event) {
            reject(event.target.error);
        }
    });
    return await promise;
}
async function tryFindByCoords(coords) {
    const pointsHistory = await getAllPoints();
    let candidate = null;
    for (let i = 0, n = pointsHistory.length, currentPoint = pointsHistory[0], findedDistance = 150; i < n; currentPoint = pointsHistory[++i]) {
        const currentDistance = distance(coords, {lat: currentPoint.lat, lng: currentPoint.lng});
        if (currentDistance < findedDistance) {
            findedDistance = currentDistance;
            candidate = currentPoint;
        }
    }
    return candidate;
}
async function tryPush(point) {
    const pointsHistory = await getAllPoints();
    for (let i = 0, n = pointsHistory.length, currentPoint = pointsHistory[0]; i < n; currentPoint = pointsHistory[++i]) {
        if (distance(point.coords, {lat: currentPoint.lat, lng: currentPoint.lng}) < 50) return null;
    }

    let promise = new Promise(async function (resolve, reject) {
        let db = await getPointsHistoryStorageConnection();
        //console.log(db);
        let transaction = db.transaction([storeName], "readwrite");
        let objectStore = transaction.objectStore(storeName);
        let request = objectStore.add({
            lat: point.coords.lat,
            lng: point.coords.lng,
            description: point.description
        });
        request.onerror = function(event) {
            reject(event.target.error);
        }
        request.onsuccess = function(event) {
            resolve(event.target.result);
        }
    });
    return await promise;
}


class PointsHistoryStorage {
    static async getAllPoints() {
        return await getAllPoints();
    }
    static async tryPush(point) {
        return await tryPush(point);
    }
    static async tryFindByCoords(coords) {
        return await tryFindByCoords(coords);
    }
}

export default PointsHistoryStorage;