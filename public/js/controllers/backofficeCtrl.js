var app = angular.module('backoffice.controller', ['marginService']);

app.controller('backofficeCtrl',function($scope,$window, ordersService, socketio) {
	$scope.confirmedoffers = [];
	$scope.confirmedswapoffers = [];
	$scope.confirmedforwardoffers = [];
	$scope.confirmedmmoffers = [];

    $scope.confirmedforwardoffers_notification = 0;
    $scope.confirmedmmoffers_notification = 0;
    $scope.confirmedswapoffers_notification = 0;
    $scope.total_notification = 0;

    confirmed_forward_bo();
    confirmed_offers();
    confirmed_mm_offers();
    confirmed_swap_offers();

    socketio.on('accept_forward_deal', function(msg){
        confirmed_forward_bo();
       // Notification.success({message: msg.buysell+' '+msg.ccypair+'<br><b>'+ msg.usernamefk+'</b><br><a href="#/homemm">Make an Offer</a>', title: 'MarginIQ',positionY: 'bottom', positionX: 'right', delay: null});
    });

    socketio.on('accept_spot_deal', function(msg){
        confirmed_offers();
    });
	
	function confirmed_offers(){
        ordersService.confirmed_offers().then(function(d){
            $scope.confirmedoffers = d.data.data;
            $scope.confirmedoffers_notification = d.data.data.length;
            add();
        })
    }
    
    function confirmed_swap_offers(){
        ordersService.confirmed_swap_offers().then(function(d){
            $scope.confirmedswapoffers = d.data.data;
            $scope.confirmedswapoffers_notification = d.data.data.length;
            add();
        })
    }
    
    
    function confirmed_mm_offers(){
        ordersService.confirmed_mm_offers().then(function(d){
            $scope.confirmedmmoffers = d.data.data;
            $scope.confirmedmmoffers_notification = d.data.data.length;
            add();
        })
    }
    

    function confirmed_forward_bo(){
        ordersService.confirmed_forward_bo().then(function(d){
            $scope.confirmedforwardoffers = d.data.data
            $scope.confirmedforwardoffers_notification = d.data.data.length;
            add();
        }) 
    }

    function add(){
        $scope.total_notification = $scope.confirmedoffers_notification + $scope.confirmedforwardoffers_notification + $scope.confirmedmmoffers_notification + $scope.confirmedswapoffers_notification
    } 

    function payment_forward_all(){
        ordersService.confirmed_forward_all().then(function(d){
            $scope.confirmedforwardoffers = d.data.data
            $scope.confirmedforwardoffers_notification = d.data.data.length;
            add();
        }) 
    }

    function payment_swap_all(){
        ordersService.confirmed_swap_all().then(function(d){
            //console.log(d.data)
            $scope.confirmedswapoffers = d.data.data;
            $scope.confirmedswapoffers_notification = d.data.data.length;
            add();
        }) 
    }

    function payment_mm_all(){
        ordersService.confirmed_mm_all().then(function(d){
            $scope.confirmedmmoffers = d.data.data;
            $scope.confirmedmmoffers_notification = d.data.data.length;
            add();
        }) 
    }

    function payment_spot_all(){
        ordersService.confirmed_spot_all().then(function(d){
            $scope.confirmedoffers = d.data.data;
            $scope.confirmedoffers_notification = d.data.data.length;
            add();
        }) 
    }

    function payment_forward_paid(){
        ordersService.confirmed_forward_paid().then(function(d){
            $scope.confirmedforwardoffers = d.data.data
            $scope.confirmedforwardoffers_notification = d.data.data.length;
            add();
        }) 
    } 

    function payment_swap_paid(){
        ordersService.confirmed_swap_paid().then(function(d){
            $scope.confirmedswapoffers = d.data.data;
            $scope.confirmedswapoffers_notification = d.data.data.length;
            add();
        }) 
    } 

    function payment_spot_paid(){
        ordersService.confirmed_spot_paid().then(function(d){
            $scope.confirmedoffers = d.data.data;
            $scope.confirmedoffers_notification = d.data.data.length;
            add();
        }) 
    } 

    function payment_mm_paid(){
        ordersService.confirmed_mm_paid().then(function(d){
            $scope.confirmedmmoffers = d.data.data;
            $scope.confirmedmmoffers_notification = d.data.data.length;
            add();
        }) 
    } 

    $scope.payforaward = function(offerid){
        if($window.confirm('Are you sure?')) {
            ordersService.payment_forward(offerid).then(function(d){
                alert('offer paid '+offerid);
                confirmed_forward_bo();
            })
            
        } else {
            console.log('No');
        }
    } 

    $scope.payspot = function(offerid){
        if($window.confirm('Are you sure?')) {
            ordersService.payment_spot(offerid).then(function(d){
                alert('offer paid ' + offerid);
                confirmed_offers();
            })
            
        } else {
            console.log('No');
        }
    }

    $scope.paymm = function(offerid){
        if($window.confirm('Are you sure?')) {
            ordersService.payment_mm(offerid).then(function(d){
                alert('offer paid '+offerid);
                confirmed_mm_offers();
            })
            
        } else {
            console.log('No');
        }
    }

    $scope.payswap = function(offerid){
        if($window.confirm('Are you sure?')) {
            ordersService.payment_swap(offerid).then(function(d){
                alert('offer paid '+offerid);
                confirmed_swap_offers();
            })
            
        } else {
            console.log('No');
        }
    }

    $scope.archiveBtn = function(input){
        if(input == 'ALL'){
            payment_forward_all();
        }else if(input == 'PAID'){
            payment_forward_paid();
        }else{
            confirmed_forward_bo();
        }
    }

    $scope.archiveBtn_mm = function(input){
        if(input == 'ALL'){
            payment_mm_all();
        }else if(input == 'PAID'){
            payment_mm_paid();
        }else{
            confirmed_mm_offers();
        }
    }

    $scope.archiveBtn_swap = function(input){
        if(input == 'ALL'){
            payment_swap_all();
        }else if(input == 'PAID'){
            payment_swap_paid();
        }else{
            confirmed_swap_offers();
        }
    }

    $scope.archiveBtn_spot = function(input){
        if(input == 'ALL'){
            payment_spot_all();
        }else if(input == 'PAID'){
            payment_spot_paid();
        }else{
            confirmed_offers();
        }
    }
})