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

  // Initialize the neural network
  const net = new brain.NeuralNetwork();
  net.train([
    { input: { r: 0, g: 0, b: 0 }, output: { dark: 1 } },
    { input: { r: 1, g: 1, b: 1 }, output: { light: 1 } },
  ]);

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

      // Check if data has the expected format
      if (
        data.r !== undefined &&
        data.g !== undefined &&
        data.b !== undefined
      ) {
        // Use brain.js to make a prediction
        const output = net.run({ r: data.r, g: data.g, b: data.b });
        console.log("Prediction output:", output);

        // Display the output on the page
        displayOutput(output);
      } else {
        console.error("Unexpected data format:", data);
      }
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

// Function to display the output on the page
function displayOutput(output) {
  let resultDiv = document.getElementById("brainjs-output");
  if (!resultDiv) {
    resultDiv = document.createElement("div");
    resultDiv.id = "brainjs-output";
    resultDiv.style.position = "fixed";
    resultDiv.style.top = "10px";
    resultDiv.style.right = "10px";
    resultDiv.style.backgroundColor = "#fff";
    resultDiv.style.padding = "10px";
    resultDiv.style.border = "1px solid #333";
    document.body.appendChild(resultDiv);
  }
  resultDiv.innerHTML = `<strong>Brain.js Prediction:</strong> ${JSON.stringify(
    output
  )}`;
}

// Start the brain.js and WebSocket setup
runBrainJS();
