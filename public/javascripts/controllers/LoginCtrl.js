function LoginCtrl($scope, $http, $rootScope){
    $scope.newUser = {};
    $scope.newUser["gender"] = "M";
    $scope.user= {};
    $rootScope.totalNotification = 0;
    $scope.showLoader = false;
    $scope.login = function(user){
        // han hmne lagaya tha
        $scope.showLoader = true;
        if(user.user && user.password){
            $scope.showLoader = true;
            $http.post('/login',user)
                .success(function(data){
                    $('#loginButton').popover('destroy');

                    if(data == "pass error"){
                        $scope.showLoader = false;

                        console.log("pass error");
                        $('#loginButton').popover({content :'<span class="glyphicon glyphicon-warning-sign"></span> username and password error' });
                        $('#loginButton').popover('show');
                        setTimeout(function(){$('#loginButton').popover('destroy');},3000);
                    }

                    else if(data == "active error"){
                        $scope.showLoader = false;

                        console.log("active error");
                        $('#loginButton').popover({content :'<span class="glyphicon glyphicon-warning-sign"></span> Please Activate your account from your email' });
                        $('#loginButton').popover('show');
                        setTimeout(function(){$('#loginButton').popover('destroy');},3000);
                    }
                    else{
                        $scope.showLoader = false
                        $('#loginButton').popover('hide');
                        window.location.href = data;
                    }

                })
                .error(function(err){
                    console.log("ERROR");
                })
        }
    }
    $scope.showNotiPanel = function(){
        ShowCrystalNotificationPanel()
    }
    $scope.message = "Sign-in into dbevent";

    $scope.signUp = function(newUser, signupForm){

        newUser.DOB = newUser.bYear+"-"+newUser.bMonth+"-"+newUser.bDay;
        console.log(newUser);
        console.log(signupForm.$valid);
        if (signupForm.$valid){
            if(newUser.pass == newUser.rePass){

                $('#signup').removeClass('btn-primary').addClass('active btn-warning');
                console.log("Password Matched");
                $http.post('/signup',newUser)
                    .success(function(data){
                        console.log("login was here");
                        console.log("from server",data);
                        if(data == "error1"){
                            console.log("error1");
                            $('#signup').removeClass('active btn-warning').addClass('btn-primary');
                            $('#signup').popover({content :'<span class="glyphicon glyphicon-warning-sign"></span> Username already exist' });
                            $('#signup').popover('show');
                            setTimeout(function(){$('#signup').popover('destroy');},5000);
                        }

                        else if(data == "error2"){
                            console.log("error2");
                            $('#signup').removeClass('active btn-warning').addClass('btn-primary');
                            $('#signup').popover({content :'<span class="glyphicon glyphicon-warning-sign"></span> Email already exist' });
                            $('#signup').popover('show');
                            setTimeout(function(){$('#signup').popover('destroy');},5000);
                        }

                        else if(data == "error3"){
                            console.log("error2");
                            $('#signup').removeClass('active btn-warning').addClass('btn-primary');
                            $('#signup').popover({content :'<span class="glyphicon glyphicon-warning-sign"></span> Error in signup' });
                            $('#signup').popover('show');
                            setTimeout(function(){$('#signup').popover('destroy');},5000);
                        }

                        else{
                            $('#signup').removeClass('active btn-warning').addClass('btn-success');
                            $('#signup').popover({content :'<span class="glyphicon glyphicon-warning-sign"></span> Sign up successful. An email has been sent to you for activation' });
                            $('#signup').popover('show');
                            console.log("done");
                            setTimeout(function(){
                                $('#signup').popover('destroy');
                                window.location.href = data;

                            },3000);

                        }
                    })
                    .error(function(err){
                        console.log("ERROR");
                    })
            }
            else{
                console.log("password mismatch");
                $('#signup').popover({content :'<span class="glyphicon glyphicon-warning-sign"></span> Password mismatch' });
                $('#signup').popover('show');
            }
        }
    }
    //check password

};