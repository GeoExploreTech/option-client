function runBrainJS() {
  if (typeof brain === "undefined") {
    console.log("brain.js is not loaded yet, retrying...");
    setTimeout(runBrainJS, 1000);
    return;
  }
  console.log("Brain.js loaded successfully");
}

function formatSymbol(input) {
  return input
    .replace("/", "") // Remove the slash
    .replace(" ", "_") // Replace space with underscore
    .replace("OTC", "otc"); // Convert "OTC" to lowercase "otc"
}
