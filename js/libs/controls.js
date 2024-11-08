// Load HTML structure into the document
function loadHTML(url, callback) {
  GM.xmlHttpRequest({
    method: "GET",
    url: url,
    onload: (response) => {
      const container = document.createElement("div");
      container.innerHTML = response.responseText;
      document.body.appendChild(container);
      callback();
    },
  });
}

// Load CSS file
function loadCSS(url) {
  GM.xmlHttpRequest({
    method: "GET",
    url: url,
    onload: (response) => {
      GM_addStyle(response.responseText);
    },
  });
}

// Helper function to load Vue component files
async function loadComponent(url) {
  return new Promise((resolve) => {
    GM.xmlHttpRequest({
      method: "GET",
      url,
      onload: (response) => {
        const componentModule = new Function(
          "exports",
          "require",
          response.responseText
        );
        const exports = {};
        componentModule(exports);
        resolve(exports.default);
      },
    });
  });
}

// Function to add drag functionality to the #draggable-container
function makeDraggable(element) {
  let offsetX = 0,
    offsetY = 0,
    mouseX = 0,
    mouseY = 0;

  element.onmousedown = (e) => {
    e.preventDefault();
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.onmousemove = dragMouseMove;
    document.onmouseup = stopDragging;
  };

  function dragMouseMove(e) {
    e.preventDefault();
    offsetX = mouseX - e.clientX;
    offsetY = mouseY - e.clientY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    element.style.top = element.offsetTop - offsetY + "px";
    element.style.left = element.offsetLeft - offsetX + "px";
  }

  function stopDragging() {
    document.onmousemove = null;
    document.onmouseup = null;
  }
}
