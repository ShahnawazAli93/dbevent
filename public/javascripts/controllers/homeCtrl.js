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

        var DropCount = 1;

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
        });
    })

    $(".testmeout").click(function(){console.log("hello buddy");});
})