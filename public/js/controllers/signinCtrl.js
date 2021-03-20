
angular.module('signinCtrl', ['marginService'])

.controller('signinCtrl', function($scope,$window,$http,$window,API_ENDPOINT,AuthService){
	$scope.signup = {};
	
	$scope.adduser = function() {
		//console.log('User will be added ', $scope.signup);
		AuthService.newuser($scope.signup).then(function(msg) {
		    alert(msg);
		}, function(errmsg){
			alert(errmsg);
		})
	}
})
;