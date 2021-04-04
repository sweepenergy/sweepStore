var Websocket = require("ws");
// AUTH INFO
auth_user_id = "" /// user key from api_keys
auth_token = "" // token from api_keys

endpoint = "wss://rt.sweepapi.com"

const wss = new Websocket(endpoint+"/?auth_user="+auth_user_id+"&auth_key="+auth_token);

wss.on("connection", ws => {
    console.log("New user connected!");

    ws.on("close", () => {
        console.log("Connection closed!")
    })
});

wss.onclose = function(event) {
    if (event.wasClean) {
      console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } 
    else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      console.log('[close] Connection died');
    }
};
  
wss.onerror = function(error) {
    console.log(`[error] ${error.message}`);
};