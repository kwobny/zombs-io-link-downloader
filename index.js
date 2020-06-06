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

app.get("/", function(req, res, next) {
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
  console.log("ping");
  res.writeHead(200);
  res.write("successful ping");
  res.end();
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
  console.log("Unknown resource: " + req.url);

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