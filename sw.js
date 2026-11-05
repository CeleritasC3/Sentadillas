var C='sentadillas-v4',CDN='cdn-v1',F=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(F)}));self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C&&x!==CDN}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var ext=new URL(e.request.url).origin!==location.origin,nombre=ext?CDN:C;
  var red=function(){return fetch(e.request).then(function(r){if(r&&r.status===200){var cp=r.clone();caches.open(nombre).then(function(c){return c.put(e.request,cp)}).catch(function(){})}return r})};
  if(ext){e.respondWith(caches.match(e.request).then(function(r){return r||red()}));return}
  e.respondWith(red().catch(function(){return caches.match(e.request)}));
});
