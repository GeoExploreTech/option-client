const { fromEvent, Observable } = rxjs;
const { map } = rxjs.operators;

// Define the WebSocket URL
const wsUrl = "wss://ws.geoviso.com/ws/candles/NZDUSD_otc/60/1";

// Function to create an observable for WebSocket messages
function createWebSocketObservable(url) {
  return new Observable((observer) => {
    // Create WebSocket connection
    const socket = new WebSocket(url);

    // Emit messages to the observer
    const messageListener = (event) => {
      try {
        const data = getCandleDataPerSecond(event.data);
        observer.next(data); // Pass parsed data to the observer
      } catch (error) {
        observer.error(error); // Emit error if parsing fails
      }
    };

    // Handle WebSocket open event
    const openListener = () => {
      console.log("WebSocket connection opened.");
    };

    // Handle WebSocket close event
    const closeListener = () => {
      console.log("WebSocket connection closed.");
      observer.complete(); // Complete the observable if WebSocket closes
    };

    // Handle WebSocket errors
    const errorListener = (error) => {
      observer.error(error);
    };

    // Add WebSocket event listeners
    socket.addEventListener("open", openListener);
    socket.addEventListener("message", messageListener);
    socket.addEventListener("close", closeListener);
    socket.addEventListener("error", errorListener);

    // Cleanup function to close the WebSocket and remove listeners when unsubscribed
    return () => {
      socket.removeEventListener("open", openListener);
      socket.removeEventListener("message", messageListener);
      socket.removeEventListener("close", closeListener);
      socket.removeEventListener("error", errorListener);
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  });
}

// Function to parse incoming data
function getCandleDataPerSecond(res) {
  const data = JSON.parse(res); // Parse incoming data
  return data;
}
