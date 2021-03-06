dbevent.controller('DashboardCtrl',function DashboardCtrl($scope,$modal, $log, $rootScope, topLevel){
    $scope.message = "I have the development branch";
    $scope.myEvents = [];

    $scope.myFriendsLength = 0;

    if($rootScope.userData == undefined){

        topLevel.reloadAllDataAtOnce()
            .then(function(data){
                for(var i=0;i<$rootScope.allEvents.length;i++){
                    if($rootScope.allEvents[i].userId == $rootScope.userData.userId){
                        $scope.myEvents.push($rootScope.allEvents[i]);
                    }
                }
                $scope.myEventsLength = $scope.myEvents.length;
                console.log($scope.myEventsLength);
                $scope.myFriendsLength = $rootScope.friends.length;

                $(function() {
                    $(".E-dial").knob();
                    $(".E-dial")
                        .val($scope.myEventsLength)
                        .trigger('change');

                    $(".F-dial").knob();
                    $(".F-dial")
                        .val($scope.myFriendsLength)
                        .trigger('change');

                    $(".L-dial").knob()
                        .val($scope.myFriendsLength)
                        .trigger('change');
                });

            },function(err){
                console.log(err);
            })
    }
    else
    {
        for(var i=0;i<$rootScope.allEvents.length;i++){
            if($rootScope.allEvents[i].userId == $rootScope.userData.userId){
                $scope.myEvents.push($rootScope.allEvents[i]);
            }
        }
        $scope.myEventsLength = $scope.myEvents.length;
        console.log($scope.myEventsLength);
        $scope.myFriendsLength = $rootScope.friends.length;
    }

    $(function() {
        $(".E-dial").knob();
        $(".E-dial")
            .val($scope.myEventsLength)
            .trigger('change');

        $(".F-dial").knob();
        $(".F-dial")
            .val($scope.myFriendsLength)
            .trigger('change');

        $(".L-dial").knob()
            .val($scope.myFriendsLength)
            .trigger('change');
    });

});