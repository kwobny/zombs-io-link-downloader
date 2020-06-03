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

httpServer.on("upgrade", function(req, socket, head) {
  var serverUrl = url.parse(req.url, true).query.url;
  console.log(serverUrl);
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