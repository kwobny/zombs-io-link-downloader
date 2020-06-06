/*'use strict';

module.exports = function() {
  throw new Error(
    'ws does not work in the browser. Browser clients must use the native ' +
      'WebSocket object'
  );
};
*/

'use strict';

const WebSocket = require('./lib/websocket');

WebSocket.createWebSocketStream = require('./lib/stream');
WebSocket.Server = require('./lib/websocket-server');
WebSocket.Receiver = require('./lib/receiver');
WebSocket.Sender = require('./lib/sender');

module.exports = WebSocket;
