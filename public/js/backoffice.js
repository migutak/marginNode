var myapp = angular.module('app', [ "ui.router", 'backoffice.controller','marginService'])

myapp.config(function($stateProvider, $urlRouterProvider) {
	// For any unmatched url, send to /route1
	$urlRouterProvider.otherwise("/home")

	$stateProvider.state('home', {
		url : "/home",
		templateUrl : "templates/home_bo.html",
		controller : 'backofficeCtrl'
	})
	.state('profile', {
		url : "/profile",
		templateUrl : "templates/profile_cust.html",
		controller : 'profileCtrl'
	}).state('report1', {
		url : "/report1",
		templateUrl : "templates/report1.html",
		controller : 'profileCtrl'
	}).state('report2', {
		url : "/report2",
		templateUrl : "templates/report2.html",
		controller : 'profileCtrl'
	}).state('dealsconfirmed', {
		url : "/dealsconfirmed",
		templateUrl : "templates/dealsconfirmed.html",
		controller : 'dealsconfirmedCtrl'
	}).state('rejected', {
		url : "/rejected",
		templateUrl : "templates/rejected.html",
		controller : 'rejectedCtrl'
	}).state('payments', {
		url : "/payments",
		templateUrl : "templates/payments.html",
		controller : 'paymentsCtrl'
	}).state('settlement', {
		url : "/settlement/:offerid",
		templateUrl : "templates/settlement.html",
		controller : 'settlementCtrl'
	}).state('operations', {
		url : "/operations",
		templateUrl : "templates/operations.html",
		controller : 'operationsCtrl'
	}).state('dealmanagement', {
		url : "/dealmanagement",
		templateUrl : "templates/dealmanagement.html",
		controller : 'operationsCtrl'
	}).state('bookdeal', {
		url : "/bookdeal/:offerid",
		templateUrl : "templates/bookdealf.html",
		controller : 'bookdealCtrl'
	}).state('homeswap', {
		url : "/homeswap",
		templateUrl : "templates/backofficeswap.html",
		controller : 'backofficeCtrl'
	}).state('homeforward', {
		url : "/homeforward",
		templateUrl : "templates/backofficeforward.html",
		controller : 'backofficeCtrl'
	}).state('homemm', {
		url : "/homemm",
		templateUrl : "templates/backofficemm.html",
		controller : 'backofficeCtrl'
	}).state('rptconfirmations', {
		url : "/rptconfirmations",
		templateUrl : "templates/rptconfirmations.html"
	}).state('rptexceptions', {
		url : "/rptexceptions",
		templateUrl : "templates/rptexceptions.html"
	}).state('rptpayments', {
		url : "/rptpayments",
		templateUrl : "templates/rptpayments.html"
	}).state('rptdeclines', {
		url : "/rptdeclines",
		templateUrl : "templates/rptdeclines.html"
	}).state('rptoverdue', {
		url : "/rptoverdue",
		templateUrl : "templates/rptoverdue.html"
	})
})	
	

