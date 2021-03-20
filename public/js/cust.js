var app = angular.module('app', ['ui.router','custCtrl','marginService','angularMoment','ng-mfb']);

app.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})
 
app.constant('API_ENDPOINT', {
  url: 'http://localhost:8000/api'
});

app.run(function ($rootScope, $window, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$locationChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      if(next !== "http://127.0.0.1:8000/login.html" || next !== "http://127.0.0.1:8000" || next !== "http://127.0.0.1:8000/signup"){
          $window.open('/','_self');
      }      
    }
  });
});

app.config(function($stateProvider, $urlRouterProvider) {
	// For any unmatched url, send to /route1 
	$urlRouterProvider.otherwise("/home")

	$stateProvider
	.state('home', {
		url : "/home",
		templateUrl : "templates/home_cust.html",
		controller : 'custCtrl'
	}).state('homeswap', {
		url : "/homeswap",
		templateUrl : "templates/home_cust_swap.html",
		controller : 'custCtrlswap'
	}).state('homeforward', {
		url : "/homeforward",
		templateUrl : "templates/home_cust_forward.html",
		controller : 'custCtrl'
	}).state('homemoneymarket', {
		url : "/homemoneymarket",
		templateUrl : "templates/home_cust_mm.html",
		controller : 'custCtrl'
	})
	.state('newoffer', {
		url : "/newoffer/:orderid",
		templateUrl : "templates/newoffer.jsp",
		controller : 'newofferCtrl'
	})
	.state('login', {
		url : "/login",
		templateUrl : "login.html"
	})
	.state('offeraccept', {
		url : "/offeraccept/:offerid",
		templateUrl : "templates/offeraccept.html",
		controller : 'offeracceptCtrl'
	}).state('forwardofferaccept', {
		url : "/forwardofferaccept/:offerid",
		templateUrl : "templates/offeraccept_forward.html",
		controller : 'forwardofferacceptCtrl'
	}).state('offeraccept_swap', {
		url : "/offeraccept_swap/:offerid",
		templateUrl : "templates/offeraccept_swap.html",
		controller : 'offeracceptswapCtrl'
	}).state('offeraccept_mm', {
		url : "/offeraccept_mm/:offerid",
		templateUrl : "templates/offeraccept_mm.html",
		controller : 'offeracceptmmCtrl'
	}).state('profile', {
		url : "/profile",
		templateUrl : "templates/profile_cust.html",
		controller : 'profileCtrl'
	}).state('rptorders', {
		url : "/rptorders",
		templateUrl : "templates/rptorders.html",
		controller : 'reportCtrl'
	}).state('rptconfirmations', {
		url : "/rptconfirmations",
		templateUrl : "templates/rptconfirmations.html",
		controller : 'reportCtrl'
	}).state('rptexceptions', {
		url : "/rptexceptions",
		templateUrl : "templates/rptexceptions.html",
		controller : 'reportCtrl'
	}).state('rptpayments', {
		url : "/rptpayments",
		templateUrl : "templates/rptpaymentscust.html",
		controller : 'reportCtrl'
	}).state('custconfirmations', {
		url : "/custconfirmations",
		templateUrl : "templates/custconfirmations.html",
		controller : 'custconfirmationsCtrl'
	}).state('custconfirmations_swap', {
		url : "/custconfirmations_swap",
		templateUrl : "templates/custconfirmations_swap.html",
		controller : 'custconfirmations_swapCtrl'
	}).state('custconfirmations_forward', {
		url : "/custconfirmations_forward",
		templateUrl : "templates/custconfirmations_forward.html",
		controller : 'custconfirmations_forwardCtrl'
	}).state('custconfirmations_mm', {
		url : "/custconfirmations_mm",
		templateUrl : "templates/custconfirmations_mm.html",
		controller : 'custconfirmationsmmCtrl'
	}).state('acceptDetails', {
		url : "/acceptDetails/:offerid",
		templateUrl : "templates/acceptDetails.html",
		controller : 'acceptsdetailsCtrl'
	}).state('forwardschedule', {
		url : "/forwardschedule/:freq/:nofreq/:startdate/:buyorderamountccy/:buyorderamount/:sellorderamountccy/:sellorderamount",
		templateUrl : "templates/forwardschedule.html",
		controller : 'sheduleCtrl'
	}).state('neworder', {
		url : "/neworder",
		templateUrl : "templates/neworder.html",
		controller : 'neworderCtrl'
	}).state('newswap', {
		url : "/newswap",
		templateUrl : "templates/newswap.html",
		controller : 'newswaporderCtrl'
	}).state('newforward', {
		url : "/newforward",
		templateUrl : "templates/newforward.html",
		controller : 'newforwardorderCtrl'
	}).state('newmoneymarket', {
		url : "/newmoneymarket",
		templateUrl : "templates/newmoneymarket.html",
		controller : 'newmmorderCtrl'
	}).state('confirmDetails', {
		url : "/confirmDetails",
		templateUrl : "templates/payment.html",
		controller : 'paymentCtrl'
	}).state('confirmoffer', {
		url : "/confirmoffer/:offerid",
		templateUrl : "templates/confirmbooking.html",
		controller : 'confirmofferCtrl'
	}).state('confirmofferforward', {
		url : "/confirmofferforward/:offerid",
		templateUrl : "templates/confirmbookingforward.html",
		controller : 'confirmofferforwardCtrl'
	}).state('confirmoffermm', {
		url : "/confirmoffermm/:offerid",
		templateUrl : "templates/confirmbookingmm.html",
		controller : 'confirmoffermmCtrl'
	}).state('confirmswapoffer', {
		url : "/confirmswapoffer/:offerid",
		templateUrl : "templates/confirmbookingswap.html",
		controller : 'confirmswapofferCtrl'
	}).state('payments', {
		url : "/payments",
		templateUrl : "templates/custpayments.html",
		controller : 'custpaymentsCtrl'
	}).state('paymentswap', {
		url : "/paymentswap",
		templateUrl : "templates/custpaymentswap.html",
		controller : 'custpaymentsCtrl'
	}).state('paymentforward', {
		url : "/paymentforward",
		templateUrl : "templates/custpaymentforward.html",
		controller : 'custpaymentsCtrl'
	}).state('paymentmm', {
		url : "/paymentmm",
		templateUrl : "templates/custpaymentmm.html",
		controller : 'custpaymentsCtrl'
	})
})

