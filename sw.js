// This listener waits for the 'push' event from the system
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    // When user clicks the notification, open the app
    event.waitUntil(
        clients.openWindow('/')
    );
});
// Add this to your sw.js file
self.addEventListener('fetch', function(event) {
    // This can be empty, but it MUST exist for the install button to show up

});
// This is the minimum code required for the "Install" button to appear
self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
});

self.addEventListener('fetch', (event) => {
    // This allows the app to be installable
});
