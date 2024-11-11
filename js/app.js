// Initialize the Vue app after HTML and CSS are loaded
function initVueApp() {
  const { fromEvent, Observable } = rxjs;
  const { map } = rxjs.operators;
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
          subscription: "",
          socketHandle: "",
          isStreaming: false,
        },
        methods: {
          buttonClick(name) {
            alert(`${name} clicked`);
          },
          // Emit messages to the observer
          messageListener(event) {
            try {
              const data = this.getCandleDataPerSecond(event.data);
              console.log(data);

              return data;
            } catch (error) {
              console.log(error);
            }
          },
          openListener() {
            console.log("WebSocket connection opened.");
          },
          closeListener() {
            console.log("WebSocket connection closed.");
          },
          errorListener(error) {
            console.error(error);
          },
          getCandleDataPerSecond(res) {
            const data = JSON.parse(res); // Parse incoming data
            return data;
          },
          formatSymbol(input) {
            return input
              .replace("/", "") // Remove the slash
              .replace(" ", "_") // Replace space with underscore
              .replace("OTC", "otc"); // Convert "OTC" to lowercase "otc"
          },
          startStreaming() {
            const symAsset = this.formatSymbol(this.currentSym);
            console.log("Here Now", symAsset);
            const urlWs = `wss://ws.geoviso.com/ws/candles/${symAsset}/60/1`;
            console.log(brain);

            // Create WebSocket connection
            this.socketHandle = new WebSocket(urlWs);

            // Add WebSocket event listeners
            this.socketHandle.addEventListener("open", this.openListener);
            this.socketHandle.addEventListener("message", this.messageListener);
            this.socketHandle.addEventListener("close", this.closeListener);
            this.socketHandle.addEventListener("error", this.errorListener);
            this.isStreaming = true;
          },
          stopStreaming() {
            this.socketHandle.removeEventListener("open", this.openListener);
            this.socketHandle.removeEventListener(
              "message",
              this.messageListener
            );
            this.socketHandle.removeEventListener("close", this.closeListener);
            this.socketHandle.removeEventListener("error", this.errorListener);
            if (this.socketHandle.readyState === WebSocket.OPEN) {
              this.socketHandle.close();
            }
            this.isStreaming = false;
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
          setInterval(() => {
            this.getCurrentAssest();
          }, 1000);
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
