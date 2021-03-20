var app = angular.module('marginService', []);

app.service('AuthService', function($q, $http,API_ENDPOINT) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var isAuthenticated = false;
  var authToken;
 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }
 
  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common.Authorization = authToken;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }
 
  var register = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/signup', user).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };

  var newuser = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/newuser', user).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };
 
  var login = function(user) {
    return $q(function(resolve, reject) {
      $http.post('/api/authenticate', user).then(function(result) {
        if (result.data.success) {
          storeUserCredentials(result.data.token);
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };
 
  var logout = function() {
    destroyUserCredentials();
  };
 
  loadUserCredentials();
 
  return {
    login: login,
    register: register,
    newuser:newuser,
    logout: logout,
    isAuthenticated: function() {return isAuthenticated;},
  };
});

app.factory('socketio', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});

app.factory('ordersService', function($http){
	var myService = {
			updateorder: function(orderindex) {
			      var promise = $http({
			      		method:'POST',
			      		url:'/updateorder',
			      		headers: {'Content-Type': 'application/json'},
			      		data:{orderindex:orderindex}
			      }).success(function (response) {
			        		return response;
			      		}).error(function(err){
			      			console.log("Error: "+err);
			      		});
			      return promise;
			    },
			    updateforwardorder: function(orderindex) {
			      var promise = $http({
			      		method:'POST',
			      		url:'/updateforwardorder',
			      		headers: {'Content-Type': 'application/json'},
			      		data:{orderindex:orderindex}
			      }).success(function (response) {
			        		return response;
			      		}).error(function(err){
			      			console.log("Error: "+err);
			      		});
			      return promise;
			    },
			    updateOffersQuery: function(offerid) {
				      var promise = $http({
				      		method:'POST',
				      		url:'/accept_offer',
				      		headers: {'Content-Type': 'application/json'},
				      		data:{offerid:offerid}
				      }).success(function (response) {
				        		return response;
				      		}).error(function(err){
				      			console.log("Error: "+err);
				      		});
				      return promise;
				},
				updateForwardQuery: function(offerid) {
				      var promise = $http({
				      		method:'POST',
				      		url:'/accept_forward_offer',
				      		headers: {'Content-Type': 'application/json'},
				      		data:{offerid:offerid}
				      }).success(function (response) {
				        		return response;
				      		}).error(function(err){
				      			console.log("Error: "+err);
				      		});
				      return promise;
				},
				    updateOrdersQuery: function(orderid) {
					      var promise = $http({
					      		method:'POST',
					      		url:'/accept_offer1',
					      		headers: {'Content-Type': 'application/json'},
					      		data:{orderid:orderid}
					      }).success(function (response) {
					        		return response;
					      		}).error(function(err){
					      			console.log("Error: "+err);
					      		});
					      return promise;
					},
					updateOrdersQueryforward: function(orderid) {
					      var promise = $http({
					      		method:'POST',
					      		url:'/accept_forward_offer1',
					      		headers: {'Content-Type': 'application/json'},
					      		data:{orderid:orderid}
					      }).success(function (response) {
					        		return response;
					      		}).error(function(err){
					      			console.log("Error: "+err);
					      		});
					      return promise;
					},
			      offer: function(offerid) {
			        var promise = $http({
			        		method:'GET',
			        		url:'/get_offer/'+ offerid,
			        		headers: {'Content-Type': 'application/json'}
			        }).success(function (response) {
			          		return response;
			        }).error(function(err){
			        		console.log("Error: "+err);
			        });
			        return promise;
			      },
			      forwardoffer: function(offerid) {
			        var promise = $http({
			        		method:'GET',
			        		url:'/get_forward_offer/'+ offerid,
			        		headers: {'Content-Type': 'application/json'}
			        }).success(function (response) {
			          		return response;
			        }).error(function(err){
			        		console.log("Error: "+err);
			        });
			        return promise;
			      },
			      forwardoffer_bank: function(offerid) {
			        var promise = $http({
			        		method:'GET',
			        		url:'/get_a_forward_offer/'+ offerid,
			        		headers: {'Content-Type': 'application/json'}
			        }).success(function (response) {
			          		return response;
			        }).error(function(err){
			        		console.log("Error: "+err);
			        });
			        return promise;
			      },
			      offerdetails: function(x) {
			          var promise = $http({
			          		method:'GET',
			          		url:'/get_an_offer/'+x,
			          		headers: {'Content-Type': 'application/json'}
			      //    	params:{id:x}
			          }).success(function (response) {
			          			//console.log(response);
			            		return response;
			          		}).error(function(error){
			          			console.log("Error: "+error);
			          		});
			          return promise;
			        },
			        forwardofferdetails: function(x) {
			          var promise = $http({
			          		method:'GET',
			          		url:'/get_a_forward_offer/'+x,
			          		headers: {'Content-Type': 'application/json'}
			      //    	params:{id:x}
			          }).success(function (response) {
			          			//console.log(response);
			            		return response;
			          		}).error(function(error){
			          			console.log("Error: "+error);
			          		});
			          return promise;
			        },
			      all_offers: function(username) {
			          var promise = $http({
			          		method:'GET',
			          		url:'/all_offers_test',
			          		headers: {'Content-Type': 'application/json'},
			          		params:	 {id:username}
			          }).success(function (response) {
			            	return response;
			          }).error(function(err){
			          		console.log("Error on all_offers ", err);
			          });
			          return promise;
			        },
			        all_open_offers: function(username) {
			          var promise = $http({
			          		method:'GET',
			          		url:'/all_offers_open',
			          		headers: {'Content-Type': 'application/json'},
			          		params:	 {id:username}
			          }).success(function (response) {
			            	return response;
			          }).error(function(err){
			          		console.log("Error on all_offers ", err);
			          });
			          return promise;
			        },
			        all_open_offers_forward: function(domain) {
			          var promise = $http({
			          		method:'get',
			          		url:'/all_open_offers_forward',
			          		headers: {'Content-Type': 'application/json'},
			          		params:	 {domain:domain}
			          }).success(function (response) {
			          		//console.log(response);
			            	return response;
			          }).error(function(err){
			          		console.log("Error on all_offers ", err);
			          });
			          return promise;
			        },
			        all_mm_offers: function(domain) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/all_mm_offers',
				      		headers: {'Content-Type': 'application/json'},
				      		params:	 {domain:domain}
				      }).success(function (response) {
				      		//console.log('all_mm_offers',response);
				        	return response;
				      }).error(function(error){
				      		alert("Error on all_mm_offers: "+ error);
				      });
				      return promise;
				    },
			        accepted_offers: function(username) {
			            var promise = $http({
			            		method:'GET',
			            		url:'/accepted_offers',
			            		headers: {'Content-Type': 'application/json'},
			            		params:	 {id:username}
			            }).success(function (response) {
			            		//console.log(response);
			              	return response;
			            }).error(function(error){
			            		alert("Error: "+ error);
			            });
			            return promise;
			          },
			          accepted_buy_offers: function(username) {
			              var promise = $http({
			              		method:'GET',
			              		url:'/accepted_buy_offers',
			              		headers: {'Content-Type': 'application/json'},
			              		params:	 {id:username}
			              }).success(function (response) {
			              		//console.log(response);
			                	return response;
			              }).error(function(error){
			              		alert("Error: "+ error);
			              });
			              return promise;
			            },
			            accepted_forward_offers: function(username) {
			              var promise = $http({
			              		method:'GET',
			              		url:'/accepted_forward_offers',
			              		headers: {'Content-Type': 'application/json'},
			              		params:	 {id:username}
			              }).success(function (response) {
			              		//console.log(response);
			                	return response;
			              }).error(function(error){
			              		console.log("Error: "+ error);
			              });
			              return promise;
			            },
			            accepted_swap_offers: function(username) {
			                var promise = $http({
			                		method:'GET',
			                		url:'/accepted_swap_offers',
			                		headers: {'Content-Type': 'application/json'},
			                		params:	 {username:username}
			                }).success(function (response) {
			                  	return response;
			                }).error(function(error){
			                	alert("Error: "+ error);
			                });
			                return promise;
			           },
			           all_swap_offers: function(username) {
			                var promise = $http({
			                		method:'GET',
			                		url:'/all_swap_offers',
			                		headers: {'Content-Type': 'application/json'},
			                		params:	 {username:username}
			                }).success(function (response) {
			                  	return response;
			                }).error(function(error){
			                	alert("Error: "+ error);
			                });
			                return promise;
			           },
			           to_confirm_offers: function(x) {
			        	      var promise = $http({
			        	      		method:'GET',
			        	      		url:'/to_confirm_offers',
			        	      		headers: {'Content-Type': 'application/json'},
			        	      		params:	 {id:x}
			        	      }).success(function (response) {
			        	        	return response;
			        	      }).error(function(error){
			        	      		alert("Error: "+ error);
			        	      });
			        	      return promise;
			          },
			          to_confirm_forward: function(x) {
			        	      var promise = $http({
			        	      		method:'GET',
			        	      		url:'/to_confirm_forward',
			        	      		headers: {'Content-Type': 'application/json'},
			        	      		params:	 {id:x}
			        	      }).success(function (response) {
			        	      		//console.log(response.data);
			        	        	return response;
			        	      }).error(function(error){
			        	      		alert("Error: "+ error);
			        	      });
			        	      return promise;
			          },
			          confirmed_offers: function(x) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/confirmed_offers',
				      		headers: {'Content-Type': 'application/json'},
				      		params:	 {id:x}
				      }).success(function (response) {
				      		//console.log(response);
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    confirmed_offers_all: function(x) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/confirmed_offers_all',
				      		headers: {'Content-Type': 'application/json'},
				      		params:	 {id:x}
				      }).success(function (response) {
				      		//console.log(response);
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    confirmed_offers_paid: function() {
				      var promise = $http({
				      		method:'GET',
				      		url:'/confirmed_offers_paid',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				      		//console.log(response);
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    confirmed_forward_bo: function() {
				      var promise = $http({
				      		method:'GET',
				      		url:'/confirmed_forward_bo',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				      		//console.log('confirmed_forward_bo ',response.data);
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    confirmed_forward_all: function() {
				      var promise = $http({
				      		method:'GET',
				      		url:'/confirmed_forward_all',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    confirmed_forward_paid: function() {
				      var promise = $http({
				      		method:'GET',
				      		url:'/confirmed_forward_paid',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    confirmed_swap_all: function() {
				      var promise = $http({
				      		method:'GET',
				      		url:'/confirmed_swap_all',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    confirmed_swap_paid: function() {
				      var promise = $http({
				      		method:'GET',
				      		url:'/confirmed_swap_paid',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    confirmed_mm_all: function() {
				      var promise = $http({
				      		method:'GET',
				      		url:'/confirmed_mm_all',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    confirmed_mm_paid: function() {
				      var promise = $http({
				      		method:'GET',
				      		url:'/confirmed_mm_paid',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    confirmed_spot_all: function() {
				      var promise = $http({
				      		method:'GET',
				      		url:'/confirmed_spot_all',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    confirmed_spot_paid: function() {
				      var promise = $http({
				      		method:'GET',
				      		url:'/confirmed_spot_paid',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    confirmed_swap_offers: function(x) {
				      var promise = $http({
				      		method:'post',
				      		url:'/confirmed_swap_offers',
				      		headers: {'Content-Type': 'application/json'},
				      		params:	 {id:x}
				      }).success(function (response) {
				      		console.log(response);
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    confirmed_swap_offers: function() {
				      var promise = $http({
				      		method:'get',
				      		url:'/confirmed_swap_offers',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    confirmed_mm_offers: function(x) {
				      var promise = $http({
				      		method:'get',
				      		url:'/confirmed_mm_offer',
				      		headers: {'Content-Type': 'application/json'},
				      		params:	 {id:x}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    getbanks: function() {
				      var promise = $http({
				      		method:'GET',
				      		url:'/banks',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				      			//console.log(response);
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: "+error);
				      		});
				      return promise;
				    },
				    getmybanks: function(custid) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/mybanks/'+custid,
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: "+error);
				      		});
				      return promise;
				    },
				    getcurrency: function() {
				      var promise = $http({
				      		method:'GET',
				      		url:'/currencies',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: " + error);
				      		});
				      return promise;
				    },
				    swaporder: function(indexid) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/get_swap_order/' + indexid,
				      		headers: {'Content-Type': 'application/json'}
				      		//params:{id:indexid}
				      }).success(function (response) {
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: "+error);
				      		});
				      return promise;
				    },
				    forwardorder: function(indexid) {
				      var promise = $http({
				      		method:'GET',
				      		url:'./get_forward_order/'+indexid,
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				        		return response;
				      		}).error(function(error){
				      			console.log(error);
				      		});
				      return promise;
				    },
				    mmorder: function(indexid) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/get_mm_order/'+indexid,
				      		headers: {'Content-Type': 'application/json'}
				      		//params:{id:indexid}
				      }).success(function (response) {
				      			//console.log(response);
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: "+error);
				      		});
				      return promise;
				    },
				    get_a_currency: function(ccy) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/get_a_currency/'+ ccy,
				      		headers: {'Content-Type': 'application/json'}
				      		//params:{ccy:x}
				      }).success(function (response) {
				      			//console.log(response);
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: "+error);
				      		});
				      return promise;
				    },
				    updateordermm: function(orderindex) {
				      var promise = $http({
				      		method:'post',
				      		url:'/updateordermm',
				      		headers: {'Content-Type': 'application/json'},
				      		data:{orderindex:orderindex}
				      }).success(function (response) {
				      			//console.log(response);
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: "+error);
				      		});
				      return promise;
				    },
				    updateordermmreverse: function(orderindex) {
				      var promise = $http({
				      		method:'post',
				      		url:'/updateordermmreverse',
				      		headers: {'Content-Type': 'application/json'},
				      		data:{orderindex:orderindex}
				      }).success(function (response) {
				      			//console.log(response);
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: "+error);
				      		});
				      return promise;
				    },
				    updateorderreverse: function(orderindex) {
				      var promise = $http({
				      		method:'post',
				      		url:'/updateorderreverse',
				      		headers: {'Content-Type': 'application/json'},
				      		data:{orderindex:orderindex}
				      }).success(function (response) {
				      			//console.log(response);
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: "+error);
				      		});
				      return promise;
				    },
				    updateorderswapreverse: function(orderindex) {
				      var promise = $http({
				      		method:'post',
				      		url:'/updateorderswapreverse',
				      		headers: {'Content-Type': 'application/json'},
				      		data:{orderindex:orderindex}
				      }).success(function (response) {
				      			//console.log(response);
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: "+error);
				      		});
				      return promise;
				    },
				    updateorderforwardreverse: function(orderindex) {
				      var promise = $http({
				      		method:'post',
				      		url:'/updateorderforwardreverse',
				      		headers: {'Content-Type': 'application/json'},
				      		data:{orderindex:orderindex}
				      }).success(function (response) {
				      			//console.log(response);
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: "+error);
				      		});
				      return promise;
				    },
				    updateorderswap: function(orderindex) {
				      var promise = $http({
				      		method:'post',
				      		url:'/updateorderswap',
				      		headers: {'Content-Type': 'application/json'},
				      		data:{orderindex:orderindex}
				      }).success(function (response) {
				      			//console.log(response);
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: "+error);
				      		});
				      return promise;
				    },
				    offer_s_mm: function(orderid) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/get_s_mm_offer',
				      		headers: {'Content-Type': 'application/json'},
				      		params:{orderid:orderid}
				      }).success(function (response) {
				      		console.log(response);
				        	return response;
				      }).error(function(error){
				      		console.log("Error: "+error);
				      });
				      return promise;
				    },
				    payments_forward: function() {
				      var promise = $http({
				      		method:'GET',
				      		url:'/confirmed_forward_bo',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		console.log("Error: "+error);
				      });
				      return promise;
				    },
				    payments_forward_all: function() {
				      var promise = $http({
				      		method:'GET',
				      		url:'/confirmed_forward_bo_all',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		console.log("Error: "+error);
				      });
				      return promise;
				    },
				    payments_forward_paid: function() {
				      var promise = $http({
				      		method:'GET',
				      		url:'/confirmed_forward_bo_paid',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		console.log("Error: "+error);
				      });
				      return promise;
				    },
				    offerdetails_mm: function(x) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/get_mm_offer',
				      		headers: {'Content-Type': 'application/json'},
				      		params:{id:x}
				      }).success(function (response) {
				      			//console.log(response);
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: "+error);
				      		});
				      return promise;
				    },
				    accept_mm_offer: function(offerid) {
				      var promise = $http({
				      		method:'post',
				      		url:'/accept_mm_offer',
				      		headers: {'Content-Type': 'application/json'},
				      		data:{offerid:offerid}
				      }).success(function (response) {
				      			//console.log(response);
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: "+error);
				      		});
				      return promise;
				    },
				    accept_mm_offer2: function(orderid) {
				      var promise = $http({
				      		method:'post',
				      		url:'/accept_mm_offer2',
				      		headers: {'Content-Type': 'application/json'},
				      		data:{orderid:orderid}
				      }).success(function (response) {
				      			//console.log(response);
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: "+error);
				      		});
				      return promise;
				    },
				    accept_swap_offer: function(orderid) {
				      var promise = $http({
				      		method:'post',
				      		url:'/accept_swap_offer',
				      		headers: {'Content-Type': 'application/json'},
				      		data:{orderid:orderid}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		console.log("Error: "+error);
				      });
				      return promise;
				    },
				    accept_swap_offer2: function(offerid) {
				      var promise = $http({
				      		method:'post',
				      		url:'/accept_swap_offer2',
				      		headers: {'Content-Type': 'application/json'},
				      		data:{offerid:offerid}
				      }).success(function (response) {
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: "+error);
				      		});
				      return promise;
				    },
				    accepted_mm_offers: function(domain) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/accepted_mm_offers',
				      		headers: {'Content-Type': 'application/json'},
				      		params:	 {offeredby:domain}
				      }).success(function (response) {
				      		//console.log(response);
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    to_confirm_offers_mm: function(x) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/to_confirm_offers_mm',
				      		headers: {'Content-Type': 'application/json'},
				      		params:	 {id:x}
				      }).success(function (response) {
				      		//console.log(response);
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    payments_mm_confirm: function(x) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/payments_mm_confirm',
				      		headers: {'Content-Type': 'application/json'},
				      		params:	 {id:x}
				      }).success(function (response) {
				      		//console.log(response);
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    payments_mm_confirm_paid: function(x) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/payments_mm_confirm_paid',
				      		headers: {'Content-Type': 'application/json'},
				      		params:	 {id:x}
				      }).success(function (response) {
				      		//console.log(response);
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    payments_mm_confirm_all: function(x) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/payments_mm_confirm_all',
				      		headers: {'Content-Type': 'application/json'}
				      }).success(function (response) {
				      		//console.log(response);
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    payments_swap_confirm: function(x) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/payments_swap_confirm',
				      		headers: {'Content-Type': 'application/json'},
				      		params:	 {id:x}
				      }).success(function (response) {
				      		//console.log(response);
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    payments_swap_confirm_all: function(x) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/payments_swap_confirm_all',
				      		headers: {'Content-Type': 'application/json'},
				      		params:	 {id:x}
				      }).success(function (response) {
				      		//console.log(response);
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    payments_swap_confirm_paid: function(x) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/payments_swap_confirm_paid',
				      		headers: {'Content-Type': 'application/json'},
				      		params:	 {id:x}
				      }).success(function (response) {
				      		//console.log(response);
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    offer_s_swap: function(x) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/get_s_swap_offer',
				      		headers: {'Content-Type': 'application/json'},
				      		params:{id:x}
				      }).success(function (response) {
				      			//console.log(response);
				        		return response;
				      }).error(function(error){
				      			console.log("Error: "+error);
				      });
				      return promise;
				    },
				    offer_s_swap_bank: function(offerid) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/get_s_swap_offer_bank',
				      		headers: {'Content-Type': 'application/json'},
				      		params:{offerid:offerid}
				      }).success(function (response) {
				      			//console.log(response);
				        		return response;
				      }).error(function(error){
				      			console.log("Error: "+error);
				      });
				      return promise;
				    },
				    offerdetails_swap: function(offerid) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/get_swap_offer',
				      		headers: {'Content-Type': 'application/json'},
				      		params:{offerid:offerid}
				      }).success(function (response) {
				      			//console.log(response);
				        		return response;
				      		}).error(function(error){
				      			console.log("Error: "+error);
				      		});
				      return promise;
				    },
				    to_confirm_offers_swap: function(x) {
				      var promise = $http({
				      		method:'GET',
				      		url:'/to_confirm_offers_swap',
				      		headers: {'Content-Type': 'application/json'}
				      		//params:	 {id:x}
				      }).success(function (response) {
				      		//console.log(response);
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    payment_forward: function(offerid) {
				      var promise = $http({
				      		method:'post',
				      		url:'/payment_forward',
				      		headers: {'Content-Type': 'application/json'},
				      		data:	 {offerid:offerid}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    payment_swap: function(offerid) {
				      var promise = $http({
				      		method:'post',
				      		url:'/payment_swap',
				      		headers: {'Content-Type': 'application/json'},
				      		data:	 {offerid:offerid}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    payment_mm: function(offerid) {
				      var promise = $http({
				      		method:'post',
				      		url:'/payment_mm',
				      		headers: {'Content-Type': 'application/json'},
				      		data:	 {offerid:offerid}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    },
				    payment_spot: function(offerid) {
				      var promise = $http({
				      		method:'post',
				      		url:'/payment_spot',
				      		headers: {'Content-Type': 'application/json'},
				      		data:	 {offerid:offerid}
				      }).success(function (response) {
				        	return response;
				      }).error(function(error){
				      		alert("Error: "+ error);
				      });
				      return promise;
				    }
	};
	
	return myService;
	
});

app.service('Data', function () {

    var data = {
        pagetitle: 'Test'
    };

    return {
        getTitle: function () {
            return data.pagetitle;
        },
        setTitle: function (pagetitle) {
            data.pagetitle = pagetitle;
        }
    };
});

app.service('titleService', function () {
     var Title = {
        name: ''
    };
    return Title;
});

app.service('tempData', function () {
     var newforward = {};
    return newforward;
});


