// Define the WebSocket URL
const wsUrl = "wss://ws.geoviso.com/ws/candles/NZDUSD_otc/60/1";

// Wait until brain.js is loaded
function runBrainJS() {
  if (typeof brain === "undefined") {
    console.log("brain.js is not loaded yet, retrying...");
    setTimeout(runBrainJS, 1000);
    return;
  }
  console.log("brain.js loaded successfully");

  // Create WebSocket connection
  const socket = new WebSocket(wsUrl);

  // Event listener for connection open
  socket.addEventListener("open", () => {
    console.log("WebSocket connection opened.");
  });

  // Event listener for incoming messages
  socket.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data); // Parse incoming data
      console.log("Received data:", data);
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

// Start the brain.js and WebSocket setup
runBrainJS();
