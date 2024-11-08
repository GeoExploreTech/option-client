function runClient() {
  runBrainJS();
  // Load HTML, CSS, and initialize the Vue app
  loadHTML(
    "https://raw.githubusercontent.com/GeoExploreTech/option-client/refs/heads/master/html/index.html",
    () => {
      loadCSS(
        "https://raw.githubusercontent.com/GeoExploreTech/option-client/refs/heads/master/css/main.css"
      );
      initVueApp();
    }
  );
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
