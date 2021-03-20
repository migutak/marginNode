var app = angular.module('app', ['ui.router','bankCtrl','marginService','ui-notification','angularMoment']);

app.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})
 
app.constant('API_ENDPOINT', {
  url: 'http://localhost:8000/api'
});

app.run(function ($rootScope, $window, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$locationChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      if(next !== "http://localhost:8000/login.html" || next !== "http://localhost:8000/login" || next !== "http://localhost:8000/signup"){
          $window.open('/login','_self');
      }      
    }
  });
});

app.config(function($stateProvider, $urlRouterProvider) {
	
	$urlRouterProvider.otherwise("/home")

	$stateProvider
	.state('home', {
		url : "/home",
		templateUrl : "templates/home_bank.html",
		controller : 'bankCtrl'
	}).state('homeswap', {
		url : "/homeswap",
		templateUrl : "templates/home_bank_swap.html",
		controller : 'bankCtrl'
	}).state('homeforward', {
		url : "/homeforward",
		templateUrl : "templates/home_bank_forward.html",
		controller : 'bankCtrl'
	}).state('homemm', {
		url : "/homemm",
		templateUrl : "templates/home_bank_mm.html",
		controller : 'bankCtrl'
	}).state('newoffer', {
		url : "/newoffer/:indexid",
		templateUrl : "templates/newoffer.html",
		controller : 'newofferCtrl'
	})
	.state('newmmoffer', {
		url : "/newmmoffer/:indexid",
		templateUrl : "templates/newmmoffer.html",
		controller : 'newmmofferCtrl'
	}).state('newswapoffer', {
		url : "/newswapoffer/:indexid",
		templateUrl : "templates/newswapoffer.html",
		controller : 'newswapofferCtrl'
	}).state('newforwardoffer', {
		url : "/newforwardoffer/:indexid",
		templateUrl : "templates/newforwardoffer.html",
		controller : 'newforwardofferCtrl'
	}).state('profile', {
		url : "/profile",
		templateUrl : "templates/profile.html",
		controller : 'profileCtrl'
	}).state('logout', {
		url : "/logout",
		templateUrl : "index.html"
	}).state('offers', {
		url : "/offers",
		templateUrl : "templates/offers.html",
		controller : 'offersCtrl'
	}).state('offersswap', {
		url : "/offersswap",
		templateUrl : "templates/offersswap.html",
		controller : 'offersCtrl'
	}).state('offersforward', {
		url : "/offersforward",
		templateUrl : "templates/offersforward.html",
		controller : 'offersCtrl'
	}).state('offersmm', {
		url : "/offersmm",
		templateUrl : "templates/offersmm.html",
		controller : 'offersCtrl'
	}).state('acceptedoffers', {
		url : "/acceptedoffers",
		templateUrl : "templates/acceptedoffers.html",
		controller : 'acceptedoffersCtrl'
	}).state('acceptedofferswap', {
		url : "/acceptedofferswap",
		templateUrl : "templates/acceptedofferswap.html",
		controller : 'acceptedoffersCtrl'
	}).state('acceptedofferforward', {
		url : "/acceptedofferforward",
		templateUrl : "templates/acceptedofferforward.html",
		controller : 'acceptedoffersCtrl'
	}).state('acceptedoffermm', {
		url : "/acceptedoffermm",
		templateUrl : "templates/acceptoffermm.html",
		controller : 'acceptedoffersCtrl' //changed from acceptedmmoffersCtrl
	}).state('approvals', {
		url : "/ofapprovalsfers",
		templateUrl : "templates/approvals.html",
		controller : 'approvedCtrl'
	}).state('declines', {
		url : "/declines",
		templateUrl : "templates/declines.html",
		controller : 'approvedCtrl'
	}).state('rptconfirmation', {
		url : "/rptconfirmation",
		templateUrl : "templates/rptconfirmation.html"
	}).state('rptdonedeals', {
		url : "/rptdonedeals",
		templateUrl : "templates/rptdonedeals.html"
	}).state('rptmaturity', {
		url : "/rptmaturity",
		templateUrl : "templates/rptmaturity.html"
	}).state('rptammendments', {
		url : "/rptammendments",
		templateUrl : "templates/rptammendments.html"
	}).state('rptcancellations', {
		url : "/rptcancellations",
		templateUrl : "templates/rptcancellations.html"
	}).state('rptaudit', {
		url : "/rptaudit",
		templateUrl : "templates/rptaudit.html"
	}).state('rptcurrencypostn', {
		url : "/rptcurrencypostn",
		templateUrl : "templates/rptcurrencypostn.html"
	}).state('rptexceptions', {
		url : "/rptexceptions",
		templateUrl : "templates/rptexceptions.html"
	}).state('bookdeal', {
		url : "/bookdeal/:offerid",
		templateUrl : "templates/bookdeal.html",
		controller : 'bookdealCtrl'
	}).state('bookdealforward', {
		url : "/bookdealforward/:offerid",
		templateUrl : "templates/bookdealforward.html",
		controller : 'bookdealforwardCtrl'
	}).state('bookmmdeal', {
		url : "/bookmmdeal/:offerid",
		templateUrl : "templates/bookmmdeal.html",
		controller : 'bookmmdealCtrl'
	}).state('bookswapdeal', {
		url : "/bookswapdeal/:offerid",
		templateUrl : "templates/bookswapdeal.html",
		controller : 'bookswapdealCtrl'
	}).state('confirmDetails', {
		url : "/confirmDetails/:id",
		templateUrl : "templates/payment.html",
		controller : 'paymentCtrl'
	}).state('editOffer', {
		url : "/editOffer/:offerid",
		templateUrl : "templates/editoffer.html",
		controller : 'editofferCtrl'
	}).state('editforwardOffer', {
		url : "/editforwardOffer/:offerid",
		templateUrl : "templates/editforwardoffer.html",
		controller : 'editofferCtrl'
	}).state('editswapOffer', {
		url : "/editswapOffer/:offerid",
		templateUrl : "templates/editswapoffer.html",
		controller : 'editofferswapCtrl'
	}).state('editmmOffer', {
		url : "/editmmOffer/:offerid",
		templateUrl : "templates/editmmoffer.html",
		controller : 'editmmofferCtrl'
	}).state('editforwardoffer', {
		url : "/editforwardoffer/:offerid",
		templateUrl : "templates/editforwardoffer.html",
		controller : 'editforwardofferCtrl'
	}).state('forwardschedule', {
		url : "/forwardschedule/:freq/:nofreq/:startdate/:buyorderamountccy/:buyorderamount/:sellorderamountccy/:sellorderamount",
		templateUrl : "templates/forwardschedulebank.html",
		controller : 'sheduleCtrl'
	})
})