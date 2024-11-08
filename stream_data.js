// Define the WebSocket URL
const wsUrl = "wss://ws.geoviso.com/ws/candles/NZDUSD_otc/60/1";

function getCandleDataPerSecond(res) {
  const data = JSON.parse(res); // Parse incoming data
  return data;
}

function streamHook() {
  // Create WebSocket connection
  const socket = new WebSocket(wsUrl);

  // Event listener for connection open
  socket.addEventListener("open", () => {
    console.log("WebSocket connection opened.");
  });

  // Event listener for incoming messages
  socket.addEventListener("message", (event) => {
    try {
      getCandleDataPerSecond(event.data);
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  });

  // Event listener for connection close
  socket.addEventListener("close", () => {
    console.log("WebSocket connection closed.");
  });

  // Event listener for errors
  socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });
}
