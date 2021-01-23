'use strict';
/* Copyright (C) 2019 Aliter business solutions Pvt Ltd to Present 
 * All Rights Reserved.
 *
 * You should have received a copy of the GNU license with
 * this file. If not, please write to : vijay@alitersolutions.com, 
 * or visit : https://alitersolutions.com

 /**
  * Load Models
  */
var mosca = require('mosca');
var ip 	  = require('ip');
var mqtt = require('mqtt');
const fs = require('fs')
//var redis 			= require('redis');

var settings = {
  port: 9910,
  http: {
    port: 9911,
    bundle: true,
    static: './public'
}
};
var server = new mosca.Server(settings);
var client = mqtt.connect('mqtt://' + ip.address() + ':9910');
client.on('connect', function () {
  console.log("Connected ...........");
  console.log("Topic Ready");
  client.subscribe('csvdata')
  client.subscribe('position')
})

client.on('message', function (topic, message) {
  var now = new Date();
  now.setMinutes(now.getMinutes() + 330); // timestamp
  now = new Date(now);
  var d = now.toJSON().split("T");
  var date = d[0];
  var time = d[1].replace("Z", "").substring(0, 8);

  var msg = message.toString();
  console.log("topic Recived.....", topic)
  console.log(now.toJSON() + " Message Recived.....", msg)
  if (topic == "position") {

    try {
      ///:machine
      var lat = 0;
      var lng = 0;
      // var loc = JSON.parse(msg);

      // var lat = loc['lat'];
      // var lng = loc['long'];
      // var id = loc['id'];
      var msgLines = msg.split("\n");
      for (let index = 0; index < msgLines.length; index++) {
        const element = msgLines[index];
        if(element.startsWith("Lat")){
          lat = Number(element.split("N")[1]);
        }

        if(element.startsWith("Lon")){
          lng = Number((element.split("E")[1]).split("Speed")[0]);
        }
        
      }

     
      var columnName = "Date,Time,Latitude,Longitude\n"
      var dataToWrite = date + "," + time + "," + lat +"," + lng+"\n";
      console.log(dataToWrite);
      var path = `public/coordinates.csv`

      if (fs.existsSync(path)) {
        if (fs.existsSync(path)) {
          console.log("true")
          let result = fs.readFileSync(path, 'utf-8')
          if (result.length > 0) {
            dataToWrite = result + dataToWrite;
            fs.unlinkSync(path)
          }
        }
        fs.appendFile(path, dataToWrite, function (err) {
          if (err) {
            console.log(" Error Please close Excel")
            fs.writeFile(path, dataToWrite, function (err) {
              if (err) {
                console.log('Error while Writing CSV', err);
              }
              console.log(' Write Saved!');
            });
          } else {
            console.log('Append Saved!');
          }
        });
      } else {
        fs.writeFile(path, columnName + dataToWrite, function (err) {
          console.log(' Write Saved!');
        });
      }
      console.log("Responce........");
    } catch (error) {
    
    }
  }

})

//let RedisClient = redis.createClient({
//	port      	: 5151,               // replace with your port
	//host      : '120.0.0.1',        // replace with your hostanme or IP address
	//password  : 'your password',    // replace with your password
	// optional, if using SSL
	// use `fs.readFile[Sync]` or another method to bring these values in
	// tls       : {
	//   key  : stringValueOfKeyFile,  
	//   cert : stringValueOfCertFile,
	//   ca   : [ stringValueOfCaCertFile ]
	// }
 // });
 // RedisClient.on('connect', function() {
    server.on('ready', function(){
        console.log("(---------------------------------------------------------------)");
        console.log(" |                    Evolve Broker Ready.....                  |");
        console.log(" |                  mqtt://"+ip.address()+":9910                  |");
        console.log("(---------------------------------------------------------------)");
    });

    // setInterval(function(){ 
    //     RedisClient.hgetall('demo', function(err, object) {
    //         console.log(object);
    //     });
       
    //  }, 1000);


 // });

