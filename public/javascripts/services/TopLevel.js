dbevent.factory('topLevel',function($rootScope, eventData, userData, friendsData, $q, socket, $http){
    var deffered = $q.defer();
    return {
        reloadAllDataAtOnce : function(){
        var deffred = $q.defer();

        userData.getUserData()
            .then(function(rep){
                var data = rep[0];
                $rootScope.userData = {};
                $rootScope.userData["userName"] = data.userName;
                $rootScope.userData["fName"] = data.fName;
                $rootScope.userData["lName"] = data.lName;
                $rootScope.userData["fullName"] = data.fName+ " "+data.lName;
                $rootScope.userData["gender"] = data.gender;
                $rootScope.userData["email"] = data.email;
                $rootScope.userData["userId"] = data.userId;
                $rootScope.userData["mobileNumber"] = data.mobileNumber;
                $rootScope.userData["fbProfile"] = data.fbProfile;
                $rootScope.userData["DOB"] = data.DOB;
                $rootScope.userData["imgUrl"] = data.imgUrl;

                socket.emit("login",$rootScope.userData.userId);

                eventData.getAllUserEvents()
                    .then(function(data){
                        console.log("reply from backend:",data);
                        $rootScope.allEvents = data;
                        console.log("all Events length: ",$rootScope.allEvents.length);


                        friendsData.getFriendList()
                            .then(function(data){

                                $rootScope.otherUsers = {};
                                $rootScope.friends = {};

                                console.log("data received from backend: "+data);
                                $rootScope.friends = data;

                                friendsData.getOtherUsers($rootScope.friends)
                                    .then(function(data2){
                                        console.log("others friends received: ",data2);
                                        $rootScope.otherUsers = data2;
                                        deffred.resolve("all data fetched");
                                    },function(err){
                                        console.log("error",err);
                                    })
                            },function(data){
                                console.log("error: "+data);
                            })


                    },function(err){
                        console.log(err);
                        deffred.reject(err);
                    })
            },function(err){
                console.log("Error occured while fetching user data: ",err);
                deffred.reject(err);
            });
        return deffred.promise;
    }
    }
})