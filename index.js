'use strict';
var Alexa = require('alexa-sdk');
var firebase = require('firebase');

var app_id = process.env.app_id;
var apiKey = process.env.api_key;
var password = process.env.password;
var email = process.env.email;

var config = {
    apiKey: apiKey,
    authDomain: app_id + ".firebaseapp.com",
    databaseURL: "https://" + app_id + ".firebaseio.com",
    storageBucket: app_id + ".appspot.com",
    projectId: app_id
};

var getTemp = function(event) {
  if(firebase.apps.length == 0) {   // <---Important!!! In lambda, it will cause double initialization.
      firebase.initializeApp(config);
  }  

  firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
    if (user) {
      // User is signed in.
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var dbref=firebase.database();
      var temp = 0;
      var hum = 0;
      var hour = 0;
      var minute = 0; 
      var pi = {
        "temperature": temp,
        "humidity": hum
      };

      var starCountRef =  dbref.ref('/').child('pi');
          starCountRef.orderByKey().limitToLast(1).once('value', function(snapshot) {
          snapshot.forEach(function(data) {            
              pi = data.val();
              temp = pi.temperature;
              hum = pi.humidity;
              var date = new Date(pi.date);
              hour = date.getHours();
              minute = date.getMinutes();
          });
        return event.emit(':tell', 'The local temperature is ' + temp + " centigrade. The local humidity is "+ hum + "%. Taken at " + hour + " "+ minute);
    });
    } else {
      // User is signed out.
      // ...
      return event.emit(':tell', 'Error getting data.');
    }    
  });
}

exports.handler = (event, context, callback) => {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('MyIntent');
    },
    
    'MyIntent': function () {
        getTemp(this);
    }
};

