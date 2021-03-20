
angular.module('loginController', ['marginService'])

.controller('LoginCtrl', function($scope,$http,$window,AuthService,API_ENDPOINT){
	$scope.user = {
	    name: '',
	    password: ''
	 };
	
	$scope.LoginErrormsg = '';

	    $scope.delay = 10;
	    $scope.delay = 10;
	    $scope.minDuration = 0;
	    $scope.message = 'Please Wait...';
	    $scope.backdrop = true;
	    $scope.promise = null;
	 
	  $scope.login = function() {
	  	$scope.dataLoading = true;
	    AuthService.login($scope.user).then(function(msg) {
	    	if(typeof(Storage) !== "undefined") {
			    window.sessionStorage.setItem('username',$scope.user.name);
			} else {
			    alert('Warning: sessionStorage not supported');
			}
	      $http.get('/api/memberinfo').then(function(result) {//API_ENDPOINT.url + 
	    	  window.sessionStorage.setItem('bankdomain',result.data.entityname);
	        if(result.data.entity == "Bank"){
	            $window.open('index_bank','_self');
	        } else if(result.data.entity == "Customer"){
	            $window.open('index_cust.html','_self');
	        }else if(result.data.entity == "Backoffice"){
	            $window.open('index_boffice.html','_self');
	        }else{
	            $window.open('index_admin.html','_self');
	        }
	       });
	      $scope.dataLoading = false;
	    }, function(errMsg) {
	      $scope.LoginErrormsg = errMsg;
	      $scope.dataLoading = false;
	    });
	  };
})
;

