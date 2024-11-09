// Initialize the Vue app after HTML and CSS are loaded
function initVueApp() {
  inJectCSS("OPTION_BOT_CSS");
  // Load external HTML content and initialize app
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://raw.githubusercontent.com/GeoExploreTech/option-client/refs/heads/test-branch/html/index.html", // Replace with your actual HTML file URL
    onload: function (response) {
      // Inject the fetched HTML content into the page
      // const appDiv = document.createElement("div");
      // Inject the main div container
      const appDiv = GM_addElement(document.body, "div", {
        id: "option-bot-app",
      });
      // appDiv.id = "option-bot-app";
      appDiv.innerHTML = response.responseText;
      document.body.appendChild(appDiv);

      // Initialize Vue after HTML is loaded
      new Vue({
        el: "#option-bot-app",
        methods: {
          buttonClick(name) {
            alert(`${name} clicked`);
          },
        },
      });

      // Draggable functionality
      let isDragging = false;
      let offsetX, offsetY;

      const header = document.getElementById("option-bot-header");
      const app = document.getElementById("option-bot-app");

      header.addEventListener("mousedown", function (e) {
        isDragging = true;
        offsetX = e.clientX - app.getBoundingClientRect().left;
        offsetY = e.clientY - app.getBoundingClientRect().top;
      });

      document.addEventListener("mousemove", function (e) {
        if (isDragging) {
          app.style.left = `${e.clientX - offsetX}px`;
          app.style.top = `${e.clientY - offsetY}px`;
        }
      });

      document.addEventListener("mouseup", function () {
        isDragging = false;
      });
    },
  });
}
