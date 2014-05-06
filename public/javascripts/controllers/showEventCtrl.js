dbevent.controller('showEventCtrl',function showEventCtrl($scope, $rootScope, $routeParams, eventData, socket, topLevel){

    $scope.comments = [];
    $scope.commentBody = "";

    $scope.getComments = function(event){
        console.log("Sending: "+event);
        eventData.getComments(event)
            .then(function(data){
                console.log(data);
                for(var i=0;i<data.length;i++){
                    $scope.comments.push(data[i]);
                }
            },function(err){
                console.log("Error from backend: "+err);
            })
    }

    if($rootScope.allEvents == undefined){
        topLevel.reloadAllDataAtOnce()
            .then(function(rep){
                for(var i=0;i<$rootScope.allEvents.length;i++){
                    if($rootScope.allEvents[i].eventId==$routeParams.eventId)
                        $scope.eventToShow = $rootScope.allEvents[i];
                }

                $scope.getComments({"eventId":$scope.eventToShow.eventId});
            },function(err){
                console.log(err);
            })
    }
    else{
        for(var i=0;i<$rootScope.allEvents.length;i++){
            if($rootScope.allEvents[i].eventId==$routeParams.eventId)
                $scope.eventToShow = $rootScope.allEvents[i];
        }

        $scope.getComments({"eventId":$scope.eventToShow.eventId});
    }

    $scope.postComment = function(body){
        if(body!=""){
            var toPost = $rootScope.userData;
            toPost["commentBody"] = body;
            toPost["eventId"] = $scope.eventToShow.eventId;
            toPost["eventName"] = $scope.eventToShow.name;
            $scope.commentBody = "";
            socket.emit('postComment',toPost);
        }
    }

    socket.on('getComment',function(data){
        if(data.eventId==$scope.eventToShow.eventId){
        $scope.comments.push(data);
        console.log("Comments array: ",$scope.comments);
        }

    })

    $scope.dummyFriends = ["amin","hasham","hamza","hira","alveena","farrukh"];

})