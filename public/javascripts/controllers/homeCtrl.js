dbevent.controller('homeCtrl',function homeCtrl($scope, $rootScope, topLevel, socket, $http, $q){
    $scope.message = "Hello there! I am Main Page..";

    $scope.allUserEvents = [];
    //$rootScope.userData = {};

    if($rootScope.userData == undefined || $rootScope.allEvents == undefined || $rootScope.friends == undefined){
        topLevel.reloadAllDataAtOnce()
            .then(function(data){

            },function(err){
                console.log(err);
            })
    }



    $http.post('/getnoti',"")
        .success(function(data){
            if(data!="false"){
                $rootScope.totalNotification = data.length;
                for(var i=0;i<data.length;i++){
                    $.CrystalNotificationPanel({
                        title: data[i].title,
                        image: "",
                        panelbutton: true,
                        content: data[i].text
                    })
                }
            }
            else{

            }
        })
        .error(function(err){
            console.log("ERROR");
        })



    $("#noti").on("click", function () {
        ShowCrystalNotificationPanel();
    });

    socket.on('getnoti',function(data){
        console.log(data);
        $.CrystalNotification({
            title: data.title,
            image: "",
            content: data.text,
            panelbutton: true,
            timeout: 3500
        },function (b) {
            console.log("You just got a live noti");

        });
        if(data.title="Friend Request Accepted"){
            topLevel.reloadAllDataAtOnce()
                .then(function(res){
                    console.log("data reloaded");
                },function(err){
                    console.log(err);
                })
        }
        window.stop();
    })
    socket.on('redirect',function(data){

        window.location.href = data.url;
        topLevel.reloadAllDataAtOnce()
            .then(function(rep){
                console.log("all data reloaded");
            },function(err){
                console.log(err);
            })
    })

    $rootScope.rab = function(){
        console.log("inside RAB");
    }


})