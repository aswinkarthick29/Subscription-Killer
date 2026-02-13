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