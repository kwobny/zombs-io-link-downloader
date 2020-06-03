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

      //second replacement
      highIndex = data.indexOf('<script src="/asset/app.js', lowIndex)
      highIndex = data.indexOf('"', highIndex) + 1

      res.write(data.substring(lowIndex, highIndex))
      res.write("asset/app2d60.js")

      lowIndex = data.indexOf('"', highIndex)

      //save rest of string
      res.write(data.substring(lowIndex))

      res.end();
    });
  });

  //httpProxy.web(req, res, {target:"http://zombs.io"});
});

app.use(express.static("public"));

app.use("/", function(req, res, next) {
  /*var path = url.parse(req.url, true).pathname
  if (fs.existsSync("public"+path)) {
    console.log(req.url);
  }*/
  fs.appendFile("urls.txt", req.url + "\n", function() {});

  next();
});

/*app.use("/websocket", function (req, res, next) {
  res.locals.path = "whatever url/ip address";
  
});*/

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