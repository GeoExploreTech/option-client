function runClient() {
  runBrainJS();
  loadGUI();
  // Create the WebSocket observable
  const candleDataObservable = createWebSocketObservable(wsUrl);

  // Subscribe to the observable to receive data
  const subscription = candleDataObservable.subscribe({
    next: (data) => {
      console.log("Received candle data:", data);
    },
    error: (error) => {
      console.error("WebSocket error:", error);
    },
    complete: () => {
      console.log("WebSocket stream completed.");
    },
  });

  // Example: Unsubscribe after a specific time if needed
  // setTimeout(() => subscription.unsubscribe(), 10000); // Unsubscribe after 10 seconds
}

// Start the client app and WebSocket setup
runClient();
