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
          candlesData: [],
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
          getHistoricCandleData() {
            const symAsset = this.formatSymbol(this.currentSym);
            const apiUrl = `https://ws.geoviso.com/candles/${symAsset}/60/20`;
            // Make the GET request using GM_xmlhttpRequest
            GM_xmlhttpRequest({
              method: "GET",
              url: apiUrl,
              onload: async (response) => {
                if (response.status === 200) {
                  // Parse the JSON response
                  const data = JSON.parse(response.responseText);
                  console.log("HERE  = ", data);

                  this.candlesData = data.map((res) => {
                    const { open, high, low, close } = res;
                    const body = Math.abs(close - open);
                    const upperTail = high - Math.max(open, close);
                    const lowerTail = Math.min(open, close) - low;

                    return {
                      open,
                      high,
                      low,
                      close,
                      body, // Head (body)
                      upperTail, // Top wick (upper tail)
                      lowerTail, // Bottom wick (lower tail)
                    };
                  });
                  console.log(this.candlesData);
                } else {
                  console.error(
                    `Request failed with status ${response.status}`
                  );
                }
              },
              onerror: function (error) {
                console.error("Request failed", error);
              },
            });
          },
          normalizeData(data) {
            return new Promise((resolve) => {
              const normalized = data.map((d) => ({
                open: d.open / 10,
                high: d.high / 10,
                low: d.low / 10,
                close: d.close / 10,
                body: d.body / 10,
                upperTail: d.upperTail / 10,
                lowerTail: d.lowerTail / 10,
              }));
              resolve(normalized);
            });
          },
          // Prepare training data
          prepareTrainingData(normalizedData) {
            return new Promise((resolve) => {
              const trainingData = normalizedData
                .map((d, i) => {
                  const nextCandle = normalizedData[i + 1];
                  if (!nextCandle) return null;

                  // Determine the direction for the training output
                  const direction = nextCandle.close > d.close ? 1 : 0;
                  return {
                    input: [
                      d.open,
                      d.high,
                      d.low,
                      d.close,
                      d.body,
                      d.upperTail,
                      d.lowerTail,
                    ],
                    output: [direction],
                  };
                })
                .filter(Boolean); // Filter out any `null` values

              resolve(trainingData);
            });
          },

          netModelRun(trainingData) {
            console.log("RUNNING MODEL !!!");

            return new Promise((resolve) => {
              const net = new brain.recurrent.LSTMTimeStep({
                hiddenLayers: [7],
              });

              // Train the network
              net.train(trainingData, {
                iterations: 10000,
                learningRate: 0.01,
                errorThresh: 0.005,
                log: (error) => console.log(error),
                logPeriod: 500,
              });

              resolve(net);
            });
          },

          async trainNetWork() {
            const norData = await this.normalizeData(this.candlesData);
            console.log("DATA GOT2 =", norData);

            const trainingData = await this.prepareTrainingData(norData);
            console.log("DATA GOT3 =", trainingData);

            const net = await this.netModelRun(trainingData);

            console.log("Prediction = ", net.run(trainingData[17].input));
            console.log("Actual = ", trainingData[17].output);
          },

          startStreaming() {
            const symAsset = this.formatSymbol(this.currentSym);

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
