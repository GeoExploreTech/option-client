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
        },
        methods: {
          buttonClick(name) {
            alert(`${name} clicked`);
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
            const urlWs = `wss://ws.geoviso.com/ws/candles/${assetSym}/60/1`;
            // Create WebSocket connection
            const socket = new WebSocket(urlWs);

            console.log(socket);

            // alert(`Start Stream clicked`);
            // const candleDataObservable = createWebSocketObservable(
            //   symAsset,
            //   60,
            //   1
            // );
            // console.log(candleDataObservable());

            // this.subscription = candleDataObservable.subscribe({
            //   next: (data) => {
            //     console.log("Received candle data:", data);
            //   },
            //   error: (error) => {
            //     console.error("WebSocket error:", error);
            //   },
            //   complete: () => {
            //     console.log("WebSocket stream completed.");
            //   },
            // });
          },
          stopStreaming() {
            this.subscription.unsubscribe();
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
