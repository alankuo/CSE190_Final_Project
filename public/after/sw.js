const staticCacheName = 'cse-190-final';
const cacheFiles = [
  "_images/about/c20.jpg",
    "_images/about/cf.jpg",
    "_images/about/srs.jpg",
    "_resources/bootstrap/fonts/glyphicons-halflings-regular.woff",
    "_resources/bootstrap/javascripts/bootstrap.min.js",
    "_resources/css/custom.css",
    "_resources/css/styles.css",
    "_resources/css/vendor/ajax-loader.gif",
    "_resources/css/vendor/anim_fa.css",
    "_resources/css/vendor/slick-theme.css",
    "_resources/css/vendor/slick.css",
    "_resources/img/bg_attend.jpg",
    "_resources/img/bg_blue_lines.png",
    "_resources/img/bg_campaign.jpg",
    "_resources/img/bg_campus_life_hero.jpg",
    "_resources/img/bg_campus_life.jpg",
    "_resources/img/bg_event_multiple.jpg",
    "_resources/img/bg_map.jpg",
    "_resources/img/bg_research.jpg",
    "_resources/img/fb.png",
    "_resources/img/ic.png",
    "_resources/img/icon_arrow.png",
    "_resources/img/icon_close.png",
    "_resources/img/icon_search.png",
    "_resources/img/ig.png",
    "_resources/img/lk.png",
    "_resources/img/logo.png",
    "_resources/img/logow.png",
    "_resources/img/placeholder_ig.jpg",
    "_resources/img/tw.png",
    "_resources/img/ucsd180x180.jpg",
    "_resources/js/myscripts.js",
    "_resources/js/vendor/jquery.easings.min.js",
    "_resources/js/vendor/jquery.matchHeight.js",
    "_resources/js/vendor/jquery.min.js",
    "_resources/js/vendor/responsive-tabs.js",
    "_resources/js/vendor/slick.min.js",
    "_resources/vid/vid-poster.jpg",
    "404.html",
    "favicon.ico",
    "index.html",
    "manifest.json",
];

// sw install
self.addEventListener('install', function(event) {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(function(cache) {
      return cache.addAll(cacheFiles);
    })
    .catch(function(error) {
      console.log(`Error: ${error}`);
    })
  );
});

// sw fetch
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(staticCacheName).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          if (event.request.method != "POST") {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(function(error) {
          //console.log(error);
          return caches.match('./404.html');
        });;
      });
    })
  );
});

// sw activate
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== staticCacheName) {
          //console.log('Removed cache: ' + key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});