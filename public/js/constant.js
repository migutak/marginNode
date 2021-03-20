var app = angular.module('app',[]);
 
app.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})
 
app.constant('API_ENDPOINT', {
  url: 'http://localhost:8000/api'
});