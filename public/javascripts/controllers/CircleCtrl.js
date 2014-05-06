dbevent.controller('CircleCtrl',function CircleCtrl($scope,friendsData, topLevel, socket,$rootScope){
    $scope.message = "This is your circle zone";

    $scope.sortOrder="userName";

    if($rootScope.friends == undefined || $rootScope.otherUsers == undefined){
        topLevel.reloadAllDataAtOnce()
            .then(function(data){

            },function(err){
                console.log(err);
            })
    }

    $scope.addNewFriend = function(data){
        console.log(data);
        var obj = {"userId":$rootScope.userData.userId,"userName":$rootScope.userData.userName,"friendId":data};
        socket.emit('addNewFriend',obj);
    }

   /* socket.on('getnoti',function(data){
        console.log(data);
        $.CrystalNotification({
            title: data.title,
            image: "",
            content: data.text,
            panelbutton: true,
            timeout: 3500
        });


    })*/

})