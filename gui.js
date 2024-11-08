let currentAsset = "NO ASSET";
// Function to get the content of the target element
function getCurrentSymbol() {
  const symbolElement = document.querySelector(
    ".current-symbol.current-symbol_cropped"
  );
  return symbolElement
    ? symbolElement.textContent.trim()
    : "NO SYMBOL SELECTED";
}

function loadGUI() {
  // Create the main dashboard container
  const dashboard = document.createElement("div");
  dashboard.id = "trading-dashboard";

  // Add HTML content for the dropdown, buttons, and table
  dashboard.innerHTML = `
    <div class="dashboard-header">
    <h3> Current Asset </h3> 
    </div>
   <div class="asset-select">
      ${currentAsset} 
    </div>
    <div class="dashboard-buttons">
        <button id="get-asset">Get Asset</button>
        <button id="download-data">Download Data</button>
        <button id="start-trading">Start Trading</button>
    </div>
`;

  // Append dashboard to the document body
  document.body.appendChild(dashboard);

  // Dashboard styling
  const style = document.createElement("style");
  style.innerHTML = `
    #trading-dashboard {
        position: fixed;
        top: 20px;
        left: 20px;
        width: 200px;
        padding: 10px;
        background: #f0f0f0;
        border: 2px solid #333;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        z-index: 9999;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }
    #trading-dashboard .dashboard-header {
        margin-bottom: 10px;
    }
    #trading-dashboard select {
        width: 100%;
        padding: 5px;
        margin-bottom: 5px;
    }
    #trading-dashboard .dashboard-buttons button {
        display: block;
        width: 100%;
        padding: 5px;
        margin-bottom: 5px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
    }
    #trading-dashboard .dashboard-buttons button:hover {
        background-color: #45a049;
    }
    #trading-dashboard .dashboard-table {
        margin-top: 10px;
    }
    #trading-dashboard table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9em;
    }
    #trading-dashboard table, #trading-dashboard th, #trading-dashboard td {
        border: 1px solid #ddd;
        text-align: center;
        padding: 8px;
    }
    #trading-dashboard th {
        background-color: #4CAF50;
        color: #4CAF50;
    }
    .asset-select{
      color: white;
    }
`;
  document.head.appendChild(style);

  // Draggable functionality
  dashboard.onmousedown = function (event) {
    event.preventDefault();
    let shiftX = event.clientX - dashboard.getBoundingClientRect().left;
    let shiftY = event.clientY - dashboard.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      dashboard.style.left = pageX - shiftX + "px";
      dashboard.style.top = pageY - shiftY + "px";
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    document.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      dashboard.onmouseup = null;
    };
  };

  dashboard.ondragstart = function () {
    return false;
  };

  // Button functionality
  document.getElementById("get-asset").addEventListener("click", function () {
    currentAsset = getCurrentSymbol();
  });

  document
    .getElementById("download-data")
    .addEventListener("click", function () {
      alert("Downloading data...");
    });

  document
    .getElementById("start-trading")
    .addEventListener("click", function () {
      alert("Starting trading...");
    });
}
