function runBrainJS() {
  if (typeof brain === "undefined") {
    console.log("brain.js is not loaded yet, retrying...");
    setTimeout(runBrainJS, 1000);
    return;
  }
  console.log("Brain.js loaded successfully");
}
