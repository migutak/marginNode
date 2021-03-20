var app = angular.module('custCtrl', ['marginService'])

app.controller('indexcustCtrl', function($scope,$window,AuthService,titleService){
	$scope.username = window.sessionStorage.getItem("username");
	$scope.confimnotification = 0;
	$scope.paymentsnotification = 0;

	$scope.Title = titleService;
	$scope.Title.name = "open orders";

	$scope.logout = function() {
	    AuthService.logout()
	    window.sessionStorage.clear()
	    $window.open('login.html','_self')
	};
})

app.controller('custCtrl', function($scope,$http,$timeout,ordersService,titleService,socketio){
	$scope.username = window.sessionStorage.getItem("username")
	$scope.spotorders = [];
	$scope.custorders_mm = [];
	$scope.custorders_forward = [];

	$scope.Title = titleService;
	$scope.Title.name = "open orders";

	spoto();
	mmorders();
	forwardorders();
	
	socketio.on('new mm offer', function(msg){
		mmorders();
	});

	socketio.on('new spot offer', function(msg){
		spoto();
	});

	socketio.on('new forward offer', function(msg){
		forwardorders();
	});
	
	function spoto(){
		$http({
		    url: '/spotorders/'+$scope.username, 
		    method: "GET",
		    headers: {'Content-Type': 'application/json'}
		    //params: {user_id: $scope.username}
		}).success(function(response){
			//console.log(response.data)
			$scope.spotorders = response.data;
		});
	}

	function mmorders(){
		$http({
		    url: '/get_all_mm_orders/'+$scope.username, 
		    method: "GET",
		    headers: {'Content-Type': 'application/json'}
		}).success(function(response){
			$scope.custorders_mm = response.data;
		});
	}

	function forwardorders(){
		$http({
		    url: '/get_all_forward_orders/' + $scope.username, 
		    method: "GET",
		    headers: {'Content-Type': 'application/json'}
		}).success(function(response){
			$scope.custorders_forward = response.data;
		});
	}
	
	$scope.viewoffers = function(orderid){
		$(".modalbusy").show();
		$scope.orderdetails = [];
		$scope.offertitle = '';
		$timeout(function() {
			ordersService.offer(orderid).then(function(d) {
			    $scope.orderdetails = d.data.data;
			    $scope.offertitle = 'for Deal Number: '+d.data.data[0].orderidfk;
			});
			$(".modalbusy").hide();
		}, 2000);	
	};

	$scope.viewforwardoffers = function(orderid){
		$(".modalbusy").show();
		$scope.orderdetails = [];
		$scope.offertitle = '';
		$timeout(function() {
			ordersService.forwardoffer(orderid).then(function(d) {
			    $scope.orderdetails = d.data.data;
			    $scope.offertitle = 'for Deal Number: '+d.data.data[0].orderidfk;
			});
			$(".modalbusy").hide();
		}, 2000);	
	};

	$scope.viewmmoffers = function(orderid){
		$(".modalbusy").show();
		$scope.orderdetails = [];
		$scope.offertitle = '';
		$timeout(function() {
			ordersService.offer_s_mm(orderid).then(function(d) {
			    $scope.orderdetails = d.data.data;
			    $scope.offertitle = 'for Deal Number: ' + d.data.data[0].orderidfk;
			});
			$(".modalbusy").hide();
		}, 2000);	
	};
	
})

app.controller('custCtrlswap', function($scope,$http,$timeout,ordersService,titleService,socketio){
	$scope.username = window.sessionStorage.getItem("username")
	
	$scope.Title = titleService;
	$scope.Title.name = "swap orders";

	$scope.custorders_swap = [];
	
	swaporders()
	
	socketio.on('new swap offer', function(msg){
		swaporders()
	});
	
	function swaporders(){
		$http({
		    url: '/get_all_swap_orders/'+$scope.username, 
		    method: "GET",
		    headers: {'Content-Type': 'application/json'}
		    //params: {user_id: $scope.username}
		}).success(function(response){
			//console.log(response.data)
			$scope.custorders_swap = response.data;
		});
	}

	$scope.viewswapoffers = function(orderid){
		$(".modalbusy").show();
		$scope.orderdetails = [];
		$scope.offertitle = '';
		$timeout(function() {
			ordersService.offer_s_swap(orderid).then(function(d) {
			    $scope.orderdetails = d.data.data;
			    $scope.offertitle = 'for Deal ID: '+d.data.data[0].orderidfk;
			});
			$(".modalbusy").hide();
		}, 2000);
	};
	
})

app.controller('offeracceptCtrl', function($scope,$stateParams,$state,$http,ordersService){
	var orderid = $stateParams.orderidfk;
	var offerid = $stateParams.offerid;
	
	$scope.acceptofferswap = [];
	$scope.acceptoffer = [];
	$scope.acceptoffer.limit_num = 0;
	
	ordersService.offerdetails(offerid).then(function(d) {
	    $scope.acceptoffer = d.data.data[0];
	    if($scope.acceptoffer.buysell == "BUY" && $scope.acceptoffer.buyorderamount>0){
	    	$scope.acceptoffer.limit_num = 3;
	    	$scope.acceptoffer._buysell ="Buy";
	    	$scope.acceptoffer._buysell2 ="Sell";
	    }else if($scope.acceptoffer.buysell == "BUY" && $scope.acceptoffer.sellorderamount>0){
	    	$scope.acceptoffer.limit_num = -3;
	    	$scope.acceptoffer._buysell ="Sell";
	    	$scope.acceptoffer._buysell2 ="Buy";
	    }else if($scope.acceptoffer.buysell == "SELL" && $scope.acceptoffer.buyorderamount>0){
	    	$scope.acceptoffer.limit_num = -3;
	    	$scope.acceptoffer._buysell ="Buy"
	    	$scope.acceptoffer._buysell2 ="Sell";
	    }else if($scope.acceptoffer.buysell == "SELL" && $scope.acceptoffer.sellorderamount>0){
	    	$scope.acceptoffer.limit_num = 3;
	    	$scope.acceptoffer._buysell ="Sell"
	    	$scope.acceptoffer._buysell2 ="Buy";
	    }
	});
	
	$scope.accept = function(){
					
		ordersService.updateOffersQuery(offerid).then(function(response){
		});
		
		ordersService.updateOrdersQuery($scope.acceptoffer.orderidfk).then(function(response){
			alert('offer accepted');
			$state.go('home');
		});
	};
	
})

app.controller('forwardofferacceptCtrl', function($scope,$stateParams,$state,$http,ordersService){
	var orderid = $stateParams.orderidfk;
	var offerid = $stateParams.offerid;
	
	$scope.acceptofferswap = [];
	$scope.acceptoffer = [];
	
	ordersService.forwardofferdetails(offerid).then(function(d) {
		//console.log(d.data.data[0]);
	    $scope.acceptoffer = d.data.data[0];
	});
	
	$scope.accept = function(){
					
		ordersService.updateForwardQuery(offerid).then(function(response){
		});
		
		ordersService.updateOrdersQueryforward($scope.acceptoffer.orderidfk).then(function(response){
			alert('offer accepted');
			$state.go('homeforward');
		});
	};
	
})

app.controller('neworderCtrl', function($scope,$http, $filter, $state, ordersService){
	var username = window.sessionStorage.getItem('username');
	var domain = window.sessionStorage.getItem('bankdomain');

	$scope.neworder = {};
	$scope.ccytitle = '';
	$scope.banks = [];

	$scope.num = 3;
	$scope.s_buy = false;
	$scope.s_sell = false;

	$http({
	    url: '/banks', 
	    method: "GET"
	}).success(function(data){
		$scope.banks = data.data;
	});

	$scope.newspotOrder = function(){
		$scope.dataLoading = true;
		var i = $scope.neworder.bank.length;
		var d = new Date();
		var n = d.getTime();

		for(x=0; x<=i-1;x++){
			var rescp = $scope.neworder.bank[x];
			var inbuysell = $scope.neworder.buysell;
					
			$scope.neworder.orderid = n;
			$scope.neworder.usernamefk = username;
			$scope.neworder.recipient = rescp;
			$scope.neworder.ordertypefk = 'FXSPOT';
			$scope.neworder.buysellbank = '';
					
			if(inbuysell=='SELL'){
				$scope.neworder.buysellbank = "BUY";
			}else{
				$scope.neworder.buysellbank = "SELL";
			}
			
			$http({
				method : 'POST',
				url:'/spotorders',
				headers: {'Content-Type': 'application/json'},
				data : {orderid:$scope.neworder.orderid,usernamefk:$scope.neworder.usernamefk,ccypair:$scope.neworder.ccypair,buyorderamount:$scope.neworder.buyorderamount,
              		sellorderamount:$scope.neworder.sellorderamount,buysell:$scope.neworder.buysell,buysellbank:$scope.neworder.buysellbank,recipient:rescp,settlementdate:$scope.neworder.settlementdate,
              		custcomment:$scope.neworder.custcomment,ordertypefk:$scope.neworder.ordertypefk,ccysellorderamount:$scope.neworder.ccysellorderamount,
              		ccybuyorderamount:$scope.neworder.ccybuyorderamount}
			}).success(function(response){
				$scope.dataLoading = false;
				alert('New FXSPOT order successfully submitted');
				$state.go('home');
			}).error(function(error){
				$scope.dataLoading = false;
				console.log('Error on adding new Spot order', error.err);
			});
			
		}
	}
				
	$scope.$watch("neworder.buysell", function (newval) {
	    if(newval == 'BUY'){
	        $scope.num = 3;	
	        $scope.neworder.ccybuyorderamount = $filter('limitTo')($scope.neworder.ccypair,3);	
	        $scope.neworder.ccysellorderamount = $filter('limitTo')($scope.neworder.ccypair,-3);
	        //console.log($scope.neworder.ccybuyorderamount+$scope.neworder.ccysellorderamount);			
	    }else{
	        $scope.num = -3;
	        $scope.neworder.ccybuyorderamount = $filter('limitTo')($scope.neworder.ccypair,3);
	        $scope.neworder.ccysellorderamount = $filter('limitTo')($scope.neworder.ccypair,-3);	
	        //console.log($scope.neworder.ccysellorderamount+$scope.neworder.ccybuyorderamount);					
	    };
	}, true);
	            
	$scope.$watch("neworder.ccypair", function (newval) { 
	    $scope.ccytitle = newval;
	    $scope.neworder.ccybuyorderamount = $filter('limitTo')(newval,$scope.num);
	    $scope.neworder.ccysellorderamount = $filter('limitTo')(newval,-$scope.num)
	}, true);

				$scope.$watch("neworder.mybanks", function(newval) {
				    if(newval){
				    	$scope.neworder.bank={};
				    	ordersService.getmybanks(domain).then(function(d){
							$scope.banks = d.data.data;
						})
				    }else{
				    	$scope.neworder.bank={};
				    	ordersService.getbanks().then(function(d){
							$scope.banks = d.data.data;
						})
				    };
				})
	            
	            $scope.setfunct = function(){
	            	if($scope.neworder.buyorderamount !== ""){
	            		$scope.neworder.sellorderamount = '';
	            	}
	            }
	            
	            $scope.setfunct2 = function(){
	            	if($scope.neworder.sellorderamount !== ""){
	            		$scope.neworder.buyorderamount = '';
	            	}
	            }
})

app.controller('custconfirmationsCtrl', function($scope,ordersService){
	$scope.toconfirmoffers = [];
	//$scope.Data.pagetitle = 'FxSpot Confirmations';
	ordersService.to_confirm_offers(1).then(function(d){
		$scope.toconfirmoffers = d.data.data;
	});
})

app.controller('confirmofferCtrl', function($scope, $stateParams,$http,$state, ordersService) {
    var offerid = $stateParams.offerid;
    $scope.reject = {};
    $scope.showAccept = false;
    $scope.showReject = false;
    
    ordersService.offerdetails(offerid).then(function(d){
    	//console.log(d.data[0]);
		$scope.booking = d.data.data[0];
		if($scope.booking.buysellbank == 'SELL' && $scope.booking.buyorderamount>0){
			$scope.lim = 3;
			$scope.booking.rec = "PAY";
			$scope.booking.pay = "REC";
			$scope.booking.recamount = $scope.booking.orderamount;
			$scope.booking.payamount = $scope.booking.settleamount;
		}
		else if($scope.booking.buysellbank == 'SELL' && $scope.booking.sellorderamount>0){
			$scope.lim = 3;
			$scope.booking.rec = "PAY";
			$scope.booking.pay = "REC";
			$scope.booking.recamount = $scope.booking.settleamount;
			$scope.booking.payamount = $scope.booking.orderamount;
		}
		else if($scope.booking.buysellbank == 'BUY' && $scope.booking.sellorderamount>0){
			//$scope.booking.rec = "REC";
			//$scope.booking.pay = "PAY";
			$scope.lim = -3;
			$scope.booking.recamount = $scope.booking.settleamount;
			$scope.booking.payamount = $scope.booking.orderamount;
		}
		else if($scope.booking.buysellbank == 'BUY' && $scope.booking.buyorderamount>0){
			//$scope.booking.rec = "REC";
			$scope.lim = -3;
			$scope.booking.recamount = $scope.booking.orderamount;
			$scope.booking.payamount = $scope.booking.settleamount;
		}
	})
	
	$scope.accept = function(){
		//accept booked deal
		$http({
		   method: 'POST',
		   url: '/accept_deal',
		   headers: {'Content-Type': 'application/json'},
		   data : {offerid:offerid}
		}).success(function (data) {
		    alert("Deal Accepted");
			$state.go('custconfirmations');
		}).error(function (err) {
		    alert("Error accepting deal ", err);
		});	
		
	}
	
	$scope.reject = function(){
		//reject booked deal
		$http({
		    method: 'POST',
		    url: '/reject_deal',
		    headers: {'Content-Type': 'application/json'},
		    data : {id:offerid,reason:$scope.reject.rejectreason}
		 }).success(function (data) {
		    alert("Deal Rejected Submitted");
			$state.go('custconfirmations');
		 }).error(function (error) {
		    alert("Error rejecting deal ",err);
		});	
		
	}
	
				$scope.$watch("booking.confirm", function (newval) {
	               if(newval=="Reject"){
	                    $scope.showAccept = false;
    					$scope.showReject = true;
	                 }else{
	              	 	$scope.showAccept = true;
    					$scope.showReject = false;
	                 }
	               }, true);
})

app.controller('confirmofferforwardCtrl', function($scope, $stateParams,$http,$state, ordersService) {
    var offerid = $stateParams.offerid;
    $scope.reject = {};
    $scope.showAccept = false;
    $scope.showReject = false;
    $scope.schedules = [];

    
    
    ordersService.forwardofferdetails(offerid).then(function(d){
    	//console.log(d.data.data[0]);
		$scope.booking = d.data.data[0];

		var freqnum = d.data.data[0].freqnum;
    	var freq = d.data.data[0].freq;

    	for(i=1;i<=freqnum;i++){
    		if(freq == "Monthly"){
    			$scope.schedules.push({
    				settlementdate : moment($scope.booking.startdate, "DD-MM-YYYY").add(i-1, 'M').format("Do MMM YYYY")
    			});
    		}else if(freq == "Weekly"){
    			$scope.schedules.push({
	    			settlementdate : moment($scope.booking.startdate, "DD-MM-YYYY").add(i-1, 'w').format("Do MMM YYYY")
	    		});
    		}else{
    			$scope.schedules.push({
	    			settlementdate : $scope.booking.startdate
	    		});
    		}
    		
    	}

		if($scope.booking.buysellbank == 'SELL' && $scope.booking.buyorderamount>0){
			$scope.lim = 3;
			$scope.booking.rec = "PAY";
			$scope.booking.pay = "REC";
			$scope.booking.recamount = $scope.booking.orderamount;
			$scope.booking.payamount = $scope.booking.settlementamount;
		}
		else if($scope.booking.buysellbank == 'SELL' && $scope.booking.sellorderamount>0){
			$scope.lim = 3;
			$scope.booking.rec = "PAY";
			$scope.booking.pay = "REC";
			$scope.booking.recamount = $scope.booking.settlementamount;
			$scope.booking.payamount = $scope.booking.orderamount;
		}
		else if($scope.booking.buysellbank == 'BUY' && $scope.booking.sellorderamount>0){
			$scope.booking.rec = "PAY";
			$scope.booking.pay = "REC";
			$scope.lim = -3;
			$scope.booking.recamount = $scope.booking.settlementamount;
			$scope.booking.payamount = $scope.booking.orderamount;
		}
		else if($scope.booking.buysellbank == 'BUY' && $scope.booking.buyorderamount>0){
			$scope.booking.rec = "PAY";
			$scope.booking.pay = "REC";
			$scope.lim = -3;
			$scope.booking.recamount = $scope.booking.orderamount;
			$scope.booking.payamount = $scope.booking.settlementamount;
		}
	})
	
	$scope.accept = function(){
		//accept booked deal
		$http({
		   method: 'POST',
		   url: '/accept_forward_deal',
		   headers: {'Content-Type': 'application/json'},
		   data : {offerid:offerid}
		}).success(function (data) {
		    alert("Deal Accepted");
			$state.go('custconfirmations_forward');
		}).error(function (err) {
		    alert("Error accepting deal ", err);
		    $state.go('custconfirmations_forward');
		});	
		
	}
	
	$scope.reject = function(){
		//reject booked deal
		$http({
		    method: 'POST',
		    url: '/reject_forward_deal',
		    headers: {'Content-Type': 'application/json'},
		    data : {id:offerid,reason:$scope.reject.rejectreason}
		 }).success(function (data) {
		    alert("Deal Rejected Submitted");
			$state.go('custconfirmations_forward');
		 }).error(function (error) {
		    alert("Error rejecting deal ",err);
		    $state.go('custconfirmations_forward');
		});	
		
	}
	
				$scope.$watch("booking.confirm", function (newval) {
	               if(newval=="Reject"){
	                    $scope.showAccept = false;
    					$scope.showReject = true;
	                 }else{
	              	 	$scope.showAccept = true;
    					$scope.showReject = false;
	                 }
	               }, true);
})

app.controller('newswaporderCtrl', function($state,$scope,$http,$filter,Data,ordersService){
	var username = window.sessionStorage.getItem('username');
	var domain = window.sessionStorage.getItem('bankdomain');

	$scope.newswaporder = {};
	$scope.ccytitle = {};
	$scope.banks = [];
	
	//$scope.Data = Data;
	//$scope.Data.pagetitle = 'New SWAP Order';
	
	ordersService.getbanks().then(function(d){
		$scope.banks = d.data.data;
	})

	$scope.$watch("newswaporder.mybanks", function(newval) {
	    if(newval){
	    	$scope.banks=[];
	    	ordersService.getmybanks(domain).then(function(d){
				$scope.banks = d.data.data;
			})   	
	    }else{
	    	$scope.bank=[]
	    	ordersService.getbanks().then(function(d){
				$scope.banks = d.data.data;
			})
	    };
	})
	
				$scope.setfunct = function(){
	            	if($scope.newswaporder.nearbuyorderamount !== ""){
	            		$scope.newswaporder.nearsellorderamount = '';
	            		$scope.newswaporder.farbuyorderamount = '';
	            		$scope.newswaporder.farsellorderamount = $scope.newswaporder.nearbuyorderamount;
	            	}
	            }
	            
	            $scope.setfunct2 = function(){
	            	if($scope.newswaporder.nearsellorderamount !== ""){
	            		$scope.newswaporder.nearbuyorderamount = '';
	            		$scope.newswaporder.farsellorderamount = '';
	            		$scope.newswaporder.farbuyorderamount = $scope.newswaporder.nearsellorderamount;
	            	}
					
	            }
	
			$scope.save_swapOrder = function(){
				$scope.dataLoading = true;
				$scope.loading = true;
				var i = $scope.newswaporder.bank.length;
				var d = new Date();
				var n = d.getTime();
				
				for(x=0; x<=i-1;x++){
							var rescp = $scope.newswaporder.bank[x];
							var inbuysell = $scope.newswaporder.buysell;
							
							$scope.newswaporder.orderid = n;
							$scope.newswaporder.usernamefk = username;
							$scope.newswaporder.recipient = rescp;
							$scope.newswaporder.ordertypefk = 'FXSWAP';
							$scope.newswaporder.buysellbank = '';
							
							if(inbuysell=='SELL'){
								$scope.newswaporder.buysellbank = "BUY";
							}else{
								$scope.newswaporder.buysellbank = "SELL";
							}
							
							$http({
				              method: 'POST',
				              url: '/add_swap_order',
				              headers: {'Content-Type': 'application/json'},
				              data:{orderid:$scope.newswaporder.orderid,usernamefk:$scope.newswaporder.usernamefk,ccypair:$scope.newswaporder.ccypair,neardate:$scope.newswaporder.neardate,
				              		nearbuyorderamountccy:$scope.newswaporder.nearbuyorderamountccy,nearbuyorderamount:$scope.newswaporder.nearbuyorderamount,nearsellorderamountccy:$scope.newswaporder.nearsellorderamountccy,
				              		nearsellorderamount:$scope.newswaporder.nearsellorderamount,buysell:$scope.newswaporder.buysell,buysellbank:$scope.newswaporder.buysellbank,recipient:rescp,fardate:$scope.newswaporder.fardate,farbuyorderamountccy:$scope.newswaporder.farbuyorderamountccy,
				              		farbuyorderamount:$scope.newswaporder.farbuyorderamount,farsellorderamountccy:$scope.newswaporder.farsellorderamountccy,farsellorderamount:$scope.newswaporder.farsellorderamount,
				              		custcomment:$scope.newswaporder.custcomment,ordertypefk:$scope.newswaporder.ordertypefk}
		      				}).success(function (data) {
		      				  $scope.dataLoading = false;
				              alert("New FxSwap Order Submitted ");
				              $scope.newswaporder = {};
				              $state.go('homeswap');
				            }).error(function () {
				            	$scope.dataLoading = false;
				                alert("Error making FxSwap order");
				            });	
						}
			}
	
				$scope.$watch("newswaporder.buysell", function (newval) {
	               if(newval == 'BUY'){
	               		$scope.newswaporder.nearbuyorderamountccy = $filter('limitTo')($scope.newswaporder.ccypair,3);
	               		$scope.newswaporder.nearsellorderamountccy = $filter('limitTo')($scope.newswaporder.ccypair,-3);
	               		$scope.newswaporder.farsellorderamountccy = $filter('limitTo')($scope.newswaporder.ccypair,3);
	               		$scope.newswaporder.farbuyorderamountccy = $filter('limitTo')($scope.newswaporder.ccypair,-3);
	               }else{
	               		$scope.newswaporder.nearbuyorderamountccy = $filter('limitTo')($scope.newswaporder.ccypair,-3);
	               		$scope.newswaporder.nearsellorderamountccy = $filter('limitTo')($scope.newswaporder.ccypair,3);
	               		$scope.newswaporder.farsellorderamountccy = $filter('limitTo')($scope.newswaporder.ccypair,-3);
	               		$scope.newswaporder.farbuyorderamountccy = $filter('limitTo')($scope.newswaporder.ccypair,3);
	               };
	            }, true);

				$scope.$watch("newswaporder.nearandfardate", function(newval){
					if(newval != undefined){
						$scope.newswaporder.neardate = newval.substring(0,10);
						$scope.newswaporder.fardate = newval.substring(13,23);
					}
				}, true);
	
})

app.controller('newmmorderCtrl', function($scope, $stateParams,$state,$http,$interval,$timeout, ordersService, Data) {
    var username = window.sessionStorage.getItem('username');
    var domain = window.sessionStorage.getItem('bankdomain');
    //var custname = window.sessionStorage.getItem('custname');
   
    
    $scope.newmmorder = {};
	$scope.ccytitle = 'CCY';
	$scope.banks = [];
	$scope.currency = [];
	//$scope.newmmorder.mybanks = 'yes';
	
	$scope.Data = Data;
	$scope.Data.pagetitle = 'New Money Market Order';
	
	ordersService.getcurrency().then(function(d){
		//console.log(d.data.data);
		$scope.currency = d.data.data;
	})
	
	ordersService.getbanks().then(function(d){
		$scope.banks = d.data.data;
	})
	
	$scope.$watch("newmmorder.ccy", function (newval) {
		//console.log('New Value received ....'+newval);
	    $scope.ccytitle = newval;
	}, true);
	
	
	$scope.$watch("newmmorder.mybanks", function(newval) {
	    if(newval){
	    	$scope.newmmorder.bank={};
	    	ordersService.getmybanks(domain).then(function(d){
				$scope.banks = d.data.data;
			})   	
	    }else{
	    	$scope.newmmorder.bank={};
	    	ordersService.getbanks().then(function(d){
				$scope.banks = d.data.data;
			})
	    };
	})
	
	//to hold at start
	var x;
	
	$scope.$watch("newmmorder.mmto", function(newval) {
		if(newval){
			x = newval;
			if(x != undefined){
			
				$scope.formatString = function(x) {
			    var day   = parseInt(x.substring(0,2));
			    var month  = parseInt(x.substring(3,5));
			    var year   = parseInt(x.substring(6,10));
			    var date = new Date(year, month-1, day);
			    return date;
				}
				var date2 = new Date($scope.formatString($scope.newmmorder.mmto));
			    var date1 = new Date($scope.formatString($scope.newmmorder.mmfrom));
			    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
				
				//console.log('Date 2 ..'+ date2 + $scope.newmmorder.mmto);
				//console.log('Date 1 ..'+ date1);
				
			    $scope.dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
			    //console.log('Diffrence ..'+ $scope.dayDifference);
			    $scope.newmmorder.tenure = $scope.dayDifference;
			    $scope.newmmorder.tenuredisp = $scope.dayDifference + "D";
			}else{
				console.log('out');
			}
			
		}
	}, true)
	
	$scope.save_mm_Order = function(){
		$scope.dataLoading = true;
		
		var i = $scope.newmmorder.bank.length;
		//console.log(i);
		var d = new Date();
		var n = d.getTime();

				for(x=0; x<=i-1;x++){
					var rescp = $scope.newmmorder.bank[x];
					var inmmtype = $scope.newmmorder.mmtype;
										
					$scope.newmmorder.orderid = n;
					$scope.newmmorder.usernamefk = username;
					$scope.newmmorder.recipient = rescp;
					$scope.newmmorder.ordertypefk = 'MM';
					
					if(inmmtype=='Placement'){
						$scope.newmmorder.mmtypebank = "Deposit";
					}else{
						$scope.newmmorder.mmtypebank = "Placement";
					}
					
					$http({
		              method: 'POST',
		              url: '/add_mm',
		              headers: {'Content-Type': 'application/json'},
		              data:{orderid:$scope.newmmorder.orderid,usernamefk:$scope.newmmorder.usernamefk,ccy:$scope.newmmorder.ccy,orderamount:$scope.newmmorder.orderamount,
		              		mmfrom:$scope.newmmorder.mmfrom,mmto:$scope.newmmorder.mmto,tenure:$scope.newmmorder.tenure,recipient:rescp,custcomment:$scope.newmmorder.custcomment,
		              		ordertypefk:$scope.newmmorder.ordertypefk,mmtype:$scope.newmmorder.mmtype,mmtypebank:$scope.newmmorder.mmtypebank,custname:domain}
      				}).success(function (data) {
		              //console.log(data);
					  $timeout(function(){
					  	$scope.dataLoading = false;
					  	alert("New Money Market Order Submitted ");
					  	$scope.newmmorder = {};
					  	$state.go('homemoneymarket');
					  },3000)
		            }).error(function () {
		                alert("Error making new order");
		                $scope.dataLoading = false;
		                $scope.newmmorder = {};
						$state.go('homemoneymarket');
		            });
		            
				}
	}

	$scope.$watch("newmmorder.duration", function(newval){
		if(newval != undefined){
			$scope.newmmorder.mmfrom = newval.substring(0,10);
			$scope.newmmorder.mmto = newval.substring(13,23);
		}
	}, true);
	
});

app.controller('custpaymentsCtrl', function($scope,$window,$http,ordersService,socketio){
	$scope.payments_spot = [];
	$scope.payments_swap = [];
	$scope.payments_forward = [];
	$scope.custmmpay = [];

    $scope.payments_forward_notification = 0;
    $scope.payments_spot_notification = 0;
    $scope.payments_swap_notification = 0;
    $scope.payments_mm_notification = 0;

    $scope.all_swap_notification = 0;
    $scope.paid_swap_notification = 0;
    $scope.notpaid_swap_notification = 0;

    $scope.all_spot_notification = 0;
    $scope.paid_spot_notification = 0;
    $scope.notpaid_spot_notification = 0;

    $scope.all_mm_notification = 0;
    $scope.paid_mm_notification = 0;
    $scope.notpaid_mm_notification = 0;

    $scope.all_forward_notification = 0;
    $scope.paid_forward_notification = 0;
    $scope.notpaid_forward_notification = 0;

    payments_forward();
    payments_spot();
    payments_mm();
    payments_swap();

    payments_swap_all();
    payments_swap_paid();

    payments_forward_all();
    payments_forward_paid();

    payments_spot_all();
    payments_spot_paid();

    payments_mm_all();
    payments_mm_paid();

    socketio.on('payments_forward', function(msg){
        payments_forward();
    });

    socketio.on('payments_spot', function(msg){
        payments_spot();
    });


	function payments_forward(){
	    ordersService.payments_forward().then(function(d){
	        $scope.confirmedforwardoffers = d.data.data
	        $scope.payments_forward_notification = d.data.data.length;
	        $scope.notpaid_forward_notification = d.data.data.length;
	    }) 
	}

	function payments_forward_all(){
	    ordersService.payments_forward_all().then(function(d){
	        $scope.confirmedforwardoffers = d.data.data
	        $scope.all_forward_notification = d.data.data.length;
	    }) 
	}

	function payments_forward_paid(){
	    ordersService.payments_forward_paid().then(function(d){
	        $scope.confirmedforwardoffers = d.data.data
	        $scope.paid_forward_notification = d.data.data.length;
	    }) 
	}

	function payments_spot(){
	    ordersService.confirmed_offers().then(function(d){
	    	//console.log(d.data.data);
	        $scope.payments_spot = d.data.data
	        $scope.payments_spot_notification = d.data.data.length;
	    }) 
	}
	function payments_spot_all(){
	    ordersService.confirmed_offers_all().then(function(d){
	    	//console.log(d.data.data);
	        $scope.payments_spot = d.data.data
	        $scope.payments_spot_notification = d.data.data.length;
	    }) 
	}
	function payments_spot_paid(){
	    ordersService.confirmed_offers_paid().then(function(d){
	    	//console.log(d.data.data);
	        $scope.payments_spot = d.data.data
	        $scope.payments_spot_notification = d.data.data.length;
	    }) 
	}

	function payments_mm(){
	    ordersService.payments_mm_confirm().then(function(d){
	        $scope.custmmpay = d.data.data
	        $scope.payments_mm_notification = d.data.data.length;
    		$scope.notpaid_mm_notification = d.data.data.length;
	    }) 
	}

	function payments_mm_all(){
	    ordersService.payments_mm_confirm_all().then(function(d){
	        $scope.custmmpay = d.data.data
	       	$scope.all_mm_notification = d.data.data.length;
	    }) 
	}

	function payments_mm_paid(){
	    ordersService.payments_mm_confirm_paid().then(function(d){
	        $scope.custmmpay = d.data.data
	        $scope.paid_mm_notification = d.data.data.length;
	    }) 
	}

	function payments_swap(){
	    ordersService.payments_swap_confirm().then(function(d){
	    	//console.log(d.data.data);
	        $scope.payments_swap = d.data.data
    		$scope.notpaid_swap_notification = d.data.data.length;
	    }) 
	}

	function payments_swap_all(){
	    ordersService.payments_swap_confirm_all().then(function(d){
	    	//console.log(d.data.data);
	        $scope.payments_swap = d.data.data
	        $scope.all_swap_notification = d.data.data.length;
	    }) 
	}

	function payments_swap_paid(){
	    ordersService.payments_swap_confirm_paid().then(function(d){
	    	//console.log(d.data.data);
	        $scope.payments_swap = d.data.data
	        $scope.paid_swap_notification = d.data.data.length;
	    }) 
	}
    
    $scope.paymm = function(offerid){
    	var mm = $window.confirm('Are you sure you want to confirm payment?');
	    if(mm){
	     	$http({
			   method: 'POST',
			   url: '/payment_mm_cust',
			   headers: {'Content-Type': 'application/json'},
			   data : {offerid:offerid}
			}).success(function (data) {
			    alert('Money market payment confirmed. Thank You');
				payments_mm();
			}).error(function (error) {
			    alert("Error making money market payment " + error);
			});	
	    }
    }

    $scope.payspot = function(offerid){
    	var spot = $window.confirm('Are you sure you want to confirm payment?');
	    if(spot){
	     	$http({
			   method: 'POST',
			   url: '/payment_spot_cust',
			   headers: {'Content-Type': 'application/json'},
			   data : {offerid:offerid}
			}).success(function (data) {
			    alert('Spot payment confirmed. Thank You');
				payments_spot();
			}).error(function (error) {
			    alert("Error making spot payment" + error);
			});	
	    }
    }

    $scope.payswap = function(offerid){
    	var swap = $window.confirm('Are you sure you want to confirm payment ?');
	    if(swap){
	     	$http({
			   method: 'POST',
			   url: '/payment_swap_cust',
			   headers: {'Content-Type': 'application/json'},
			   data : {offerid:offerid}
			}).success(function (data) {
			    alert('Swap payment confirmed. Thank You');
				payments_swap();
			}).error(function (error) {
			    alert("Error making spot payment" + error);
			});	
	    }
    }

    $scope.payforward = function(offerid){
    	var forward = $window.confirm('Are you sure you want to confirm payment ?');
	    if(forward){
	     	$http({
			   method: 'POST',
			   url: '/payment_forward_cust',
			   headers: {'Content-Type': 'application/json'},
			   data : {offerid:offerid}
			}).success(function (data) {
			    alert('Forward payment confirmed. Thank You');
				payments_forward();
			}).error(function (error) {
			    alert("Error making forward payment" + error);
			});	
	    }
    }

    $scope.archiveBtn_spot = function(input){
    	console.log('archiveBtn_spot ... ', input);
    	if(input == 'ALL'){
    		payments_spot_all();
    	}else if(input == 'PAID'){
    		payments_spot_paid();
    	}else{
    		payments_spot();
    	}
    }

    $scope.archiveBtn_swap = function(input){
    	console.log('archiveBtn_swap ... ', input);
    	if(input == 'ALL'){
    		payments_swap_all();
    	}else if(input == 'PAID'){
    		payments_swap_paid();
    	}else{
    		payments_swap();
    	}
    }

    $scope.archiveBtn_forward = function(input){
    	console.log('archiveBtn_forward ... ', input);
    	if(input == 'ALL'){
    		payments_forward_all();
    	}else if(input == 'PAID'){
    		payments_forward_paid();
    	}else{
    		payments_forward();
    	}
    }

    $scope.archiveBtn_mm = function(input){
    	console.log('archiveBtn_mm ... ', input);
    	if(input == 'ALL'){
    		payments_mm_all();
    	}else if(input == 'PAID'){
    		payments_mm_paid();
    	}else{
    		payments_mm();
    	}
    }
});

app.controller('sheduleCtrl', function($scope, $stateParams,titleService){
	var freq = $stateParams.freq;
	var nofreq = $stateParams.nofreq;
	var startdate = $stateParams.startdate;
	var buyorderamount = $stateParams.buyorderamount;
	var buyorderamountccy = $stateParams.buyorderamountccy;
	var sellorderamount = $stateParams.sellorderamount;
	var sellorderamountccy = $stateParams.sellorderamountccy;

	$scope.Title = titleService;
	$scope.Title.name = "forward schedule";

	$scope.schedules = [];


	for(i=1; i<=nofreq;i++){
		if(buyorderamount>0){
			if (freq == 'Monthly'){
				$scope.schedules.push(
					{'frequency':freq +' #'+i,
					'buyamount':buyorderamount,
					'buyorderamountccy':buyorderamountccy,
					'sellamount':'',
					'startdate':moment(startdate, "DD-MM-YYYY").add(i-1, 'M').format("Do MMM YYYY")
				});
			}else if(freq == 'Weekly'){
				$scope.schedules.push(
					{'frequency':freq +' #'+i,
					'buyamount':buyorderamount,
					'buyorderamountccy':buyorderamountccy,
					'sellamount':'',
					'startdate':moment(startdate, "DD-MM-YYYY").add(i-1, 'w').format("Do MMM YYYY")
				});
			}else{
				$scope.schedules.push(
					{'frequency':freq +' #'+i,
					'buyamount':buyorderamount,
					'buyorderamountccy':buyorderamountccy,
					'sellamount':'',
					'startdate':startdate
				});
			}
		}else{
			if (freq == 'Monthly'){
				$scope.schedules.push(
					{'frequency':freq +' #'+i,
					'buyamount':'',
					'sellamount':sellorderamount,
					'sellorderamountccy':sellorderamountccy,
					'startdate':moment(startdate, "DD-MM-YYYY").add(i-1, 'M').format("Do MMM YYYY")
				});
			}else if(freq == 'Weekly'){
				$scope.schedules.push(
					{'frequency':freq +' #'+i,
					'buyamount':'',
					'sellamount':sellorderamount,
					'sellorderamountccy':sellorderamountccy,
					'startdate':moment(startdate, "DD-MM-YYYY").add(i-1, 'w').format("Do MMM YYYY")
				});
			}else{
				$scope.schedules.push(
					{'frequency':freq +' #'+i,
					'buyamount':'',
					'sellamount':sellorderamount,
					'sellorderamountccy':sellorderamountccy,
					'startdate':startdate
				});
			}
		}
		
	}
})

app.controller('newforwardorderCtrl', function($state,$scope,$http,$filter,$timeout,ordersService,titleService,tempData){
	var username = window.sessionStorage.getItem('username');
	var domain = window.sessionStorage.getItem('bankdomain');
	//$scope.newforwardorder = [];
	$scope.ccytitle = {};
	$scope.banks = [];
	
	$scope.Title = titleService;
	$scope.Title.name = "new forward order";

	console.log('tempData.newforward ',tempData.newforward);
	$scope.newforwardorder = tempData.newforward;
	//clear tempdata
	tempData.newforward = '';
	console.log('tempData cleared ',tempData.newforward);
	
	ordersService.getbanks().then(function(d){
		$scope.banks = d.data.data;
	})

	$scope.Test = function(){
		console.log('Testing ....' , $scope.newforwardorder);
		tempData.newforward = $scope.newforwardorder;
	}
	
	
	$scope.saveforwardorder = function(){
		$scope.dataLoading = true;
		
		var i = $scope.newforwardorder.bank.length;
		var freq = $scope.newforwardorder.frequency;
		var nofreq = $scope.newforwardorder.nofrequency;

		if(i == 0){
			alert('Select one or more Banks');
			return;
		};
		
		var d = new Date();
		var n = d.getTime();
	
				for(x=0; x<=i-1;x++){
					var rescp = $scope.newforwardorder.bank[x];
					var inbuysell = $scope.newforwardorder.buysell;
					
					$scope.newforwardorder.orderid = n;
					$scope.newforwardorder.forwardid = n;
					$scope.newforwardorder.usernamefk = username;
					$scope.newforwardorder.recipient = rescp;
					$scope.newforwardorder.ordertypefk = 'FXFORWARD';
					$scope.newforwardorder.buysellbank = '';
					$scope.newforwardorder.settlementdate = $scope.newforwardorder.startdate;
					
					if(inbuysell=='SELL'){
						$scope.newforwardorder.buysellbank = "BUY";
					}else{
						$scope.newforwardorder.buysellbank = "SELL";
					}
					
					$http({
		              method: 'POST',
		              url: './add_forward_order',
		              headers: {'Content-Type': 'application/json'},
		              data:{orderid:$scope.newforwardorder.orderid,forwardid:$scope.newforwardorder.forwardid,usernamefk:username,ccypair:$scope.newforwardorder.ccypair,buyorderamountccy:$scope.newforwardorder.buyorderamountccy,buyorderamount:$scope.newforwardorder.buyorderamount,
		              		sellorderamountccy:$scope.newforwardorder.sellorderamountccy,sellorderamount:$scope.newforwardorder.sellorderamount,buysell:$scope.newforwardorder.buysell,buysellbank:$scope.newforwardorder.buysellbank,recipient:rescp,settlementdate:$scope.newforwardorder.settlementdate,
		              		custcomment:$scope.newforwardorder.custcomment,ordertypefk:$scope.newforwardorder.ordertypefk,freq:$scope.newforwardorder.frequency,freqnum:$scope.newforwardorder.nofrequency,startdate:$scope.newforwardorder.startdate}
      				}).success(function (data) {
		              	//console.log(data);
		              	$timeout(function() {
		              		alert("New FxForward Order Submitted ");
					        $scope.newforwardorder = [];
		              		$state.go('homeforward');
					        $scope.dataLoading = false;
					   	}, 3000);
		            }).error(function () {
		            	 $scope.dataLoading = false;
		                alert("Error making new FxForward order");
		                $scope.newforwardorder = [];
						$state.go('homeforward');
		            });	
				}
	}
	
				$scope.$watch("newforwardorder.buysell", function (newval) {
					if(newval == undefined){
						//console.log(newval);
					}else if(newval == 'BUY'){
	               		$scope.newforwardorder.buyorderamountccy = $filter('limitTo')($scope.newforwardorder.ccypair,3);
	               		$scope.newforwardorder.sellorderamountccy = $filter('limitTo')($scope.newforwardorder.ccypair,-3);
	               }else if(newval == 'SELL'){
	               		$scope.newforwardorder.buyorderamountccy = $filter('limitTo')($scope.newforwardorder.ccypair,-3);
	               		$scope.newforwardorder.sellorderamountccy = $filter('limitTo')($scope.newforwardorder.ccypair,3);
	               };
	            }, true);
			
	            
	            $scope.$watch("newforwardorder.frequency", function (newval) {
	               if(newval == undefined){
	               	//console.log(newval);
	               }else if(newval == 'Single'){
	               		$scope.newforwardorder.nofrequency = 1;
	               		document.getElementById("nofrequency").disabled = true;
	               }else{
	               		//$scope.newforwardorder.nofrequency = '';
	               		document.getElementById("nofrequency").disabled = false;
	               };
	            }, true);
	            
	            $scope.setfunct = function(){
	            	if($scope.newforwardorder.buyorderamount !== ""){
	            		$scope.newforwardorder.sellorderamount = '';
	            	}
	            }
	            
	            $scope.setfunct2 = function(){
	            	if($scope.newforwardorder.sellorderamount !== ""){
	            		$scope.newforwardorder.buyorderamount = '';
	            	}
					
	            }
	            
	            $scope.$watch("newforwardorder.mybanks", function(newval) {
	            	if(newval == undefined){
	            		//console.log(newval);
	            	}else if(newval){
				    	//$scope.newforwardorder.bank={};
				    	ordersService.getmybanks(domain).then(function(d){
							$scope.banks = d.data.data;
						})
				    }else{
				    	//$scope.newforwardorder.bank={};
				    	ordersService.getbanks().then(function(d){
							$scope.banks = d.data.data;
						})
				    };
				})
	
});

app.controller('custconfirmations_forwardCtrl', function($scope,ordersService,titleService){
	$scope.toconfirmoffers = [];

	$scope.Title = titleService;
	$scope.Title.name = "FxSpot Confirmations";

	ordersService.to_confirm_forward(1).then(function(d){
		$scope.toconfirmoffers = d.data.data;
	})	
});

app.controller('offeracceptmmCtrl', function($scope, $stateParams, $http, $state,$filter, Data,ordersService) {
	//$scope.Data.pagetitle = 'Accept Offer';
    var orderid = $stateParams.orderidfk;
	var offerid = $stateParams.offerid;
	var orderidfk = '';
	$scope.acceptoffermm = [];
	
	ordersService.offerdetails_mm(offerid).then(function(d) {
	    $scope.acceptoffermm = d.data.data[0];
	    orderidfk = d.data.data[0].orderidfk;
	    //$scope.Data.pagetitle = 'Accept '+d.data.data[0].mmtype+' offer';
	    $scope.acceptoffermm.totalinterest_disp = $filter('number')(d.data.data[0].totalinterest,2);
	    $scope.acceptoffermm.netamount_disp = $filter('number')(d.data.data[0].netamount,2);
	    $scope.acceptoffermm.tax_disp = $filter('number')(d.data.data[0].tax,2);
	})

	
	
	$scope.accept = function(){
		console.log(orderidfk);
		$scope.dataLoading = true;

		ordersService.accept_mm_offer(offerid).then(function(d) {

		})

		ordersService.accept_mm_offer2(orderidfk).then(function(d) {
			alert('Offer '+orderidfk+' Accepted');
		    $scope.dataLoading = false;
			$state.go('homemoneymarket');
		})
	}
});

app.controller('custconfirmationsmmCtrl', function($scope,ordersService){
	$scope.toconfirmoffers = [];
	//$scope.Data.pagetitle = 'MM Confirmations';
	$scope.mmnotification = 0;
	ordersService.to_confirm_offers_mm(1).then(function(d){
		$scope.toconfirmoffers = d.data.data;
		$scope.mmnotification = d.data.data.length;
	})
	
})

app.controller('confirmoffermmCtrl', function($scope, $stateParams,$http,$state, ordersService) {
	//$scope.Data.pagetitle = 'MM Confirmations';
    var offerid = $stateParams.offerid;
    $scope.reject = {};
    $scope.showAccept = false;
    $scope.showReject = false;
    
    ordersService.offerdetails_mm(offerid).then(function(d){
    	//console.log(d.data[0]);
		$scope.booking = d.data.data[0];
    })
    
    $scope.accept = function(){
		//accept booked deal
		$http({
		   method: 'POST',
		   url: '/accept_mm_deal',
		   headers: {'Content-Type': 'application/json'},
		   data : {offerid:offerid}
		}).success(function (data) {
		    alert("Deal Accepted");
			$state.go('custconfirmations_mm');
		}).error(function (error) {
		    alert("Error accepting deal");
			$state.go('custconfirmations_mm');
		});	
	}
	
	$scope.reject = function(){
		alert('... will be rejected');
	}
    			$scope.$watch("booking.confirm", function (newval) {
	               if(newval=="Reject"){
	                    $scope.showAccept = false;
    					$scope.showReject = true;
	                 }else{
	              	 	$scope.showAccept = true;
    					$scope.showReject = false;
	                 }
	               }, true);
})

app.controller('offeracceptswapCtrl', function($scope, $stateParams,$timeout,$state, ordersService) {
    var orderid = $stateParams.orderidfk;
	var offerid = $stateParams.offerid;
	
	$scope.acceptofferswap = [];
	
	ordersService.offerdetails_swap(offerid).then(function(d) {
		console.log(d.data)
	    $scope.acceptofferswap = d.data.data[0];
	    //seems both login are the same and working kindly check ???????
	    if($scope.acceptofferswap.buysell=="BUY" && $scope.acceptofferswap.nearsellorderamount>0){
	    	$scope.acceptofferswap.buysell_disp='BUY - SELL';
	    	$scope.acceptofferswap.nearsellorderamountccy_disp = $scope.acceptofferswap.nearbuyorderamountccy;
	    	$scope.acceptofferswap.farbuyorderamountccy_disp = $scope.acceptofferswap.farsellorderamountccy;
	    	$scope.acceptofferswap.nearsellorderamount_disp = $scope.acceptofferswap.nearbuyorderamount;
	    	$scope.acceptofferswap.farbuyorderamount_disp = $scope.acceptofferswap.farsellorderamount;
	    	
	    	$scope.acceptofferswap.nearbuyorderamountccy_disp = $scope.acceptofferswap.nearsellorderamountccy;
	    	$scope.acceptofferswap.farsellorderamountccy_disp = $scope.acceptofferswap.farbuyorderamountccy;
	    	$scope.acceptofferswap.nearbuyorderamount_disp = $scope.acceptofferswap.nearsellorderamount;
	    	$scope.acceptofferswap.farsellorderamount_disp = $scope.acceptofferswap.farbuyorderamount;
	    	
	    }else if($scope.acceptofferswap.buysell=="SELL" && $scope.acceptofferswap.nearbuyorderamount>0){
	    	$scope.acceptofferswap.buysell_disp='SELL - BUY';
	    	
	    	$scope.acceptofferswap.nearsellorderamountccy_disp = $scope.acceptofferswap.nearbuyorderamountccy;
	    	$scope.acceptofferswap.farbuyorderamountccy_disp = $scope.acceptofferswap.farsellorderamountccy;
	    	$scope.acceptofferswap.nearsellorderamount_disp = $scope.acceptofferswap.nearbuyorderamount;
	    	$scope.acceptofferswap.farbuyorderamount_disp = $scope.acceptofferswap.farsellorderamount;
	    	
	    	$scope.acceptofferswap.nearbuyorderamountccy_disp = $scope.acceptofferswap.nearsellorderamountccy;
	    	$scope.acceptofferswap.farsellorderamountccy_disp = $scope.acceptofferswap.farbuyorderamountccy;
	    	$scope.acceptofferswap.nearbuyorderamount_disp = $scope.acceptofferswap.nearsellorderamount;
	    	$scope.acceptofferswap.farsellorderamount_disp = $scope.acceptofferswap.farbuyorderamount;
	    }
	    
	});
	
	$scope.accept = function(){
		$scope.dataLoading = true;
		$timeout(function() {
			ordersService.accept_swap_offer($scope.acceptofferswap.orderidfk).then(function(response){});
			ordersService.accept_swap_offer2(offerid).then(function(response){
				alert('Offer '+offerid+' Accepted');
				$state.go('homeswap');
			});
		}, 5000);
		
	}
})

app.controller('custconfirmations_swapCtrl', function($scope,Data,ordersService){
	$scope.toconfirmoffers = [];
	//$scope.Data.pagetitle = 'Swap Confirmations';
	$scope.swapnotification = 0;
	ordersService.to_confirm_offers_swap().then(function(d){
		$scope.toconfirmoffers = d.data.data;
		$scope.swapnotification = d.data.data.length;
	})
	
});

app.controller('confirmswapofferCtrl', function($scope, $stateParams,$state, $http,$interval, Data, ordersService) {
    var offerid = $stateParams.offerid;
    $scope.reject = {};
    $scope.showAccept = false;
    $scope.showReject = false;
    
    ordersService.offerdetails_swap(offerid).then(function(d){
		$scope.booking = d.data.data[0];
	})
	
	$scope.accept = function(){
		//accept booked deal
		$http({
		   method: 'POST',
		   url: '/accept_swap_deal',
		   headers: {'Content-Type': 'application/json'},
		   data : {offerid:offerid}
		}).success(function (data) {
		    alert("Deal Accepted");
			$state.go('custconfirmations_swap');
		}).error(function (error) {
		    alert("Error accepting deal");
			$state.go('custconfirmations_swap');
		});	
	}
	
	$scope.reject = function(){
		//reject booked deal
		$http({
		    method: 'POST',
		    url: '/reject_deal',
		    headers: {'Content-Type': 'application/json'},
		    data : {id:offerid,reason:$scope.reject.rejectreason}
		 }).success(function (data) {
		    alert("Deal Rejected Submitted");
			$state.go('custconfirmations');
		 }).error(function (error) {
		    alert("Error rejecting deal");
			$state.go('custconfirmations');
		});	
	}
	
				$scope.$watch("booking.confirm", function (newval) {
	               if(newval=="Reject"){
	                    $scope.showAccept = false;
    					$scope.showReject = true;
	                 }else{
	              	 	$scope.showAccept = true;
    					$scope.showReject = false;
	                 }
	               }, true);
    
});


app.controller('offersCtrl', function($scope,ordersService){
	var username = window.sessionStorage.getItem('username');
	$scope.offers=[];
	ordersService.all_offers(username).then(function(d) {
	    $scope.offers = d.data;
	});
	
});

app.controller('reportCtrl', function($scope){
	
})

app.controller('profileCtrl', function($scope,$http,$state,ordersService){
	var username = window.sessionStorage.getItem('username');
	var domain = window.sessionStorage.getItem('bankdomain');
	$scope.banklist = [];

	$scope.newbank = {};

	ordersService.getmybanks(domain).then(function(d){
		$scope.banklist = d.data.data;
		console.log('for daimen' ,d.data.data);
	})
	
	$scope.name = username;
	
	$scope.savebank = function(){
		$scope.dataLoading = true;
		$http({
			method:'post',
			url:'/addmybank',
			headers: {'Content-Type': 'application/json'},
			data:{domain:domain,bankid:$scope.newbank.bankid,bankname:$scope.newbank.name}
		}).success(function(response){
			alert($scope.newbank.name + ' added to your Profile');
			$scope.newbank = {};
			$scope.dataLoading = false;
			$state.go('profile');
		}).error(function(error){
			$scope.dataLoading = false;
			console.log("Error: " + error);
		});
		
	}
})