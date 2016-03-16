/**
 * Created by ngohungphuc on 3/15/2016.
 */
var mongo=require("mongodb").MongoClient,
    client=require("socket.io").listen(8080).sockets;
mongo.connect("mongodb://127.0.0.1/chat",function(err,db){
    if(err) throw err;
    client.on("connection",function(socket){
        var col=db.collection("messages"),
            sendStatus=function(s){
                socket.emit('status',s);
            };
        col.find().limit(100).sort({_id:1}).toArray(function(err,res){
            if(err) throw err;
            socket.emit('output',res);
        });
        socket.on("message",function(data){
            var name=data.name,
                message=data.message;
            col.insert({name:name,message:message},function(){
                client.emit('output',[data]);
                sendStatus({
                    message:"Message send",
                    clear:true
                });
                console.log("insert");
            });
        });
    });
});