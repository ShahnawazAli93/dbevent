var express = require('express');
var routes = require('./routes');
var search = require('./routes/search');
var http = require('http');
var path = require('path');
var bcrypt = require('bcryptjs');
var s3Credential  = require('s3Credential');

//Custom module for mysql
var db = require('db');
// Custom module for checkAuth
var checkAuth = require('checkAuth');
var app = express();
var server = http.createServer(app);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.bodyParser());
app.use(express.multipart());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Login Page handler
app.get('/', routes.index);

// Main app page handler
app.get('/home', checkAuth,routes.app);

// Login data handler
app.post('/login',routes.login);

// signup data handler
app.post('/signup',routes.signup);

//logout button handler
app.get('/logout',function (req, res) {

    var id = req.session.user_id;
    delete clients[id];
    console.log("after log out: ",clients);
    delete req.session.user_id;
    res.redirect('/');
});

app.post('/saveEvent',routes.saveEvent);

app.get('/getInvitedEvents',routes.getInvitedEvents);

app.get('/getAllUserEvents',routes.getAllUserEvents);

app.get('/getFriendList',routes.getFriendList);

app.post('/getOtherUsers',routes.getOtherUsers);

app.post('/postComment',routes.postComment);

app.post('/getComments',routes.getComments);

app.post('/getUserData',routes.getUserData);

app.post('/uploadPicture',checkAuth, s3Credential.uploadPic);

app.get('/:username/Activate',routes.activator);

app.post('/changeBasicInfo',routes.changeBasicInfo);

app.post('/changePassword',routes.changePassword);

app.post('/getnoti',routes.getnoti);

app.get('/search', search.service);

app.get('/afr/:id',function(req,res){
     var senderId  = req.param('id');
    console.log("senderId is ",senderId);

    var query = "UPDATE friends SET areFriends='true' WHERE userId='"+senderId+"' AND friendId='"+req.session.user_id+"' AND areFriends='false'";

    console.log(query);
    db.querydb(query)
        .then( function(res)   { console.log(res);
            if(res.affectedRows == 1){

                var query = "DELETE FROM notifications WHERE senderId='"+senderId+"' AND receiverId='"+req.session.user_id+"'";

                console.log(query);
                db.querydb(query)
                    .then( function(res)   { console.log(res); },
                    function(error) { console.log(error)});
                io.sockets.socket(clients[req.session.user_id]).emit('redirect',{url:"#/user/"+senderId});
                io.sockets.socket(clients[senderId]).emit('getnoti',{title:"Friend Request Accepted",text:"Awesome! "+req.session.userName+" Accepted Your Friend Request"});

            }
            else{
                console.log("redirect without query");
                io.sockets.socket(clients[req.session.user_id]).emit('redirect',{url:"#/user/"+senderId});
            }
        },
        function(error) { console.log(error)});


});

app.get('/acceptfriend/:friendId',function(req,res){
    var friendId = req.params.friendId;
    var query = "UPDATE friends SET areFriends = 'true'  WHERE userId = '"+ friendId  + "' AND friendId = '"+ req.session.user_id +"'";
    console.log(query);
    db.querydb(query)
        .then( function(data)   { console.log("accepted");
            var query2 = "DELETE FROM notifications WHERE (senderId = '"+ friendId  + "' AND receiverId = '"+ req.session.user_id +"')";
            console.log(query2);
            db.querydb(query2)
                .then( function(data2)   { console.log("deleted");
                    res.render('app');
                },
                function(error) { console.log(error)});

        },
        function(error) { console.log(error)});


});

//app.get('/:username/Activate',routes.activator);
//db query module example
db.querydb("SELECT userId FROM users WHERE userName='amin'")
    .then( function(res)   { console.log("db Connected"); },
    function(error) { console.log(error)});





server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/*---------------------- Socket.io coding area ----------------------*/

var io = require('socket.io').listen(server);
var clients ={};
io.sockets.on('connection',function(socket){

    console.log('user on socket with id', socket.id);

    

    socket.on('login',function(userId){
        clients[userId] = socket.id;
        console.log(clients);
        //clients.push({'socketId' : socket.id, 'userId': userId});
    });

    socket.on('postComment', function(body){
        console.log("message form browser",body);
        var d = new Date();
        var userId = body.userId,
            userName = body.userName,
            eventId = body.eventId,
            commentBody = body.commentBody,
            eventName = body.eventName,
            userImgUrl = body.imgUrl,
            date = d.getFullYear()+"-"+d.getMonth()+"-"+ d.getDate(),
            time = d.getHours()+":"+ d.getMinutes()+":"+ d.getSeconds();

        // to return
        var comment = [{
            "body":body.commentBody,
            "fullName":body.fullName,
            "eventId":body.eventId,
            "title":eventName,
            "imgUrl":userImgUrl
        }];

        var query = "INSERT INTO comments (userId, eventId, body, date, time) VALUES ('"
            + userId        +"','"
            + eventId       +"','"
            + commentBody   +"','"
            + date          +"','"
            + time          +"')";
        console.log(query);

        db.querydb(query)
            .then(
            function(data){
                    console.log("I was here");
                var text = userName+" commented on "+eventName;
                var query2 = "INSERT INTO notifications (senderId, nType, date, time,text,title,eventId) VALUES ('"
                    + userId        +"','"
                    + 1       +"','"
                    + date          +"','"
                    + time           +"','"
                    + text      +"','"
                    + eventId          +"')";
                console.log(query2);
                db.querydb(query2)
                    .then(
                    function(data2){
                        //console.log(data);
                        //io.sockets.emit('getComment',comment[0]);
                        var query3 = "SELECT userId FROM eventsInvitation WHERE eventId='"+eventId+"'";
                        db.querydb(query3)
                            .then(
                            function(data3)   {
                                console.log(data3);
                                for(var i=0;i<data3.length;i++){
                                    if(clients[data3[i].userId])
                                    {
                                        console.log("emiited");
                                        comment[0].text = text;
                                        console.log(comment[0]);
                                        io.sockets.socket(clients[data3[i].userId]).emit('getComment',comment[0]);
                                        if(data3[i].userId != userId){
                                            io.sockets.socket(clients[data3[i].userId]).emit('getnoti',comment[0]);
                                        }

                                    }
                                }
                                //io.sockets.emit('getComment',comment[0]);
                            },

                            function(error) {
                                console.log("eventsInvitation",error);
                                io.sockets.emit('getComment',"false");
                            });
                    },

                    function(error){
                        console.log("notifications",error);
                        io.sockets.emit('getComment',"false");
                    });
                //console.log(data);
                //io.sockets.emit('getComment',comment[0]);
            },

            function(error){
                console.log("comments",error);
                io.sockets.emit('getComment',"false");
            });
    });

    socket.on('addNewFriend',function(body){
        console.log("add new user Socket");
        var d = new Date();
        var date = d.getFullYear()+"-"+d.getMonth()+"-"+ d.getDate(),
            time = d.getHours()+":"+ d.getMinutes()+":"+ d.getSeconds();

        var query = "INSERT INTO friends (userId, friendId, areFriends) VALUES ('"
            + body.userId    +"','"
            + body.friendId   +"','false')";
        console.log(body);
        db.querydb(query)
            .then(
            function(data){
                console.log(data);
                var text = 'Yay! '+body.userName+' wants to add you in his Circle <a type="button" class="btn btn-primary btn-xs" href="/afr/'+body.userId+'">Accept</a>';

                console.log(text);

                var query2 = "INSERT INTO notifications (senderId, nType, date, time,text,title, receiverId) VALUES ('"
                    + body.userId        +"','"
                    + 2       +"','"
                    + date          +"','"
                    + time           +"','"
                    + text      +"','"
                    + "Friend Request"      +"','"
                    + body.friendId          +"')";
                db.querydb(query2)
                    .then(function(data){
                        var toSend = [{
                            "text":text,
                            "title":"Friend Request"
                        }];
                        io.sockets.socket(clients[body.friendId]).emit('getnoti',toSend[0]);
                    },function(err){
                        console.log("error");
                    })
            },
            function(error){
                console.log(error);

            });
    });

});




