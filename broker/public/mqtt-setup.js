
var client = mqtt.connect(); // you add a ws:// url here

/*** client on connect ***/
client.on("connect", function () {
    console.log("cleint is connected");
})

/*** client on reconnect ***/
client.on("reconnect", function () {
    console.log("cleint is reconnected");
})

/*** client on error ***/
client.on("error", function (err) {
    console.log("error from client --> ", err);
})

/*** client on close ***/
client.on("close", function () {
    console.log("cleint is closed");
})

/*** client on offline ***/
client.on("offline", function (err) {
    console.log("client is offline");
});

client.subscribe("mqtt/demo");
client.subscribe("position");

client.on("message", function (topic, payload) {
    // alert([topic, payload].join(": "));
    console.log(payload.toString());
    // client.end();
});

