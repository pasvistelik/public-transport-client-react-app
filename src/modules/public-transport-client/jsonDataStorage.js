//import ApiConfig from './config';

const dbName = "public_transport2";
const storeName = "json_data";

async function getJsonDataStorageConnection() {
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
            let objectStore = db.createObjectStore(storeName, { keyPath: "name"});
            objectStore.createIndex("json", "json", { unique: false });
            
            let result = await getJsonDataStorageConnection();
            resolve(result);
        }
    });
    return await promise;
}
async function tryPush(obj) {
    let promise = new Promise(async function (resolve, reject) {
        let db = await getJsonDataStorageConnection();
        //console.log(db);
        let transaction = db.transaction([storeName], "readwrite");
        let objectStore = transaction.objectStore(storeName);
        let request = objectStore.add({
            name: obj.name,
            json: obj.json
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
async function getItem(name) {
    let promise = new Promise(async function (resolve, reject) {
        let db = await getJsonDataStorageConnection();
        let transaction = db.transaction([storeName]);
        let objectStore = transaction.objectStore(storeName);

        var request = objectStore.get(name);
        request.onsuccess = function(event) { 
            if(event.target.result !== undefined) {                  
                resolve(event.target.result.json);
            }
            else {
                //resolve(null);
                reject(event.target.error);
            }
        };
        request.onerror = function(event) {
            reject(event.target.error);
        }
    });
    return await promise;
}

class JsonDataStorage {
    static async getAllStations() {
        try {
            return await getItem('allStations');
        } 
        catch(e){
            return null;
        }
    }
    static async getAllRoutes() {
        try {
            return await getItem('allRoutes');
        } 
        catch(e){
            return null;
        }
    }
    static async getAllTimetables() {
        try {
            return await getItem('allTimetables');
        } 
        catch(e){
            return null;
        }
    }
    static async pushAllStations(allStationsJson) {
        try {
            return await tryPush({
                name: 'allStations',
                json: allStationsJson
            });
        } 
        catch(e){
            return null;
        }
    }
    static async pushAllRoutes(allRoutesJson) {
        try {
            return await tryPush({
                name: 'allRoutes',
                json: allRoutesJson
            });
        } 
        catch(e){
            return null;
        }
    }
    static async pushAllTimetables(allTimetablesJson) {
        try {
            return await tryPush({
                name: 'allTimetables',
                json: allTimetablesJson
            });
        } 
        catch(e){
            return null;
        }
    }
}

export default JsonDataStorage;