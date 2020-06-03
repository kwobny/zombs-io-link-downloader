const httpProxy = require("http-proxy").createServer({
  ws: true,
  changeOrigin: true
});
const express = require("express");
const app = express();
const http = require("http");
const httpServer = http.createServer(app);
const url = require("url");

app.use(express.static("public"));

/*app.use("/websocket", function (req, res, next) {
  res.locals.path = "whatever url/ip address";
  
});*/

app.use("/", function(req, res, next) {
  console.log("index requested");

  httpProxy.web(req, res, {target:"http://zombs.io"});

  /*res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end();*/
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

httpServer.listen(8080);

/*httpProxy.on("proxyReq", function(proxyReq, req, res, options) {
  if (res.locals.path) {
    proxyReq.path = res.locals.path;
  }
});*/