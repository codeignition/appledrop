self.addEventListener('install', function(event) {
  console.log("installed");
});

self.addEventListener('activate', function(event) {
    // Perform some task
  console.log("activated");
  });

self.addEventListener('fetch', function(event) {
  console.log("fetched");
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});