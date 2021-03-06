//imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL =[
    'img/favicon.ico',
    'index.html',
    'style/base.css',
    'style/bg.png',
    'js/app.js',
    'js/sw-utils.js',
    'js/base.js'
];

const APP_SHELL_INMUTABLE = [
    'style/animate.css',
        'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'https://cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.min.js'
];

self.addEventListener('install', e =>{
    const cacheStatic = caches.open(STATIC_CACHE).then(cache=>
        cache.addAll(APP_SHELL));
        const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache=>
            cache.addAll(APP_SHELL_INMUTABLE));

        e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));
});

self.addEventListener('activate',e=>{
    const respuesta = caches.keys().then(keys=>{
        keys.forEach(key=>{
            if(key!=STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
            if(key!=DYNAMIC_CACHE && key.includes('dynamic')){
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
});

self.addEventListener('fetch',e=>{
    const respuesta = caches.match(e.request).then(resp=>{
        if(resp){
            return resp;
        }else{
            return fetch(e.request).then(newResp =>{
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newResp);
            });
        }

    });
    e.respondWith(respuesta);
});
