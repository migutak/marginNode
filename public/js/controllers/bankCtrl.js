var app = angular.module('bankCtrl', ['marginService','ui-notification']);

app.controller('indexCtrl', function($scope,$window,AuthService,Data,socketio,titleService,ordersService){
	var username = window.sessionStorage.getItem('username');
	var domain = window.sessionStorage.getItem('bankdomain');

	$scope.username = window.sessionStorage.getItem('username');

	$scope.acceptedoffersnotification = 0;
	$scope.bidsaccepted = 0;

	$scope.Title = titleService;
	$scope.Title.name = "spot orders";

	socketio.on('new spot offer', function(msg){
		notify();
	});

	socketio.on('new mm offer', function(msg){
		notify();
	});

	socketio.on('new forward offer', function(msg){
		notify();
	});

	socketio.on('new swap offer', function(msg){
		notify();
	});

	socketio.on('accepted offer', function(msg){
		bidsnotify();
	});

notify();
bidsnotify();

	function notify(){
		ordersService.all_open_offers(username).then(function(d) {
			$scope.spotnotification = d.data.data.length;
		});

		ordersService.all_open_offers_forward(domain).then(function(d) {
			$scope.forwardnotification = d.data.data.length;
		});

		ordersService.all_mm_offers(domain).then(function(d) {
			$scope.mmnotification = d.data.data.length;
		});

		ordersService.all_swap_offers(username).then(function(d) {
			$scope.swapnotification = d.data.data.length;
			$scope.acceptedoffersnotification = $scope.swapnotification + $scope.mmnotification + $scope.spotnotification + $scope.forwardnotification;
		});
	};
function bidsnotify(){
	ordersService.accepted_offers(username).then(function(d){
		$scope.bidsspotnotification = d.data.data.length;		
	})
	ordersService.accepted_buy_offers(username).then(function(d){
		$scope.bidsbuynotification = d.data.data.length;
	})

	ordersService.accepted_forward_offers(username).then(function(d){
		$scope.bidsforwardnotification = d.data.data.length;
	})

	ordersService.accepted_mm_offers(domain).then(function(d){
		$scope.mmoffers = d.data.data;
		$scope.mmnotification = d.data.data.length;
	})
	
	ordersService.accepted_swap_offers(domain).then(function(d){
		$scope.bidsswapnotification = d.data.data.length;
		$scope.bidsaccepted = $scope.bidsspotnotification + $scope.bidsbuynotification + $scope.bidsforwardnotification + $scope.bidsswapnotification + $scope.mmnotification;
	})
 }
	$scope.logout = function() {
	    AuthService.logout();
	    $window.open('login.html','_self');
	    window.sessionStorage.clear();
	 };
});

app.controller('bankCtrl', function($scope,$http,socketio,Notification,titleService){
	var username = sessionStorage.getItem('username');
	var domain = sessionStorage.getItem('bankdomain');

	$scope.Title = titleService;
	$scope.Title.name = "Open orders";
	
	//console.log('--> logged in as '+ username + '::'+ domain);
	
	socketio.on('ticket', function(msg){
		openSpotorders();
		Notification.success({message: msg.buysell+' '+msg.ccypair+'<br><b>'+ msg.usernamefk+'</b><br><a href="#/home">Make an offer</a>', title: 'MarginIQ',positionY: 'bottom', positionX: 'right', delay: null});
	});

	socketio.on('new mm order', function(msg){
		openMMorders();
		Notification.success({message: msg.buysell+' '+msg.ccypair+'<br><b>'+ msg.usernamefk+'</b><br><a href="#/homemm">Make an offer</a>', title: 'MarginIQ',positionY: 'bottom', positionX: 'right', delay: null});
	});

	socketio.on('new forward order', function(msg){
		openForwardorders();
		Notification.success({message: msg.buysell+' '+msg.ccypair+'<br><b>'+ msg.usernamefk+'</b><br><a href="#/homeforward">Make an offer</a>', title: 'MarginIQ',positionY: 'bottom', positionX: 'right', delay: null});
	});

	socketio.on('new swap order', function(msg){
		openSwaporders();
		Notification.success({message: msg.buysell+' '+msg.ccypair+'<br><b>'+ msg.usernamefk+'</b><br><a href="#/home">Make an Offer</a>', title: 'MarginIQ',positionY: 'bottom', positionX: 'right', delay: null});
	});
	
	$scope.orders = [];
	$scope.orders_swap = [];
	$scope.orders_mm = [];
	$scope.orders_forward = [];
	$scope.swapnotification = 0;
	$scope.spotnotification = 0;
	$scope.forwardnotification = 0;
	$scope.mmnotification = 0;
	
	openSpotorders();
	openMMorders();
	openForwardorders();
	openSwaporders();

	function openSpotorders(){
		$http({
		    url: '/getbankorders/'+ username, 
		    method: "GET",
		    headers: {'Content-Type': 'application/json'}
		}).success(function(response){
			$scope.orders = response.data;
			$scope.spotnotification = response.data.length;
		});
	};

	function openMMorders(){
		$http({
		    url: '/get_bank_orders_mm/'+ username, 
		    method: "GET",
		    headers: {'Content-Type': 'application/json'}
		}).success(function(response){
			//console.log(response.data);
			$scope.orders_mm = response.data;
			$scope.mmnotification = response.data.length;
		});
	};

	function openForwardorders(){
		$http({
		    url: '/get_bank_orders_forward/'+ domain, 
		    method: "GET",
		    headers: {'Content-Type': 'application/json'}
		}).success(function(response){
			//console.log(response.data);
			$scope.orders_forward = response.data;
			$scope.forwardnotification = response.data.length;
		});
	};

	function openSwaporders(){
		$http({
		    url: '/get_bank_orders_swap/'+ domain, 
		    method: "GET",
		    headers: {'Content-Type': 'application/json'}
		}).success(function(response){
			//console.log(response.data);
			$scope.orders_swap = response.data;
			$scope.swapnotification = response.data.length;
		});
	};

});

/*app.controller('bankCtrlswap', function($scope,$http,socketio,Notification,titleService){

	var username = sessionStorage.getItem('username');
	var domain = sessionStorage.getItem('bankdomain');

	$scope.Title = titleService;
	$scope.Title.name = "swap orders";
	
	socketio.on('new swap order', function(msg){
		openSwaporders();
		Notification.success({message: msg.buysell+' '+msg.ccypair+'<br><b>'+ msg.usernamefk+'</b><br><a href="#/home">Make an Offer</a>', title: 'MarginIQ',positionY: 'bottom', positionX: 'right', delay: null});
	});
	
	$scope.orders_swap = [];
	$scope.swapnotification = 0;
	
	openSwaporders();
	
	function openSwaporders(){
		$http({
		    url: '/get_bank_orders_swap/'+ domain, 
		    method: "GET",
		    headers: {'Content-Type': 'application/json'}
		}).success(function(response){
			//console.log(response.data);
			$scope.orders_swap = response.data;
			$scope.swapnotification = response.data.length;
		});
	};
});*/

app.controller('newofferCtrl', function($scope,$stateParams,$http,$filter,$state, ordersService){
	var username = window.sessionStorage.getItem('username');
	var domain = window.sessionStorage.getItem('bankdomain');
	
	var orderid = $stateParams.indexid;
	var indexid = $stateParams.indexid;
	
	$http({
	    url: '/getanorder/'+ orderid, 
	    method: "GET",
	    headers: {'Content-Type': 'application/json'}
	}).success(function(response){
		//console.log(response.data);
		$scope.newoffer = response.data[0];
		$scope.newoffer.orderindex = response.data[0].orderindex;
	    $scope.newoffer.orderidfk = response.data[0].orderid;
	    $scope.newoffer.offeredby = username;
	    $scope.newoffer.reqamount = 0;
	    $scope.newoffer.buysell = response.data[0].buysell;
	    $scope.newoffer.buyorderamount = response.data[0].buyorderamount;
	    $scope.newoffer.sellorderamount = response.data[0].sellorderamount;
	    
	    if($scope.newoffer.buysell == 'BUY' && $scope.newoffer.buyorderamount > 0){
	    	$scope.holder = 3;
	    	$scope.newoffer.buy_sell1 = "Sell";
	    	$scope.newoffer.buy_sell = "Buy";
	    	$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,-3);
	    }else if($scope.newoffer.buysell == 'BUY' && $scope.newoffer.sellorderamount > 0){
	    	$scope.holder = -3;
	    	$scope.newoffer.buy_sell1 = "Buy";
	    	$scope.newoffer.buy_sell = "Sell";
	    	$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,-3);
	    }else if($scope.newoffer.buysell == 'SELL' && $scope.newoffer.sellorderamount > 0){
	    	$scope.holder = 3;
	    	$scope.newoffer.buy_sell1 = "Buy";
	    	$scope.newoffer.buy_sell = "Sell";
	    	$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,-3);
	    }else if($scope.newoffer.buysell == 'SELL' && $scope.newoffer.buyorderamount > 0){
	    	$scope.holder = -3;
	    	$scope.newoffer.buy_sell1 = "Sell";
	    	$scope.newoffer.buy_sell = "Buy";
	    	$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,-3);
	    }else{
	    	$scope.holder = -3;
	    	$scope.newoffer.buy_sell1 = "Buy";
	    	$scope.newoffer.buy_sell = "Sell";
	    	$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,3);
	    }
	});
	
	$scope.fill = function(){
		if($scope.newoffer.buysellbank == 'BUY'){
			$scope.newoffer.offeredrate = $filter('number')(parseFloat($scope.newoffer.spotrate) - parseFloat($scope.newoffer.magin/100),2);
		}else{
			$scope.newoffer.offeredrate = parseFloat($scope.newoffer.spotrate) + parseFloat($scope.newoffer.magin/100);
		}
		
		if($scope.newoffer.buysell == 'BUY' && $scope.newoffer.buyorderamount > 0){
			$scope.newoffer.settleamount = ($scope.newoffer.orderamount*$scope.newoffer.offeredrate);
			//console.log($scope.newoffer.ccysettleamount);
		}else if($scope.newoffer.buysell == 'BUY' && $scope.newoffer.sellorderamount > 0){
			$scope.newoffer.settleamount = ($scope.newoffer.orderamount/$scope.newoffer.offeredrate);
			$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,3);
		}else if($scope.newoffer.buysell == 'SELL' && $scope.newoffer.sellorderamount > 0){
			$scope.newoffer.settleamount = ($scope.newoffer.orderamount*$scope.newoffer.offeredrate);
			//console.log($scope.newoffer.ccysettleamount);
		}else if($scope.newoffer.buysell == 'SELL' && $scope.newoffer.buyorderamount > 0){
			$scope.newoffer.settleamount = $filter('number')(($scope.newoffer.orderamount/$scope.newoffer.offeredrate),2);
			$scope.newoffer.ccysettleamount = $filter('limitTo')($scope.newoffer.ccypair,3);
			//console.log('Testing settleamount ... with '+$scope.newoffer.offeredrate);
		}else{
			$scope.newoffer.settleamount = ($scope.newoffer.orderamount/$scope.newoffer.offeredrate);
		}
	};
	
	$scope.newOffer = function(){
		$scope.newoffer.offeredby = username;
				$http({
		           method: 'post',
		           url: '/new_offer',
		           headers: {'Content-Type': 'application/json'},
		           data:{orderindex:$scope.newoffer.orderindex,orderidfk:$scope.newoffer.orderid,spotrate:$scope.newoffer.spotrate,magin:$scope.newoffer.magin,offeredrate:$scope.newoffer.offeredrate,
		              		settlementdate:$scope.newoffer.settlementdate,offeredby:domain,bankuser:username,reqamount:$scope.newoffer.reqamount,settleamount:$scope.newoffer.settleamount,
		              		offercomment:$scope.newoffer.offercomment,ccysettleamount:$scope.newoffer.ccysettleamount}
		        }).success(function (data) {
		            alert("Offer Submitted");
					$state.go('home');
		        }).error(function (error) {
		            alert("Error when making an offer");
		            $state.go('home');
		        });	
		
		ordersService.updateorder(indexid).then(function(d){});
	};
	
});

app.controller('offersCtrl', function($scope,ordersService,Data,socketio,titleService){
	
	$scope.Title = titleService;
	$scope.Title.name = "offers made";


	var username = window.sessionStorage.getItem('username');
	var domain = window.sessionStorage.getItem('bankdomain');

	$scope.offers=[];
	$scope.offersswap=[];
	$scope.offersforward=[];
	$scope.offersmm=[];

	$scope.spotnotification = 0;
	$scope.mmnotification = 0;
	$scope.swapnotification = 0;
	$scope.forwardnotification = 0;

	all_spot_offers();
	all_mm_offers();
	all_forward_offers();
	all_swap_offers();


	function all_spot_offers(){
		ordersService.all_open_offers(username).then(function(d) {
			$scope.spotnotification = d.data.data.length;
		    $scope.offers = d.data.data;
		});
	}

	function all_forward_offers(){
		ordersService.all_open_offers_forward(domain).then(function(d) {
			//console.log('all_forward_offers', d.data.data[0]);
			$scope.forwardnotification = d.data.data.length;
		    $scope.offersforward = d.data.data;
		});
	}

	function all_mm_offers(){
		ordersService.all_mm_offers(domain).then(function(d) {
			$scope.mmnotification = d.data.data.length;
		    $scope.offersmm = d.data.data;
		});
	}

	function all_swap_offers(){
		ordersService.all_swap_offers(username).then(function(d) {
			$scope.swapnotification = d.data.data.length;
		    $scope.offersswap = d.data.data;
		});
	}
	
	
});

app.controller('acceptedoffersCtrl', function($scope,ordersService,titleService){
	$scope.offers = [];
	$scope.buyoffers = [];
	$scope.swapoffers = [];
	$scope.forwardoffers = [];
	$scope.mmoffers = [];

	$scope.spotnotification = 0;
	$scope.swapnotification = 0;

	$scope.Title = titleService;
	$scope.Title.name = "Bids accepted";

	var username = window.sessionStorage.getItem('username');
	var domain = window.sessionStorage.getItem('bankdomain');
	
	ordersService.accepted_offers(username).then(function(d){
		$scope.spotnotification = d.data.data.length;
		$scope.offers = d.data.data;
	})
	ordersService.accepted_buy_offers(username).then(function(d){
		//console.log(d.data);
		$scope.buyoffers = d.data.data;
	})

	ordersService.accepted_forward_offers(username).then(function(d){
		$scope.forwardnotification = d.data.data.length;
		$scope.forwardoffers = d.data.data;
	})
	
	ordersService.accepted_mm_offers(domain).then(function(d){
		$scope.mmoffers = d.data.data;
		$scope.mmnotification = d.data.data.length
	})
	
	ordersService.accepted_swap_offers(domain).then(function(d){
		//console.log(d.data.data);
		$scope.swapoffers = d.data.data;
		$scope.swapnotification = d.data.length;
	})
})

app.controller('bookdealCtrl',function($scope,$http,$state,$stateParams,ordersService){
    	$scope.booking = {};
    	var offerid = $stateParams.offerid;
    	
    	ordersService.offerdetails(offerid).then(function(d){
    		$scope.booking = d.data.data[0];
    		if($scope.booking.buysellbank == 'SELL' && $scope.booking.buyorderamount>0){
    			$scope.lim = 3;
    			$scope.booking.rec = "PAY";
    			$scope.booking.pay = "REC";
    			$scope.recamount = $scope.booking.orderamount;
    			$scope.payamount = $scope.booking.settleamount;
    			$scope.booking.buysellrec = $scope.booking.buysell;
    			$scope.booking.buysellrec2 = $scope.booking.buysellbank;
    		}else if($scope.booking.buysellbank == 'SELL' && $scope.booking.sellorderamount>0){
    			$scope.lim = -3;
    			$scope.booking.rec = "REC";
    			$scope.booking.pay = "PAY";
    			$scope.recamount = $scope.booking.orderamount;
    			$scope.payamount = $scope.booking.settleamount;
    			$scope.booking.buysellrec = $scope.booking.buysellbank;
    			$scope.booking.buysellrec2 = $scope.booking.buysell;
    		}else if($scope.booking.buysellbank == 'BUY' && $scope.booking.sellorderamount>0){
    			$scope.lim = 3;
    			$scope.booking.rec = "REC";
    			$scope.booking.pay = "PAY";
    			$scope.recamount = $scope.booking.orderamount;
    			$scope.payamount = $scope.booking.settleamount;
    			$scope.booking.buysellrec = $scope.booking.buysell;
    			$scope.booking.buysellrec2 = $scope.booking.buysellbank;
    		}else if($scope.booking.buysellbank == 'BUY' && $scope.booking.buyorderamount>0){
    			$scope.lim = -3;
    			$scope.booking.rec = "PAY";
    			$scope.booking.pay = "REC";
    			$scope.recamount = $scope.booking.orderamount;
    			$scope.payamount = $scope.booking.settleamount;
    			$scope.booking.buysellrec = $scope.booking.buysellbank;
    			$scope.booking.buysellrec2 = $scope.booking.buysell;
    		}
    		
    	});
    	
    	$scope.custconfirm = function(){
    					$http({
    		              method: 'POST',
    		              url: '/confirm_offer',
    		              headers: {'Content-Type': 'application/json'},
    		              data : {offerid:offerid, sysdate:new Date()}
    		            }).success(function (data) {
    		              alert("Deal Successfully Booked ");
    					  $state.go('acceptedoffers');
    		            }).error(function (err) {
    		                alert("Error booking a deal",err);
    		            });
    		            
    	}
});

app.controller('bookdealforwardCtrl', function($scope,$stateParams,$http,$state,ordersService){
	$scope.booking = {};
    var offerid = $stateParams.offerid;
    $scope.schedules = [];

    ordersService.forwardofferdetails(offerid).then(function(d){
    	console.log(d.data.data[0])
    	$scope.booking = d.data.data[0];
    	var freqnum = d.data.data[0].freqnum;
    	var freq = d.data.data[0].freq;
    	
    	console.log('moment date',$scope.booking.startdate);
		

    	for(i=1;i<=freqnum;i++){
    		if(freq == "Monthly"){
    			$scope.schedules.push({
    				settlementdate : moment($scope.booking.startdate, "DD-MM-YYYY").add(i-1, 'M').format("Do MMM YYYY")
    			});
    			//console.log(moment($scope.booking.startdate, "DD-MM-YYYY").add(i-1, 'M').format("Do MMM YYYY"));
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
    	//console.log($scope.schedules);

    	if($scope.booking.buysellbank == 'SELL' && $scope.booking.buyorderamount>0){
    			$scope.lim = 3;
    			$scope.booking.rec = "PAY";
    			$scope.booking.pay = "REC";
    			$scope.recamount = $scope.booking.orderamount;
    			$scope.booking.buysellrec = $scope.booking.buysell;
    			$scope.booking.buysellrec2 = $scope.booking.buysellbank;
    		}else if($scope.booking.buysellbank == 'SELL' && $scope.booking.sellorderamount>0){
    			$scope.lim = -3;
    			$scope.booking.rec = "REC";
    			$scope.booking.pay = "PAY";
    			$scope.recamount = $scope.booking.orderamount;
    			$scope.booking.buysellrec = $scope.booking.buysellbank;
    			$scope.booking.buysellrec2 = $scope.booking.buysell;
    		}else if($scope.booking.buysellbank == 'BUY' && $scope.booking.sellorderamount>0){
    			$scope.lim = 3;
    			$scope.booking.rec = "REC";
    			$scope.booking.pay = "PAY";
    			$scope.recamount = $scope.booking.orderamount;
    			$scope.booking.buysellrec = $scope.booking.buysell;
    			$scope.booking.buysellrec2 = $scope.booking.buysellbank;
    		}else if($scope.booking.buysellbank == 'BUY' && $scope.booking.buyorderamount>0){
    			$scope.lim = -3;
    			$scope.booking.rec = "PAY";
    			$scope.booking.pay = "REC";
    			$scope.recamount = $scope.booking.orderamount;
    			$scope.booking.buysellrec = $scope.booking.buysellbank;
    			$scope.booking.buysellrec2 = $scope.booking.buysell;
    		}
    })

    $scope.custconfirm = function(){
    	$http({
    		method : 'post',
    		url:'/confirm_offer_forward',
    		headers: {'Content-Type': 'application/json'},
    		data : {offerid:offerid, sysdate:new Date()}
    	}).success(function(data){
    		alert("Deal Successfully Booked ");
    		$state.go('acceptedofferforward');
    	}).error(function(err){
    		alert("Error booking a deal",err);
    	})
    }
})

app.controller('newswapofferCtrl', function($scope,$state,$stateParams,$http,ordersService,$filter,$timeout){
	var username = window.sessionStorage.getItem('username');
	var domain = window.sessionStorage.getItem('bankdomain');
	
	var orderid = $stateParams.indexid;
	var indexid = $stateParams.indexid;
	//$scope.Data = Data;
	//$scope.Data.pagetitle = 'New Swap Offer';
	$scope.newswapoffer = {};
	$scope.holder = 0;
	
	ordersService.swaporder(indexid).then(function(d) {
		//console.log(d.data.data[0]);
		$scope.newswapoffer = d.data.data[0];
		
		$scope.newswapoffer.orderindex = d.data.data[0].orderindex;
	    $scope.newswapoffer.orderidfk = d.data.data[0].orderid;
	    $scope.newswapoffer.offeredby = username;
	    $scope.newswapoffer.buysell = d.data.data[0].buysell;
	    $scope.newswapoffer.neardate = d.data.data[0].neardate;
	    $scope.newswapoffer.fardate = d.data.data[0].fardate;
	    $scope.newswapoffer.nearmagin = 0;
	    //
	    if($scope.newswapoffer.buysellbank == 'BUY'){
	    	$scope.holder = 3;
	    	$scope.newswapoffer.buysellbank_disp = 'BUY(leg 1) - SELL(leg 2)';
	    	$scope.newswapoffer.nearbuyorderamountccy_disp = $scope.newswapoffer.nearsellorderamountccy;
	    	$scope.newswapoffer.nearsellorderamountccy_disp = $scope.newswapoffer.nearbuyorderamountccy;
	    	$scope.newswapoffer.nearbuyorderamount_disp = $scope.newswapoffer.nearsellorderamount;
	    	$scope.newswapoffer.nearsellorderamount_disp = $scope.newswapoffer.nearbuyorderamount;
	    	//far leg
	    	$scope.newswapoffer.farbuyorderamountccy_disp = $scope.newswapoffer.farsellorderamountccy;
	    	$scope.newswapoffer.farsellorderamountccy_disp = $scope.newswapoffer.farbuyorderamountccy;
	    	$scope.newswapoffer.farbuyorderamount_disp = $scope.newswapoffer.farsellorderamount;
	    	$scope.newswapoffer.farsellorderamount_disp = $scope.newswapoffer.farbuyorderamount;
	    	
	    }else{
	    	$scope.holder = -3;
	    	$scope.newswapoffer.buysellbank_disp = 'SELL(leg 1) - BUY(leg 2)';
	    	$scope.newswapoffer.nearbuyorderamountccy_disp = $scope.newswapoffer.nearsellorderamountccy;
	    	$scope.newswapoffer.nearsellorderamountccy_disp = $scope.newswapoffer.nearbuyorderamountccy;
	    	$scope.newswapoffer.nearbuyorderamount_disp = $scope.newswapoffer.nearsellorderamount;
	    	$scope.newswapoffer.nearsellorderamount_disp = $scope.newswapoffer.nearbuyorderamount;
	    	//far leg
	    	$scope.newswapoffer.farbuyorderamountccy_disp = $scope.newswapoffer.farsellorderamountccy;
	    	$scope.newswapoffer.farsellorderamountccy_disp = $scope.newswapoffer.farbuyorderamountccy;
	    	$scope.newswapoffer.farbuyorderamount_disp = $scope.newswapoffer.farsellorderamount;
	    	$scope.newswapoffer.farsellorderamount_disp = $scope.newswapoffer.farbuyorderamount;
	    }
	    $scope.newswapoffer.nearlegamount1 = $filter('limitTo')(d.data.data[0].ccypair,$scope.holder)+d.data.data[0].orderamount;
	    $scope.newswapoffer.farlegamount1 = $filter('limitTo')(d.data.data[0].ccypair,$scope.holder)+d.data.data[0].orderamount;
	    
	    	$scope.newswapoffer.nearlegamount_1ccy = $filter('limitTo')(d.data.data[0].ccypair,$scope.holder);
			$scope.newswapoffer.nearlegamount_1 = d.data.data[0].orderamount;
			$scope.newswapoffer.farlegamount_1ccy = $filter('limitTo')(d.data.data[0].ccypair,$scope.holder);
			$scope.newswapoffer.farlegamount_1 = d.data.data[0].orderamount;
	})
	
	$scope.fill = function(){
		if($scope.newswapoffer.buysellbank == 'BUY' && $scope.newswapoffer.nearsellorderamount>0){
			$scope.newswapoffer.nearofferedrate = parseFloat($scope.newswapoffer.nearspotrate) - parseFloat($scope.newswapoffer.nearmagin/10000);
			$scope.newswapoffer.nearsellorderamount_disp = $filter('number')(($scope.newswapoffer.nearsellorderamount*$scope.newswapoffer.nearofferedrate),2);
		}else if($scope.newswapoffer.buysellbank == 'BUY' && $scope.newswapoffer.nearbuyorderamount>0){
			$scope.newswapoffer.nearofferedrate = parseFloat($scope.newswapoffer.nearspotrate) - parseFloat($scope.newswapoffer.nearmagin/10000);
			$scope.newswapoffer.nearbuyorderamount_disp = $filter('number')(($scope.newswapoffer.nearbuyorderamount/$scope.newswapoffer.nearofferedrate),2);
		}else if($scope.newswapoffer.buysellbank == 'SELL' && $scope.newswapoffer.nearsellorderamount>0){
			$scope.newswapoffer.nearofferedrate = parseFloat($scope.newswapoffer.nearspotrate) + parseFloat($scope.newswapoffer.nearmagin/10000);
			$scope.newswapoffer.nearsellorderamount_disp = $filter('number')(($scope.newswapoffer.nearsellorderamount/$scope.newswapoffer.nearofferedrate),2);
		}else if($scope.newswapoffer.buysellbank == 'SELL' && $scope.newswapoffer.nearbuyorderamount>0){
			$scope.newswapoffer.nearofferedrate = parseFloat($scope.newswapoffer.nearspotrate) + parseFloat($scope.newswapoffer.nearmagin/10000);
			$scope.newswapoffer.nearbuyorderamount_disp = $filter('number')(($scope.newswapoffer.nearbuyorderamount*$scope.newswapoffer.nearofferedrate),2);
		}
	}
	
	$scope.fill_far = function(){
		if($scope.newswapoffer.buysellbank == 'BUY' && $scope.newswapoffer.nearsellorderamount>0){
			$scope.newswapoffer.farofferedrate = parseFloat($scope.newswapoffer.farspotrate) + parseFloat($scope.newswapoffer.farmagin/10000);
			$scope.newswapoffer.farbuyorderamount_disp = $filter('number')(($scope.newswapoffer.farbuyorderamount*$scope.newswapoffer.farofferedrate),2);
		}else if($scope.newswapoffer.buysellbank == 'BUY' && $scope.newswapoffer.nearbuyorderamount>0){
			$scope.newswapoffer.farofferedrate = parseFloat($scope.newswapoffer.farspotrate) + parseFloat($scope.newswapoffer.farmagin/10000);
			$scope.newswapoffer.farsellorderamount_disp = $filter('number')(($scope.newswapoffer.farsellorderamount/$scope.newswapoffer.farofferedrate),2);
		}else if($scope.newswapoffer.buysellbank == 'SELL' && $scope.newswapoffer.nearsellorderamount>0){
			$scope.newswapoffer.farofferedrate = parseFloat($scope.newswapoffer.farspotrate) - parseFloat($scope.newswapoffer.farmagin/10000);
			$scope.newswapoffer.farbuyorderamount_disp = $filter('number')(($scope.newswapoffer.nearsellorderamount/$scope.newswapoffer.farofferedrate),2);
		}else if($scope.newswapoffer.buysellbank == 'SELL' && $scope.newswapoffer.nearbuyorderamount>0){
			$scope.newswapoffer.farofferedrate = parseFloat($scope.newswapoffer.farspotrate) - parseFloat($scope.newswapoffer.farmagin/10000);
			$scope.newswapoffer.farsellorderamount_disp = $filter('number')(($scope.newswapoffer.farsellorderamount*$scope.newswapoffer.farofferedrate),2);
		}
	}
		
	$scope.newswapOffer =function(){
		$scope.dataLoading = true;
		$scope.newswapoffer.offeredby = username;
					$http({
		              method: 'post',
		              url: '/new_swap_offer',
		              headers: {'Content-Type': 'application/json'},
		              data:{orderindex:$scope.newswapoffer.orderindex,orderidfk:$scope.newswapoffer.orderid,nearspotrate:$scope.newswapoffer.nearspotrate,nearmargin:$scope.newswapoffer.nearmagin,nearfinal:$scope.newswapoffer.nearofferedrate,
		              		nearbuyorderamountccy:$scope.newswapoffer.nearbuyorderamountccy_disp,nearbuyorderamount:$scope.newswapoffer.nearbuyorderamount_disp,nearsellorderamountccy:$scope.newswapoffer.nearsellorderamountccy_disp,nearsellorderamount:$scope.newswapoffer.nearsellorderamount_disp,
		              		neardate:$scope.newswapoffer.neardate,farspot:$scope.newswapoffer.farspotrate,farmargin:$scope.newswapoffer.farmagin,farfinal:$scope.newswapoffer.farofferedrate
		              	,farbuyorderamountccy:$scope.newswapoffer.farbuyorderamountccy_disp,farbuyorderamount:$scope.newswapoffer.farbuyorderamount_disp,farsellorderamountccy:$scope.newswapoffer.farsellorderamountccy_disp,farsellorderamount:$scope.newswapoffer.farsellorderamount_disp
		              	,fardate:$scope.newswapoffer.fardate,comment:$scope.newswapoffer.bankcomment,offeredby:domain,bankuser:username
		              }
		            }).success(function (data) {
		            	$timeout(function() {
		            		alert("FxSwap Offer Submitted");
		              		$scope.dataLoading = true;
		              		$scope.newswapoffer = {};
					  		$state.go('homeswap');
		            	}, 3000);
		              
		            }).error(function (err) {
		                alert("Error making Fxswap offer");
		                $scope.dataLoading = true;
		                console.log(err)
		                $scope.newswapoffer = {};
						$state.go('homeswap');
		            });	

		ordersService.updateorderswap($scope.newswapoffer.orderid).then(function(d){})
	}
       
});

app.controller('newmmofferCtrl', function($scope, $stateParams, $filter,$state,$http,$timeout, Data,ordersService) {
	var username = window.sessionStorage.getItem('bankuser');
	var domain = window.sessionStorage.getItem('bankdomain');
	var orderid = $stateParams.indexid;
	var indexid = $stateParams.indexid;
	$scope.Data = Data;
	$scope.Data.pagetitle = 'New MM order';
    $scope.newmmoffer = [];
    $scope.intdays = 365;
     
    ordersService.mmorder(indexid).then(function(d) {
	    $scope.newmmoffer = d.data.data[0];
	    $scope.newmmoffer.orderindex = d.data.data[0].orderindex;
	    $scope.newmmoffer.orderidfk = d.data.data[0].orderid;
	    $scope.newmmoffer.dealtype = d.data.data[0].mmtypebank;
	    $scope.Data.pagetitle = 'New '+ d.data.data[0].mmtypebank+' order';
	    //for interest rate currency days
	    ordersService.get_a_currency(d.data.data[0].ccy).then(function(d) {
	    	//console.log('CCy int days is '+d.data[0].intdays);
	    	$scope.intdays = d.data.data[0].intdays;
	    })
    })
    
    $scope.fill = function(){
    	$scope.newmmoffer.totalinterest = $filter('number')($scope.newmmoffer.orderamount * ($scope.newmmoffer.rate/100) * $scope.newmmoffer.tenuredays/$scope.intdays,2);
    	$scope.newmmoffer.totalinterest2 = $scope.newmmoffer.orderamount * ($scope.newmmoffer.rate/100) * $scope.newmmoffer.tenuredays/$scope.intdays;
    	$scope.newmmoffer.tax = $filter('number')(($scope.newmmoffer.orderamount * ($scope.newmmoffer.rate/100) * $scope.newmmoffer.tenuredays/$scope.intdays) * 0.15,2);
    	$scope.newmmoffer.tax2 = ($scope.newmmoffer.orderamount * ($scope.newmmoffer.rate/100) * $scope.newmmoffer.tenuredays/$scope.intdays) * 0.15;
    	$scope.newmmoffer.netinterest = $filter('number')(($scope.newmmoffer.orderamount * ($scope.newmmoffer.rate/100) * $scope.newmmoffer.tenuredays/$scope.intdays) - ($scope.newmmoffer.orderamount * ($scope.newmmoffer.rate/100) * $scope.newmmoffer.tenuredays/$scope.intdays) * 0.15,2);
    }
    
    $scope.newmmOffer = function(){
    	$scope.dataLoading = true;
				$http({
		              method: 'post',
		              url: '/new_mm_offer',
		              headers: {'Content-Type': 'application/json'},
		              data:{orderindex:$scope.newmmoffer.orderindex,orderidfk:$scope.newmmoffer.orderidfk,fixedrate:$scope.newmmoffer.rate,orderamount:$scope.newmmoffer.orderamount,daycount:$scope.newmmoffer.tenuredays,
		              		totalinterest:$scope.newmmoffer.totalinterest2,tax:$scope.newmmoffer.tax2,netinterest:$scope.newmmoffer.netinterest,
		              		bankcomment:$scope.newmmoffer.bankcomment,offeredby:domain,bankuser:username}
		            }).success(function (data) {
		            	$timeout(function(){
		            		$scope.dataLoading = false;
		            		alert("Offer Submitted");
		              		$scope.newmmoffer = {};
					  		$state.go('homemm');
		            	},3000,true)
		              
		            }).error(function (error) {
		            	$scope.dataLoading = false;
		                alert("Error when making an offer");
		                $scope.newmmoffer = {};
						$state.go('homemm');
		            });	
		
		ordersService.updateordermm(indexid).then(function(d){
			//console.log(d);
		})
    }
});

app.controller('newforwardofferCtrl', function($scope,$state,$stateParams,$rootScope,$timeout,Data,$http,ordersService,$filter,titleService){
	var username = window.sessionStorage.getItem('username');
	var domain = window.sessionStorage.getItem('bankdomain');
	
	var orderid = $stateParams.indexid;
	var indexid = $stateParams.indexid;
	
	$scope.Title = titleService;
	$scope.Title.name = "new forward offer";
	
	$scope.newforwardoffer = {};
	
	
	ordersService.forwardorder(indexid).then(function(d) {
	    $scope.newforwardoffer = d.data.data[0];
	    //console.log($scope.newforwardoffer);
	    $scope.newforwardoffer.orderindex = d.data.data[0].orderindex;
	    $scope.newforwardoffer.orderidfk = d.data.data[0].orderid;
	    $scope.newforwardoffer.offeredby = username;
	    $scope.newforwardoffer.buysell = d.data.data[0].buysell;
	    $scope.newforwardoffer.buysellbank = d.data.data[0].buysellbank;
	    $scope.newforwardoffer.buyorderamount = d.data.data[0].buyorderamount;
	    $scope.newforwardoffer.sellorderamount = d.data.data[0].sellorderamount;
	    $scope.newforwardoffer.buyorderamountccy = d.data.data[0].buyorderamountccy;
	    $scope.newforwardoffer.sellorderamountccy = d.data.data[0].sellorderamountccy;	    
	}); 
	
	$scope.fill = function(){
		
		if($scope.newforwardoffer.buysellbank == 'BUY' && $scope.newforwardoffer.buyorderamount > 0){
			$scope.newforwardoffer.finalrate = parseFloat($scope.newforwardoffer.forwardrate) + parseFloat($scope.newforwardoffer.magin/10000);
			$scope.newforwardoffer.settlementamount = $filter('number')(($scope.newforwardoffer.buyorderamount/$scope.newforwardoffer.finalrate),2);
			$scope.newforwardoffer.settlementamountccy = $filter('limitTo')($scope.newforwardoffer.ccypair,3);
			$scope.newforwardoffer.sellorderamount = $scope.newforwardoffer.settlementamount;
		}else if($scope.newforwardoffer.buysellbank == 'BUY' && $scope.newforwardoffer.sellorderamount > 0){
			$scope.newforwardoffer.finalrate = $filter('number')(parseFloat($scope.newforwardoffer.forwardrate) - parseFloat($scope.newforwardoffer.magin/10000),2);
			$scope.newforwardoffer.settlementamount = $filter('number')(($scope.newforwardoffer.sellorderamount*$scope.newforwardoffer.finalrate),2);
			$scope.newforwardoffer.settlementamountccy = $filter('limitTo')($scope.newforwardoffer.ccypair,-3);
			$scope.newforwardoffer.buyorderamount = $scope.newforwardoffer.settlementamount;
		}else if($scope.newforwardoffer.buysellbank == 'SELL' && $scope.newforwardoffer.sellorderamount > 0){
			$scope.newforwardoffer.finalrate = $filter('number')(parseFloat($scope.newforwardoffer.forwardrate) + parseFloat($scope.newforwardoffer.magin/10000),2);
			$scope.newforwardoffer.settlementamount = $filter('number')(($scope.newforwardoffer.sellorderamount/$scope.newforwardoffer.finalrate),2);
			$scope.newforwardoffer.settlementamountccy = $filter('limitTo')($scope.newforwardoffer.ccypair,3);
			$scope.newforwardoffer.buyorderamount = $scope.newforwardoffer.settlementamount;
		}else if($scope.newforwardoffer.buysellbank == 'SELL' && $scope.newforwardoffer.buyorderamount > 0){
			$scope.newforwardoffer.finalrate = $filter('number')(parseFloat($scope.newforwardoffer.forwardrate) - parseFloat($scope.newforwardoffer.magin/10000),2);
			$scope.newforwardoffer.settlementamount = $filter('number')(($scope.newforwardoffer.buyorderamount*$scope.newforwardoffer.finalrate),2);
			$scope.newforwardoffer.settlementamountccy = $filter('limitTo')($scope.newforwardoffer.ccypair,-3);
			$scope.newforwardoffer.sellorderamount = $scope.newforwardoffer.settlementamount;
		}

	};

	$scope.newforwardOffer =function(){
		$scope.dataLoading = true;
				$http({
		              method: 'post',
		              url: './new_forward_offer',
		              headers: {'Content-Type': 'application/json'},
		              data:{orderindex:$scope.newforwardoffer.orderindex,orderidfk:$scope.newforwardoffer.orderidfk,spot:$scope.newforwardoffer.forwardrate,magin:$scope.newforwardoffer.magin,finalrate:$scope.newforwardoffer.finalrate,
		              		settlementdate:$scope.newforwardoffer.startdate,offeredby:domain,bankuser:username,settlementamountccy:$scope.newforwardoffer.settlementamountccy,settlementamount:$scope.newforwardoffer.settlementamount,
		              		bankcomment:$scope.newforwardoffer.bankcomment,bankuser:username}
		            }).success(function (data) {
		            	$timeout(function(){
		            		$scope.loading = false;
		            		alert("Forwad offer submitted");
		            		$scope.dataLoading = false;
		              		$scope.newforwardoffer = {};
					  		$state.go('homeforward');
		            	},300,true)
		            }).error(function (error) {
		                alert("Error when making an offer");
		                $scope.dataLoading = false;
		                $scope.newforwardoffer = {};
						$state.go('homeforward');
		            });	
		
		ordersService.updateforwardorder($scope.newforwardoffer.orderindex).then(function(d){})
		            
	}

	$scope.bookId;
});

app.controller('acceptedmmoffersCtrl', function($scope,ordersService){
	$scope.mmoffers = [];
	var username = window.sessionStorage.getItem('username');
	var domain = window.sessionStorage.getItem('bankdomain');
	
	ordersService.accepted_mm_offers(domain).then(function(d){
		$scope.mmoffers = d.data.data;
		$scope.mmnotification = d.data.data.length
	})
});

app.controller('bookmmdealCtrl',function($scope,$http,$state,$stateParams,ordersService){
	$scope.booking = {};
	var offerid = $stateParams.offerid;
	
	ordersService.offerdetails_mm(offerid).then(function(d){
		$scope.booking = d.data.data[0];
		if($scope.booking.mmtypebank == 'Deposit'){
			$scope.booking.orderamount_disp = $scope.booking.orderamount;
			$scope.booking.netamount_disp = $scope.booking.netamount;
		}else{
			$scope.booking.orderamount_disp = $scope.booking.netamount;
			$scope.booking.netamount_disp = $scope.booking.orderamount;
		}
		//console.log(d.data[0]);
	})
	
	$scope.custconfirm = function(){
		$http({
		    method: 'POST',
		    url: '/confirm_mm_offer',
		    headers: {'Content-Type': 'application/json'},
		    data : {offerid: offerid, date:new Date()}
		    }).success(function (data) {
		        alert("MM Deal Successfully Booked");
				$state.go('acceptedoffermm');
		    }).error(function (error) {
		        alert("Error booking a deal");
				$state.go('acceptedoffermm');
		    });
	}
});

app.controller('bookswapdealCtrl', function($scope, $stateParams, $interval,$state,$http, ordersService) {
    $scope.booking = {};
	var offerid = $stateParams.offerid;
	
	ordersService.offerdetails_swap(offerid).then(function(d){
		$scope.booking = d.data.data[0];
		//console.log(d.data.data[0]);
	})
	
	$scope.custconfirm = function(){
		$http({
		    method: 'post',
		    url: '/confirm_swap_offer',
		    headers: {'Content-Type': 'application/json'},
		    data : {offerid: offerid, date: new Date()}
		    }).success(function (data) {
		     	alert("FxSwap Deal Successfully Booked");
				$state.go('acceptedofferswap');
		    }).error(function (error) {
		        alert("Error: "+error);
				$state.go('acceptedofferswap');
		    });
	}
});

app.controller('offersmmCtrl', function($scope,ordersService){
	var username = window.sessionStorage.getItem('username');
	var domain = window.sessionStorage.getItem('bankdomain');
	$scope.mm_offers=[];
	ordersService.all_mm_offers(domain).then(function(d) {
	    $scope.mm_offers = d.data.data;
	});
	
});

app.controller('editmmofferCtrl',function($scope,$stateParams,$http,$window,$state,$filter,$timeout,ordersService){
	var username = window.sessionStorage.getItem('username');
	var orderid = $stateParams.indexid;
	var indexid = $stateParams.indexid;
	$scope.newmmoffer = [];
	$scope.showedit = false;
	var offerid = $stateParams.offerid;
	$scope.offerid = $stateParams.offerid;
	$scope.intdays = 365;
	
	ordersService.offerdetails_mm(offerid).then(function(d) {
		console.log(d.data.data[0]);
	    $scope.newmmoffer = d.data.data[0];
	    $scope.newmmoffer.orderindex = d.data.data[0].orderindex;
	    $scope.newmmoffer.orderidfk = d.data.data[0].orderid;
	    $scope.newmmoffer.dealtype = d.data.data[0].mmtypebank;
	    //$scope.Data.pagetitle = 'New '+ d.data.data[0].mmtypebank+' order';
	    //for interest rate currency days
	    ordersService.get_a_currency(d.data.data[0].ccy).then(function(d) {
	    	//console.log('CCy int days is '+d.data[0].intdays);
	    	$scope.intdays = d.data.data[0].intdays;
	    })
	});

	$scope.btnEdit = function(){
		$scope.showedit = true;
	}

	$scope.btnCancel = function(){
		$scope.showedit = false;
	}
	
	$scope.editmmOffer = function(){
		if ($window.confirm("This will ammend Offer. Do you want to Proceed?")) {
               $scope.dataLoading = true;
				$http({
		              method: 'post',
		              url: '/ammend_mm_offer',
		              headers: {'Content-Type': 'application/json'},
		              data:{offerid:$scope.newmmoffer.offerid,fixedrate:$scope.newmmoffer.fixedrate,totalinterest:$scope.newmmoffer.totalinterest,tax:$scope.newmmoffer.tax,
		              	netinterest:$scope.newmmoffer.netinterest,bankcomment:$scope.newmmoffer.bankcomment}
		            }).success(function (data) {
		            	$timeout(function(){
		            		$scope.dataLoading = false;
		            		alert("Offer ammended");
		              		$scope.newmmoffer = {};
					  		$state.go('homemm');
		            	},3000,true)
		              
		            }).error(function (error) {
		                alert("Error when making an offer");
		                $scope.newmmoffer = {};
						$state.go('homemm');
		            });	
		
					//ordersService.updateordermm().then(function(d){
						//console.log(d);
					//})     
            } else {
              // console.log("You clicked NO.");
            }
	};
	
	$scope.deleteOffer = function(offerid){	
		//console.log($scope.newmmoffer.orderindex);
			if ($window.confirm("This will withdraw offer. Do you want to Proceed?")) {
					$scope.dataLoading = true;
               		$http({
		              method: 'post',
		              url: '/delete_mm_offer',
		              headers: {'Content-Type': 'application/json'},
		              data : {offerid:$scope.offerid}
		            }).success(function (data) {
		            	$timeout(function() {
		            		alert("Offer withdrawn ");
		            		$scope.dataLoading = false;
					  		$state.go('offersmm');
		            	}, 3000);
		            }).error(function () {
		                alert("Error withdrawing Offer");
		                $scope.dataLoading = false;
						$state.go('offersmm');
		            });

		            ordersService.updateordermmreverse($scope.newmmoffer.orderindex).then(function(d){})
		            
            } else {
            	$scope.dataLoading = false;
            }
	};
	
	$scope.fill = function(){
		
    	$scope.newmmoffer.totalinterest = $filter('number')($scope.newmmoffer.orderamount * ($scope.newmmoffer.fixedrate/100) * $scope.newmmoffer.tenuredays/$scope.intdays,2);
    	$scope.newmmoffer.totalinterest2 = $scope.newmmoffer.orderamount * ($scope.newmmoffer.fixedrate/100) * $scope.newmmoffer.tenuredays/$scope.intdays;
    	$scope.newmmoffer.tax = $filter('number')(($scope.newmmoffer.orderamount * ($scope.newmmoffer.fixedrate/100) * $scope.newmmoffer.tenuredays/$scope.intdays) * 0.15,2);
    	$scope.newmmoffer.tax2 = ($scope.newmmoffer.orderamount * ($scope.newmmoffer.fixedrate/100) * $scope.newmmoffer.tenuredays/$scope.intdays) * 0.15;
    	$scope.newmmoffer.netinterest = $filter('number')(parseFloat($scope.newmmoffer.totalinterest2)-parseFloat($scope.newmmoffer.tax2),2);
    //console.log('fill function', parseFloat($scope.newmmoffer.totalinterest2)-parseFloat($scope.newmmoffer.tax2));
    }
});

app.controller('editofferCtrl',function($scope,$stateParams,$http,$window,$state,ordersService){
	$scope.editoffer = [];
	$scope.showedit = false;
	var offerid = $stateParams.offerid;
	$scope.offerid = $stateParams.offerid;
	ordersService.offerdetails(offerid).then(function(d) {
		console.log(d.data.data[0]);
	    $scope.editoffer = d.data.data[0];
	});

	$scope.btnEdit = function(){
		$scope.showedit = true;
	}

	$scope.btnCancel = function(){
		$scope.showedit = false;
	}
	
	$scope.editOffer = function(offerid){
		if ($window.confirm("This will ammend offer. Do you want to Proceed?")) {
				$scope.dataLoading = true;
               		$http({
		              method: 'POST',
		              url: '/edit_spot_offer',
		              headers: {'Content-Type': 'application/json'},
		              data : {offerid:$scope.editoffer.offerid,spotrate:$scope.editoffer.spotrate,magin:$scope.editoffer.magin,settleamount:$scope.editoffer.settleamount,offeredrate:$scope.editoffer.offeredrate,
		              	offercomment:$scope.editoffer.offercomment}
		            }).success(function (data) {
		              alert("offer ammended");
		              $scope.dataLoading = false;
					  $state.go('offers');
		            }).error(function () {
		              alert("Error when ammending Offer");
		              $scope.dataLoading = false;
					  $state.go('offers');
		            });
		            
            } else {
               $scope.dataLoading = false;
            }
	};
	
	$scope.deleteOffer = function(orderindex){
			if ($window.confirm("This will withdraw offer. Do you want to Proceed?")) {
				$scope.dataLoading = true;
               		$http({
		              method: 'post',
		              url: '/delete_spot_offer',
		              headers: {'Content-Type': 'application/json'},
		              data : {offerid:$scope.offerid}
		            }).success(function (data) {
		              alert("Offer Withdrawn ");
		              $scope.dataLoading = false;
					  $state.go('offers');
		            }).error(function () {
		                alert("Error withdrawing Offer");
		                $scope.dataLoading = false;
						$state.go('offers');
		            });

		            ordersService.updateorderreverse(orderindex).then(function(d){})
		            
            } else {
               $scope.dataLoading = false;
            }
	};
	
	$scope.fill = function(){
		$scope.editoffer.offeredrate = ($scope.editoffer.spotrate|0) + ($scope.editoffer.magin)/100|0;
		$scope.editoffer.settleamount = ($scope.editoffer.orderamount*$scope.editoffer.offeredrate);
	};
});


app.controller('editofferswapCtrl',function($scope,$stateParams,$http,$window,$filter,$state,ordersService){
	var username = window.sessionStorage.getItem('username');
	$scope.newswapoffer = [];
	$scope.showedit = false;
	var offerid = $stateParams.offerid;
	$scope.offerid = $stateParams.offerid;
	
	ordersService.offer_s_swap_bank(offerid).then(function(d) {
		console.log('editofferswapCtrl', d.data.data[0]);
	    $scope.newswapoffer = d.data.data[0];
	    $scope.newswapoffer.orderindex = d.data.data[0].orderindex;
	    $scope.newswapoffer.orderidfk = d.data.data[0].orderid;
	    $scope.newswapoffer.offeredby = username;
	    $scope.newswapoffer.buysell = d.data.data[0].buysell;
	    $scope.newswapoffer.neardate = d.data.data[0].neardate;
	    $scope.newswapoffer.fardate = d.data.data[0].fardate;
	    $scope.newswapoffer.nearmagin = 0;
	    //
	    if($scope.newswapoffer.buysellbank == 'BUY'){
	    	$scope.holder = -3;
	    	$scope.newswapoffer.buysellbank_disp = 'BUY(leg 1) - SELL(leg 2)';
	    	$scope.newswapoffer.nearbuyorderamountccy_disp = $scope.newswapoffer.nearbuyorderamountccy;
	    	$scope.newswapoffer.nearsellorderamountccy_disp = $scope.newswapoffer.nearsellorderamountccy;
	    	$scope.newswapoffer.nearbuyorderamount_disp = $scope.newswapoffer.nearbuyorderamount;
	    	$scope.newswapoffer.nearsellorderamount_disp = $scope.newswapoffer.nearsellorderamount;
	    	//far leg
	    	$scope.newswapoffer.farbuyorderamountccy_disp = $scope.newswapoffer.farbuyorderamountccy;
	    	$scope.newswapoffer.farsellorderamountccy_disp = $scope.newswapoffer.farsellorderamountccy;
	    	$scope.newswapoffer.farbuyorderamount_disp = $scope.newswapoffer.farbuyorderamount;
	    	$scope.newswapoffer.farsellorderamount_disp = $scope.newswapoffer.farsellorderamount;
	    	
	    }else{
	    	$scope.holder = 3;
	    	$scope.newswapoffer.buysellbank_disp = 'SELL(leg 1) - BUY(leg 2)';
	    	$scope.newswapoffer.nearbuyorderamountccy_disp = $scope.newswapoffer.nearbuyorderamountccy;
	    	$scope.newswapoffer.nearsellorderamountccy_disp = $scope.newswapoffer.nearsellorderamountccy;
	    	$scope.newswapoffer.nearbuyorderamount_disp = $scope.newswapoffer.nearbuyorderamount;
	    	$scope.newswapoffer.nearsellorderamount_disp = $scope.newswapoffer.nearsellorderamount;
	    	//far leg
	    	$scope.newswapoffer.farbuyorderamountccy_disp = $scope.newswapoffer.farbuyorderamountccy;
	    	$scope.newswapoffer.farsellorderamountccy_disp = $scope.newswapoffer.farsellorderamountccy;
	    	$scope.newswapoffer.farbuyorderamount_disp = $scope.newswapoffer.farbuyorderamount;
	    	$scope.newswapoffer.farsellorderamount_disp = $scope.newswapoffer.farsellorderamount;
	    }
	    $scope.newswapoffer.nearlegamount1 = $filter('limitTo')(d.data.data[0].ccypair,$scope.holder)+d.data.data[0].orderamount;
	    $scope.newswapoffer.farlegamount1 = $filter('limitTo')(d.data.data[0].ccypair,$scope.holder)+d.data.data[0].orderamount;
	    
	    	$scope.newswapoffer.nearlegamount_1ccy = $filter('limitTo')(d.data.data[0].ccypair,$scope.holder);
			$scope.newswapoffer.nearlegamount_1 = d.data.data[0].orderamount;
			$scope.newswapoffer.farlegamount_1ccy = $filter('limitTo')(d.data.data[0].ccypair,$scope.holder);
			$scope.newswapoffer.farlegamount_1 = d.data.data[0].orderamount;
	});

	$scope.btnEdit = function(){
		$scope.showedit = true;
	}

	$scope.btnCancel = function(){
		$scope.showedit = false;
	}
      
	$scope.editOffer = function(){
		if ($window.confirm("This will ammend offer. Do you want to Proceed?")) {
				$scope.dataLoading = true;
               		$http({
		              method: 'post',
		              url: '/edit_swap_offer',
		              headers: {'Content-Type': 'application/json'},
		              data : {
		              	offerid:$stateParams.offerid,nearmargin:$scope.newswapoffer.nearmargin,nearspot:$scope.newswapoffer.nearspot,nearfinal:$scope.newswapoffer.nearfinal,
		              	nearbuyorderamount:$scope.newswapoffer.nearbuyorderamount_disp,nearsellorderamount:$scope.newswapoffer.nearsellorderamount_disp,
		              	farspot:$scope.newswapoffer.farspot,farmargin:$scope.newswapoffer.farmargin,farfinal:$scope.newswapoffer.farfinal,
		              	farbuyorderamount:$scope.newswapoffer.farbuyorderamount_disp,farsellorderamount:$scope.newswapoffer.farsellorderamount_disp
		              }
		            }).success(function (data) {
		              alert("offer ammended");
		              $scope.dataLoading = false;
					  $state.go('offersswap');
		            }).error(function () {
		              alert("Error when ammending Offer");
		              $scope.dataLoading = false;
					  $state.go('offersswap');
		            });
		            
            } else {
               $scope.dataLoading = false;
            }
	};
	
	$scope.deleteOffer = function(orderindex){
			if ($window.confirm("This will withdraw offer. Do you want to Proceed?")) {
				$scope.dataLoading = true;
               		$http({
		              method: 'post',
		              url: '/delete_swap_offer',
		              headers: {'Content-Type': 'application/json'},
		              data : {offerid:$scope.offerid}
		            }).success(function (data) {
		              alert("Offer Withdrawn ");
		              $scope.dataLoading = false;
					  $state.go('offersswap');
		            }).error(function () {
		                alert("Error withdrawing Offer");
		                $scope.dataLoading = false;
						$state.go('offersswap');
		            });

		            ordersService.updateorderreverse(orderindex).then(function(d){})
		            
            } else {
               $scope.dataLoading = false;
            }
	};
	
	$scope.fill = function(){
		console.log('fill function', $scope.newswapoffer.buysellbank);

		if($scope.newswapoffer.buysellbank == 'BUY' && $scope.newswapoffer.nearsellorderamount>0){
			$scope.newswapoffer.nearfinal = parseFloat($scope.newswapoffer.nearspot) - parseFloat($scope.newswapoffer.nearmargin/10000);
			$scope.newswapoffer.nearsellorderamount_disp = $filter('number')(($scope.newswapoffer.nearsellorderamount*$scope.newswapoffer.nearfinal),2);
		}else if($scope.newswapoffer.buysellbank == 'BUY' && $scope.newswapoffer.nearbuyorderamount>0){
			$scope.newswapoffer.nearfinal = parseFloat($scope.newswapoffer.nearspot) - parseFloat($scope.newswapoffer.nearmargin/10000);
			$scope.newswapoffer.nearbuyorderamount_disp = $filter('number')(($scope.newswapoffer.nearbuyorderamount/$scope.newswapoffer.nearfinal),2);
		}else if($scope.newswapoffer.buysellbank == 'SELL' && $scope.newswapoffer.nearsellorderamount>0){
			$scope.newswapoffer.nearfinal = parseFloat($scope.newswapoffer.nearspot) + parseFloat($scope.newswapoffer.nearmargin/10000);
			$scope.newswapoffer.nearbuyorderamount_disp = $filter('number')(($scope.newswapoffer.nearsellorderamount*$scope.newswapoffer.nearfinal),2);
		}else if($scope.newswapoffer.buysellbank == 'SELL' && $scope.newswapoffer.nearbuyorderamount>0){
			$scope.newswapoffer.nearfinal = parseFloat($scope.newswapoffer.nearspot) + parseFloat($scope.newswapoffer.nearmargin/10000);
			$scope.newswapoffer.nearsellorderamount_disp = $filter('number')(($scope.newswapoffer.nearbuyorderamount/$scope.newswapoffer.nearfinal),2);
		}
	}
	
	$scope.fill_far = function(){
		if($scope.newswapoffer.buysellbank == 'BUY' && $scope.newswapoffer.nearsellorderamount>0){

			$scope.newswapoffer.farfinal = parseFloat($scope.newswapoffer.farspot) + parseFloat($scope.newswapoffer.farmargin/10000);
			$scope.newswapoffer.farbuyorderamount_disp = $filter('number')(($scope.newswapoffer.farbuyorderamount*$scope.newswapoffer.farfinal),2);
		}else if($scope.newswapoffer.buysellbank == 'BUY' && $scope.newswapoffer.nearbuyorderamount>0){

			$scope.newswapoffer.farfinal = parseFloat($scope.newswapoffer.farspot) + parseFloat($scope.newswapoffer.farmargin/10000);
			$scope.newswapoffer.farsellorderamount_disp = $filter('number')(($scope.newswapoffer.farsellorderamount/$scope.newswapoffer.farfinal),2);
		}else if($scope.newswapoffer.buysellbank == 'SELL' && $scope.newswapoffer.nearsellorderamount>0){

			$scope.newswapoffer.farfinal = parseFloat($scope.newswapoffer.nearspot) - parseFloat($scope.newswapoffer.nearmargin/10000);
			$scope.newswapoffer.farsellorderamount_disp = $filter('number')(($scope.newswapoffer.nearsellorderamount*$scope.newswapoffer.farfinal),2);
		}else if($scope.newswapoffer.buysellbank == 'SELL' && $scope.newswapoffer.nearbuyorderamount>0){
			$scope.newswapoffer.farfinal = parseFloat($scope.newswapoffer.farspot) - parseFloat($scope.newswapoffer.farmargin/10000);
			$scope.newswapoffer.farbuyorderamount_disp = $filter('number')(($scope.newswapoffer.farsellorderamount/$scope.newswapoffer.farfinal),2);
		}
	}
		
	$scope.newswapOffer =function(){
		$scope.dataLoading = true;
		$scope.newswapoffer.offeredby = username;
					$http({
		              method: 'post',
		              url: '/new_swap_offer',
		              headers: {'Content-Type': 'application/json'},
		              data:{orderindex:$scope.newswapoffer.orderindex,orderidfk:$scope.newswapoffer.orderid,nearspotrate:$scope.newswapoffer.nearspotrate,nearmargin:$scope.newswapoffer.nearmagin,nearfinal:$scope.newswapoffer.nearofferedrate,
		              		nearbuyorderamountccy:$scope.newswapoffer.nearbuyorderamountccy_disp,nearbuyorderamount:$scope.newswapoffer.nearbuyorderamount_disp,nearsellorderamountccy:$scope.newswapoffer.nearsellorderamountccy_disp,nearsellorderamount:$scope.newswapoffer.nearsellorderamount_disp,
		              		neardate:$scope.newswapoffer.neardate,farspot:$scope.newswapoffer.farspotrate,farmargin:$scope.newswapoffer.farmagin,farfinal:$scope.newswapoffer.farofferedrate
		              	,farbuyorderamountccy:$scope.newswapoffer.farbuyorderamountccy_disp,farbuyorderamount:$scope.newswapoffer.farbuyorderamount_disp,farsellorderamountccy:$scope.newswapoffer.farsellorderamountccy_disp,farsellorderamount:$scope.newswapoffer.farsellorderamount_disp
		              	,fardate:$scope.newswapoffer.fardate,comment:$scope.newswapoffer.bankcomment,offeredby:domain,bankuser:username
		              }
		            }).success(function (data) {
		            	$timeout(function() {
		            		alert("FxSwap Offer Submitted");
		              		$scope.dataLoading = true;
		              		$scope.newswapoffer = {};
					  		$state.go('homeswap');
		            	}, 3000);
		              
		            }).error(function (err) {
		                alert("Error making Fxswap offer");
		                $scope.dataLoading = true;
		                console.log(err)
		                $scope.newswapoffer = {};
						$state.go('homeswap');
		            });	

		ordersService.updateorderswap($scope.newswapoffer.orderid).then(function(d){})
	}
});

app.controller('editforwardofferCtrl', function($scope,$stateParams,$http,$filter,$state,$timeout,$window,ordersService){
	$scope.showedit = false;
	var offerid = $stateParams.offerid;
	$scope.newforwardoffer = [];

	$scope.btnEdit = function(){
		$scope.showedit = true;
	}

	$scope.btnCancel = function(){
		$scope.showedit = false;
	}

		ordersService.forwardoffer_bank(offerid).then(function(d) {
			console.log(d.data.data[0])
		    $scope.newforwardoffer = d.data.data[0];
		});

		$scope.fill = function(){
		
		if($scope.newforwardoffer.buysellbank == 'BUY' && $scope.newforwardoffer.buyorderamount > 0){
			$scope.newforwardoffer.finalrate = parseFloat($scope.newforwardoffer.spot) + parseFloat($scope.newforwardoffer.magin/100);
			$scope.newforwardoffer.settlementamount = $filter('number')(($scope.newforwardoffer.buyorderamount/$scope.newforwardoffer.finalrate),2);
			$scope.newforwardoffer.settlementamountccy = $filter('limitTo')($scope.newforwardoffer.ccypair,3);
		}else if($scope.newforwardoffer.buysellbank == 'BUY' && $scope.newforwardoffer.sellorderamount > 0){
			$scope.newforwardoffer.finalrate = $filter('number')(parseFloat($scope.newforwardoffer.spot) - parseFloat($scope.newforwardoffer.magin/100),2);
			$scope.newforwardoffer.settlementamount = $filter('number')(($scope.newforwardoffer.sellorderamount*$scope.newforwardoffer.finalrate),2);
			$scope.newforwardoffer.settlementamountccy = $filter('limitTo')($scope.newforwardoffer.ccypair,-3);

		}else if($scope.newforwardoffer.buysellbank == 'SELL' && $scope.newforwardoffer.sellorderamount > 0){
			$scope.newforwardoffer.finalrate = $filter('number')(parseFloat($scope.newforwardoffer.spot) + parseFloat($scope.newforwardoffer.magin/100),2);
			$scope.newforwardoffer.settlementamount = $filter('number')(($scope.newforwardoffer.sellorderamount/$scope.newforwardoffer.finalrate),2);
			$scope.newforwardoffer.settlementamountccy = $filter('limitTo')($scope.newforwardoffer.ccypair,3);
		}else if($scope.newforwardoffer.buysellbank == 'SELL' && $scope.newforwardoffer.buyorderamount > 0){
			$scope.newforwardoffer.finalrate = $filter('number')(parseFloat($scope.newforwardoffer.spot) - parseFloat($scope.newforwardoffer.magin/100),2);
			$scope.newforwardoffer.settlementamount = $filter('number')(($scope.newforwardoffer.buyorderamount*$scope.newforwardoffer.finalrate),2);
			$scope.newforwardoffer.settlementamountccy = $filter('limitTo')($scope.newforwardoffer.ccypair,-3);
		}

	};

	$scope.updateforwardOffer =function(){
		if ($window.confirm("This will update offer. Do you want to Proceed?")) {
		$scope.dataLoading = true;
				$http({
		              method: 'post',
		              url: '/update_forward_offer',
		              headers: {'Content-Type': 'application/json'},
		              data:{offerid:offerid,spot:$scope.newforwardoffer.spot,magin:$scope.newforwardoffer.magin,finalrate:$scope.newforwardoffer.finalrate,
		              		settlementamountccy:$scope.newforwardoffer.settlementamountccy,settlementamount:$scope.newforwardoffer.settlementamount,bankcomment:$scope.newforwardoffer.bankcomment}
		            }).success(function (data) {
		            	$timeout(function(){
		            		$scope.dataLoading = false;
		            		alert("offer ammended");
		            		$scope.dataLoading = false;
		              		$scope.newforwardoffer = {};
					  		$state.go('offersforward');
		            	},300,true)
		            }).error(function (error) {
		                alert("Error when ammending offer");
		                $scope.dataLoading = false;
		                $scope.newforwardoffer = {};
						$state.go('offersforward');
		            });	
		    } else {
               $scope.dataLoading = false;
            }
		            
	}


	$scope.deleteOffer = function(orderindex){
			if ($window.confirm("This will withdraw offer. Do you want to Proceed?")) {
				$scope.dataLoading = true;
               		$http({
		              method: 'post',
		              url: '/delete_forward_offer',
		              headers: {'Content-Type': 'application/json'},
		              data : {offerid:offerid}
		            }).success(function (data) {
		              alert("Offer Withdrawn ");
		              $scope.dataLoading = false;
					  $state.go('offersforward');
		            }).error(function () {
		                alert("Error withdrawing Offer");
		                $scope.dataLoading = false;
						$state.go('offersforward');
		            });

		            ordersService.updateorderforwardreverse($scope.newforwardoffer.orderindex).then(function(d){})
		            
            } else {
               $scope.dataLoading = false;
            }
	};

});

app.controller('sheduleCtrl', function($scope, $stateParams){
	var freq = $stateParams.freq;
	var nofreq = $stateParams.nofreq;
	var startdate = $stateParams.startdate;
	var buyorderamount = $stateParams.buyorderamount;
	var buyorderamountccy = $stateParams.buyorderamountccy;
	var sellorderamount = $stateParams.sellorderamount;
	var sellorderamountccy = $stateParams.sellorderamountccy;

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
});

