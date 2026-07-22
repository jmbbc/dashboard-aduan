'use strict';

const CACHE_NAME = 'ppm-technician-v4';
const CORE_ASSETS = [
    './ppm-form.html',
    './backend-config.js',
    './ppm-offline-store.js',
    './manifest.webmanifest',
    './ppm-icon.svg'
];
const VENDOR_ASSETS = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/fonts/bootstrap-icons.woff2'
];

async function cacheAsset(cache, asset) {
    const request = new Request(asset, { mode: asset.startsWith('http') ? 'no-cors' : 'same-origin' });
    const response = await fetch(request);
    await cache.put(request, response);
}

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(CORE_ASSETS);
        await Promise.all(VENDOR_ASSETS.map((asset) => cacheAsset(cache, asset)));
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)));
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.hostname === 'script.google.com' || url.hostname.endsWith('.googleusercontent.com')) return;

    if (request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                const response = await fetch(request);
                const cache = await caches.open(CACHE_NAME);
                await cache.put('./ppm-form.html', response.clone());
                return response;
            } catch (error) {
                return (await caches.match('./ppm-form.html')) || Response.error();
            }
        })());
        return;
    }

    event.respondWith((async () => {
        const cached = await caches.match(request);
        if (cached) return cached;

        try {
            const response = await fetch(request);
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
            return response;
        } catch (error) {
            return Response.error();
        }
    })());
});
