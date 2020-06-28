const staticDevCoffee = "dev-digicoach-qclwye";
const assets = [
"/",
"/index.html",
"/assets/03029be1.jpg",
"/assets/0cf9497c.jpg",
"/assets/0d70914e.jpg",
"/assets/18ccbf4f.jpg",
"/assets/29ad58d6.jpg",
"/assets/2a0fc012.jpg",
"/assets/2d9e076f.jpg",
"/assets/2ec91c15.jpg",
"/assets/30407b70.jpg",
"/assets/39def14d.jpg",
"/assets/3d7a0ade.jpg",
"/assets/3ebb8910.jpg",
"/assets/44a3e0d9.jpg",
"/assets/4ec058b1.jpg",
"/assets/634e7c01.jpg",
"/assets/7437c4e1.jpg",
"/assets/7e15757a.jpg",
"/assets/7e5d3e91.jpg",
"/assets/7f0bbca7.jpg",
"/assets/8729dc8a.jpg",
"/assets/89fbd6fd.jpg",
"/assets/996fe7f6.jpg",
"/assets/9d503938.jpg",
"/assets/9d90ccb3.jpg",
"/assets/9ed09caa.jpg",
"/assets/9ed616e8.jpg",
"/assets/NoSleep.min.js",
"/assets/Tone.min.js",
"/assets/a3a9ae00.jpg",
"/assets/b15a83fa.jpg",
"/assets/b5d37e78.jpg",
"/assets/c4ede2d6.jpg",
"/assets/cfd1348d.jpg",
"/assets/dd234c27.jpg",
"/assets/e0f77abd.jpg",
"/assets/e94ed8aa.jpg",
"/assets/exer_data.js",
"/assets/f5595ed8.jpg",
"/assets/fonts.css",
"/assets/main.css",
"/assets/main.js",
"/assets/serviceWorker.js",
"/assets/vue.js"
];

self.addEventListener("install", installEvent => {
installEvent.waitUntil(
caches.open(staticDevCoffee).then(cache => {
cache.addAll(assets);
})
);
});

self.addEventListener("fetch", fetchEvent => {
fetchEvent.respondWith(
caches.match(fetchEvent.request).then(res => {
return res || fetch(fetchEvent.request);
})
);
});