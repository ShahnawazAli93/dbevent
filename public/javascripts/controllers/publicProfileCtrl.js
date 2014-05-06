dbevent.controller('publicProfileCtrl',function DashboardCtrl($scope,$modal, $log, $rootScope, $routeParams, topLevel){
    $scope.message = "I have the development branch";
/*    $scope.Events = [];

    $scope.pFriendsLength = 0;*/
    $scope.pUser = {};
    $scope.pUserId = $routeParams.pUId;
    console.log($scope.pUserId);

    for(var i=0;i<$rootScope.friends.length;i++){
        if($rootScope.friends[i].userId == $scope.pUserId){
            $scope.pUser = $rootScope.friends[i];
        }
    }
    for(var i=0;i<$rootScope.otherUsers.length;i++){
        if($rootScope.otherUsers[i].userId == $scope.pUserId){
            $scope.pUser = $rootScope.otherUsers[i];
        }
    }
    console.log($scope.pUser);
    /*
    if($rootScope.userData == undefined){

        topLevel.reloadAllDataAtOnce()
            .then(function(data){
               /* for(var i=0;i<$rootScope.allEvents.length;i++){
                    if($rootScope.allEvents[i].userId == $rootScope.userData.userId){
                        $scope.myEvents.push($rootScope.allEvents[i]);
                    }
                }
                $scope.myEventsLength = $scope.myEvents.length;
                console.log($scope.myEventsLength);
                $scope.pFriendsLength = $rootScope.friends.length;

                /*$(function() {
                    $(".E-dial").knob();
                    $(".E-dial")
                        .val($scope.myEventsLength)
                        .trigger('change');

                    $(".F-dial").knob();
                    $(".F-dial")
                        .val($scope.pFriendsLength)
                        .trigger('change');

                    $(".L-dial").knob()
                        .val($scope.pFriendsLength)
                        .trigger('change');
                });

            },function(err){
                console.log(err);
            })
    }
    else
    {
        /*for(var i=0;i<$rootScope.allEvents.length;i++){
            if($rootScope.allEvents[i].userId == $rootScope.userData.userId){
                $scope.myEvents.push($rootScope.allEvents[i]);
            }
        }
        $scope.myEventsLength = $scope.myEvents.length;
        console.log($scope.myEventsLength);
        $scope.pFriendsLength = $rootScope.friends.length;
    }
*/

});