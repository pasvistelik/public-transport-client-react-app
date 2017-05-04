import DataProvider from './dataProvider';
import ApiConfig from './config';
//import AppClient from './client';
//let s = '123hello123';
//console.log('111111111111111111111111111111111111111111');

//if (navigator.onLine === undefined || navigator.onLine === false){
  DataProvider.loadDataAndInitialize();
//}
//else {
//  DataProvider.loadDataOnly();
//}

const APP_CACHE_NAME = 'mosm-app-v1';
const TILE_CACHE_NAME = 'mosm-tiles-v1';

const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/style.css',
  ApiConfig.apiGetStationsUrl,
  ApiConfig.apiGetRoutesUrl,
  ApiConfig.apiGetTimetablesUrl
];

self.addEventListener('install', function(event) {
  //console.log('!!!!!!!!!install');

  // Perform install steps
  const cachePromise = caches.open(APP_CACHE_NAME)
    .then(function(cache) {
      console.log('install: opened cache');
      return cache.addAll(urlsToCache);
    })
    .then(() => {
      console.log('install: added all urls to cache');
    });

  event.waitUntil(cachePromise);
});

self.addEventListener('activate', function(event) {
  //console.log('!!!!!!!!!activate');

  /**/
});

/*self.addEventListener('fetch', function(event) {
  console.log('there is a fetch');
  const { url } = event.request;

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log('responding from cache', url);
          return response;
        }
        console.log('fetching and adding to cache', url);
        caches.open(TILE_CACHE_NAME).then(cache => cache.add(url));

        return fetch(event.request);
      }
    )
  );
});*/

/*self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).catch(function() {
      return fetch(event.request).then(function(response) {
        return caches.open('v1').then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });  
      });
    })
  );
});*/

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});