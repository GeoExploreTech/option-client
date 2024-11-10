// Initialize the Vue app after HTML and CSS are loaded
function initVueApp() {
  inJectCSS("OPTION_BOT_CSS");
  // Load external HTML content and initialize app
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://raw.githubusercontent.com/GeoExploreTech/option-client/refs/heads/test-branch/html/index.html", // Replace with your actual HTML file URL
    onload: function (response) {
      // Inject the fetched HTML content into the page
      const appDiv = document.createElement("div");
      appDiv.id = "option-bot-app";
      appDiv.innerHTML = response.responseText;
      document.body.appendChild(appDiv);

      // Initialize Vue after HTML is loaded
      new Vue({
        el: "#option-bot-app",
        data: {
          currentSym: "Current Asset",
        },
        methods: {
          buttonClick(name) {
            alert(`${name} clicked`);
          },
          getCurrentAssest() {
            // Get the text content of the target element and assign it to currentSym
            const element = document.querySelector(
              ".current-symbol.current-symbol_cropped"
            );
            if (element) {
              this.currentSym = element.textContent; // Assign text content directly to currentSym
            } else {
              console.warn("Element not found");
            }
          },
        },
        mounted() {
          getCurrentAssest();
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
