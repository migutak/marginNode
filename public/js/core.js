// public/core.js
var app = angular.module('app', ['loginController','signinCtrl', 'marginService','ui.router']);

app.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})
 
app.constant('API_ENDPOINT', {
  url: 'http://localhost:8000/api'
});

app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
      }[response.status], response);
      return $q.reject(response);
    }
  };
});
 
app.config(function ($httpProvider,$stateProvider, $urlRouterProvider) {
	$stateProvider
	  .state('outside', {
	    url: '/outside',
	    abstract: true,
	    templateUrl: 'templates/outside.html'
	  })
	  .state('outside.login', {
	    url: '/login',
	    templateUrl: 'templates/login.html',
	    controller: 'LoginCtrl'
	  })
	  .state('outside.register', {
	    url: '/register',
	    templateUrl: 'templates/register.html',
	    controller: 'RegisterCtrl'
	  })
	  .state('inside', {
	    url: '/inside',
	    templateUrl: 'templates/inside.html',
	    controller: 'InsideCtrl'
	  });
	 
	  //$urlRouterProvider.otherwise('/login');

  	  $httpProvider.interceptors.push('AuthInterceptor');

});

app.run(function ($rootScope, $window, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$locationChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      if(next !== "http://127.0.0.1:8000"){
          $window.open('/','_self');
      }
    }
  });
});