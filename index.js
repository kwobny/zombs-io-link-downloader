const httpProxy = require("http-proxy").createServer({
  ws: true,
  changeOrigin: true
});
const express = require("express");
const app = express();
const http = require("http");
const httpServer = http.createServer(app);
const url = require("url");
const fs = require("fs");

const serverDomain = "https://zombs-middleman-server--yeongjinkwon.repl.co";
const listenPort = process.env.PORT || 8080;

var lastGetsUrl = "logs/lastGets.txt"
var urlsReadAppend = fs.openSync("logs/urls.txt", "a+");
var mainLogAppend = fs.openSync("logs/mainLog.txt", "a");

var serverActiveTestInterval = 5000;
var lastServerActiveUrl = "logs/lastServerActive.txt";

app.get("/", function(req, res, next) {
  logToConsole("Index requested");
  var date = new Date();
  writeLines(lastGetsUrl, [4, 5], [date.getTime(), date.toLocaleString('en-US', { timeZone: 'America/New_York' })]);

  http.get("http://zombs.io/", function(resp) {
    var data = "";
    resp.on("data", function(chunk) {
      data += chunk;
    });

    resp.on("end", function() {
      res.writeHead(200, {"Content-Type":"text/html"});
      
      var lowIndex = 0;
      var highIndex = 0;

      //first replacement
      highIndex = data.indexOf('href="/asset/app.css', lowIndex)
      highIndex = data.indexOf('"', highIndex) + 1

      res.write(data.substring(lowIndex, highIndex))
      res.write("asset/app1ff2.css")

      lowIndex = data.indexOf('"', highIndex)

      //actual second addition (aims to prevent tab freeze)
      highIndex = data.indexOf("<body>", lowIndex);
      highIndex = data.indexOf(">", highIndex) + 1;

      res.write(data.substring(lowIndex, highIndex));
      res.write('<script src="myOwnCode.js"></script>');

      lowIndex = highIndex;

      //second replacement
      highIndex = data.indexOf('<script src="/asset/app.js', lowIndex)
      highIndex = data.indexOf('"', highIndex) + 1

      res.write(data.substring(lowIndex, highIndex))
      res.write("asset/app2d60.js")

      lowIndex = data.indexOf('"', highIndex)

      //third replacement (not really replacement, but add)
      highIndex = data.indexOf('Sentry.init({', lowIndex)
      highIndex = data.indexOf("'https://zombs.io'", highIndex) + 1
      highIndex = data.indexOf("'", highIndex) + 1

      res.write(data.substring(lowIndex, highIndex))
      res.write(", '" + serverDomain + "'")

      lowIndex = highIndex;

      //save rest of string
      res.write(data.substring(lowIndex))

      res.end();
    });
  });

  //httpProxy.web(req, res, {target:"http://zombs.io"});
});

//ping the pinger to keep it awake
app.get("/ping", function(req, res, next) {
  res.writeHead(200);
  res.write("successful ping");
  res.end();

  logToConsole("Ping");
  var date = new Date();
  writeLines(lastGetsUrl, [8, 9], [date.getTime(), date.toLocaleString('en-US', { timeZone: 'America/New_York' })]);
});

/*app.use("/websocket", function (req, res, next) {
  console.log("web");
  var serverUrl = url.parse(req.url, true).query.url;
  var options = {
    target: serverUrl
  }
  httpProxy.web(req, res, options);
});*/

app.use(express.static("public"));

app.use("/", function(req, res, next) {
  //var path = url.parse(req.url, true).pathname
  //if (fs.existsSync("public"+path)) {
  //  console.log(req.url);
  //}
  //fs.appendFile("urls.txt", req.url + "\n", function() {});
  logToConsole("Unknown resource: " + req.url);

  var data = fs.readFileSync(urlsReadAppend);

  if (data.indexOf(req.url) !== -1) {
    fs.appendFileSync(urlsReadAppend, req.url + "\n");
  }

  next();
});

/*app.use("/asset/app2d60.js", function(req, res, next) {
  res.write
});*/

httpServer.on("upgrade", function(req, socket, head) {
  var serverUrl = url.parse(req.url, true).query.url;
  var options = {
    target: serverUrl
  }
  httpProxy.ws(req, socket, head, options);
});

httpServer.listen(listenPort);

/*httpProxy.on("proxyReq", function(proxyReq, req, res, options) {
  if (res.locals.path) {
    proxyReq.path = res.locals.path;
  }
});*/

/*function exitHandler() {
  console.log("exiting...");
  process.exit();
}

process.on("exit", exitHandler.bind(null, ));
process.on("SIGINT", exitHandler);
process.on("SIGUSR1", exitHandler);
process.on("SIGUSR2", exitHandler);
process.on("uncaughtException", exitHandler);*/

/*
Possibilities for why the websocket connection shuts down:

1. Proxy server remains up and active, but explicitely shuts down the websocket connection after inactivity or certain timeout period
  a. due to repl it
  b. due to node js

2. Proxy server just shuts down
  a. Maybe pingers don't work
  b. The only pingers that are active are the repl it mat1 pinger and the pinger from the actual client html itself.

3. Something wrong with client
  a. Test this by trying to make a long term game with the actual zombs io site and the proxy site, and see if the websocket connection ends when using both sites, or just one.

4. Or maybe the websocket connection remains active in actuality, but something goes wrong
*/

/*
6 Types of Events:
1. Index requested
2. Ping
3. Unknown resource
4. Server started
5. Socket open
6. Socket close
*/

function logToConsole(message, dateObj) {
  if (!dateObj) {
    dateObj = new Date();
  }

  var output = dateObj.toLocaleTimeString('en-US', { timeZone: 'America/New_York' }) + ": " + message;

  console.log(output);

  return output;
}

function writeLines(fileName, lines, data, separator) {
  //line parameter is 0 indexed.
  //if a file descriptor is given as fileName, then data needs to be an array with the original text first then the actual data.
  if (typeof fileName === "number") {
    return;
  }

  if (typeof data === "string") {
    data = [data];
  }
  if (typeof lines === "number" || typeof lines === "bigint") {
    lines = [lines];
  }
  if (!separator) {
    separator = "\n";
  }

  var fileContent = fs.readFileSync(fileName);
  var strArray = fileContent.toString().split(separator);

  for (let i = 0; i < data.length; i++) {
    strArray[lines[i]] = data[i];
  }

  fs.writeFileSync(fileName, strArray.join(separator));
}
function readLines(fileName, lines, separator) {
  //line parameter is 0 indexed.
  if (typeof fileName === "number") {
    return;
  }
  if (!separator) {
    separator = "\n";
  }

  var fileContent = fs.readFileSync(fileName);

  var strArray = fileContent.toString().split(separator);

  if (typeof lines === "number" || typeof lines === "bigint") {
    return strArray[lines];
  }
  else {
    let returnArr = [];
    for (l of lines) {
      returnArr.push(strArray[l]);
    }
    return returnArr;
  }
}

//log when server started
(function() {
  var date = new Date();
  var currentTime = date.getTime();
  var linesRead = readLines(lastGetsUrl, [4, 5, 8, 9]);
  var linesRead2 = readLines(lastServerActiveUrl, [0, 1]);

  var logString = "\n" + date.toLocaleString('en-US', { timeZone: 'America/New_York' }) + ": Server started:\n"

  logString += "\tLast time server was active on was: ";
  logString += linesRead2[0];
  logString += "\n\tWhich was ";
  logString += (currentTime - linesRead2[1])/1000;
  logString += " seconds ago\n";

  logString += "\tLast index request was on: ";
  logString += linesRead[1];
  logString += "\n\tWhich was ";
  logString += (currentTime - linesRead[0])/1000 + " seconds ago\n";

  logString += "\tLast ping was on: ";
  logString += linesRead[3];
  logString += "\n\tWhich was ";
  logString += (currentTime - linesRead[2])/1000 + " seconds ago\n";

  fs.appendFileSync(mainLogAppend, logString);
})();

//log when socket connection opens
var lastMessage = 0.0;

httpProxy.on("open", function(proxySocket) {
  logToConsole("Socket open");
  var date = new Date();
  fs.appendFileSync(mainLogAppend, (date.toLocaleString('en-US', { timeZone: 'America/New_York' }) + ": Socket open\n"));

  proxySocket.on("data", function() {
    lastMessage = (new Date()).getTime();
  });
});

//and closes
httpProxy.on("close", function(res, socket, head) {
  logToConsole("Socket close");
  var date = new Date();
  var writeString = date.toLocaleString('en-US', { timeZone: 'America/New_York' }) + ": Socket closed\n"
  writeString += "\tTime since last data sent: ";
  writeString += (date.getTime() - lastMessage)/1000;
  writeString += " seconds\n";

  fs.appendFileSync(mainLogAppend, writeString);
});

setInterval(function() {
  var date = new Date();
  var writeString = date.toLocaleString('en-US', { timeZone: 'America/New_York' });
  writeString += "\n";
  writeString += date.getTime();

  fs.writeFileSync(lastServerActiveUrl, writeString);
}, serverActiveTestInterval);