var express = require('express');
var crypto = require("crypto");
var https = require('https');
var qs = require('querystring');
var dateFormat = require('dateformat');
var nodedump = require('nodedump').dump;
var app = express();

var host = 'www.lingkapis.com';
var apikey = '[workspaceAPIKey]';
var secret = '[workspaceSecret]';
var tenantKey = '[tenantKey]';
var workspaceKey = '[workspaceKey]';
var objectName = '[objectName]';

// all objects are named [tenantKey].[workspaceKey].[objectName]
// event data associated with those objects will be published to subscribed Recipes
// Verb is not used for routing in the current architecture

// List all objects for workspace
app.get('/', function (req, res) {
   var d = new Date();
   var requestPath = '/v1/@self/objecttypes/all';
   var requestMethod = "GET";
   var formattedDate = dateFormat(d,"GMT:ddd, dd mmm yyyy HH:MM:ss Z");
   var message = "date: "+ formattedDate + "\n(request-target): " + requestMethod.toLowerCase() + " " + requestPath;
   var hmacer = crypto.createHmac('sha1', secret);
   hmacer.write(message);
   hmacer.setEncoding('base64');
   hmacer.end();

   var sig = hmacer.read();

   // options for API request
   var options = {
        host: host,
        path: requestPath,
        method: requestMethod,
        headers: {
            'Date': formattedDate,
            'Authorization': 'Signature keyId="'+apikey+'",algorithm="hmac-sha1",headers="date (request-target)",signature="'+qs.escape(sig)+'"'
        }
   }


 // callback for API Call
   callback = function(response) {

    var body = ''
    response.on('data', function (chunk) {
        body += chunk;
    });

    response.on('end', function () {
        try {

                var parsed = JSON.parse(body);
                //capture dump
                var output = nodedump(parsed);

                // write response to the browser
                res.status(200).send('<html>'
                        + '<head>'
                            + '<title>Lingk API Example</title>'
                        + '</head>'
                        +'<body>'
                            +output
                        +'</body>'
                    +'</html>');

                                    
            } catch (err) {
                res.status(400).send('Unable to parse response as JSON', err.stack);
            }
        }).on('error', function(err) {
        // handle errors with the request itself
        res.status(400).send('Error with the request:', err.message);
        });
   }
   
   // API request
    var httpreq = https.request(options, callback);
    httpreq.end();

   console.log("date " + formattedDate);
   console.log("message " + message);
   console.log("secret " + secret);
   console.log("signature " + sig);

});

// List all subscriptions
// subscriptions are created in the UI when deploying a recipe
app.get('/subscriptions', function (req, res) {
   var d = new Date();
   var requestPath = '/v1/@self/webhooks/subscriptions';
   var requestMethod = "GET";
   var formattedDate = dateFormat(d,"GMT:ddd, dd mmm yyyy HH:MM:ss Z");
   var message = "date: "+ formattedDate + "\n(request-target): " + requestMethod.toLowerCase() + " " + requestPath;
   var hmacer = crypto.createHmac('sha1', secret);
   hmacer.write(message);
   hmacer.setEncoding('base64');
   hmacer.end();

   var sig = hmacer.read();

   // options for API request
   var options = {
        host: host,
        path: requestPath,
        method: requestMethod,
        headers: {
            'Date': formattedDate,
            'Authorization': 'Signature keyId="'+apikey+'",algorithm="hmac-sha1",headers="date (request-target)",signature="'+qs.escape(sig)+'"'
        }
   }


 // callback for API Call
   callback = function(response) {

    var body = ''
    response.on('data', function (chunk) {
        body += chunk;
    });

    response.on('end', function () {
        try {

                var parsed = JSON.parse(body);
                //capture dump
                var output = nodedump(parsed);

                // write response to the browser
                res.status(200).send('<html>'
                        + '<head>'
                            + '<title>Lingk API Example</title>'
                        + '</head>'
                        +'<body>'
                            +output
                        +'</body>'
                    +'</html>');

                                    
            } catch (err) {
                res.status(400).send('Unable to parse response as JSON', err.stack);
            }
        }).on('error', function(err) {
        // handle errors with the request itself
        res.status(400).send('Error with the request:', err.message);
        });
   }
   
   // API request
    var httpreq = https.request(options, callback);
    httpreq.end();

   console.log("date " + formattedDate);
   console.log("message " + message);
   console.log("secret " + secret);
   console.log("signature " + sig);

});

// Create an object (i.e. topic)
// Object name is hard coded in this example
app.post('/objects', function (req, res) {
   var d = new Date();
   var requestPath = '/v1/@self/objecttypes';
   var requestMethod = "POST";
   var formattedDate = dateFormat(d,"GMT:ddd, dd mmm yyyy HH:MM:ss Z");
   var message = "date: "+ formattedDate + "\n(request-target): " + requestMethod.toLowerCase() + " " + requestPath;
   var hmacer = crypto.createHmac('sha1', secret);
   hmacer.write(message);
   hmacer.setEncoding('base64');
   hmacer.end();

   var sig = hmacer.read();

   // options for API request
   var options = {
        host: host,
        path: requestPath,
        method: requestMethod,
        headers: {
            'Date': formattedDate,
            'Authorization': 'Signature keyId="'+apikey+'",algorithm="hmac-sha1",headers="date (request-target)",signature="'+qs.escape(sig)+'"'
        }
   }
   
 // callback for API Call
   callback = function(response) {

    var body = ''
    response.on('data', function (chunk) {
        body += chunk;
    });

    response.on('end', function () {
        try {

                var parsed = JSON.parse(body);

                // write response to the browser
                res.status(200).send(parsed);

                                    
            } catch (err) {
                res.status(400).send('Unable to parse response as JSON', err.stack);
            }
        }).on('error', function(err) {
        // handle errors with the request itself
        res.status(400).send('Error with the request:', err.message);
        });
   }

   // API request
    var httpreq = https.request(options, callback);
    httpreq.write('{"name": "mytenantkey.myworkspacekey.myeventobject","private":true}');
    httpreq.end();

   console.log("date " + formattedDate);
   console.log("message " + message);
   console.log("secret " + secret);
   console.log("signature " + sig);

});

// Create an event for the object with a payload
// The payloads can be used by the recipes are input data and parameters
// Object name and event payload is hard coded in this example
app.post('/events', function (req, res) {
   var d = new Date();
   var requestPath = '/v1/@self/events';
   var requestMethod = "POST";
   var formattedDate = dateFormat(d,"GMT:ddd, dd mmm yyyy HH:MM:ss Z");
   var message = "date: "+ formattedDate + "\n(request-target): " + requestMethod.toLowerCase() + " " + requestPath;
   var hmacer = crypto.createHmac('sha1', secret);
   hmacer.write(message);
   hmacer.setEncoding('base64');
   hmacer.end();

   var sig = hmacer.read();

   // options for API request
   var options = {
        host: host,
        path: requestPath,
        method: requestMethod,
        headers: {
            'Date': formattedDate,
            'Authorization': 'Signature keyId="'+apikey+'",algorithm="hmac-sha1",headers="date (request-target)",signature="'+qs.escape(sig)+'"'
        }
   }
   
 // callback for API Call
   callback = function(response) {

    var body = ''
    response.on('data', function (chunk) {
        body += chunk;
    });

    response.on('end', function () {
        try {

                var parsed = JSON.parse(body);

                // write response to the browser
                res.status(200).send(parsed);

                                    
            } catch (err) {
                res.status(400).send('Unable to parse response as JSON', err.stack);
            }
        }).on('error', function(err) {
        // handle errors with the request itself
        res.status(400).send('Error with the request:', err.message);
        });
   }

   // API request
    var httpreq = https.request(options, callback);
    httpreq.write('{ "verb": "create", "objectType": "mytenantkey.myworkspacekey.myeventobject",  "eventObject": {"key":"value", "foo":"bar"} }');
    httpreq.end();

   console.log("date " + formattedDate);
   console.log("message " + message);
   console.log("secret " + secret);
   console.log("signature " + sig);

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});