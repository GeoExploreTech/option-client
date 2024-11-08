// Initialize the Vue app after HTML and CSS are loaded
async function initVueApp() {
  // Load each component
  const ComponentA = await loadComponent(
    "https://example.com/path/to/ComponentA.js"
  );

  const App = {
    template: `
        <div>
          <component-a></component-a>
        </div>
      `,
    components: {
      "component-a": ComponentA,
    },
  };

  Vue.createApp(App).mount("#app"); // Mounting to the #app div in index.html

  // Make the container draggable
  const draggableContainer = document.getElementById("trading-dashboardr");
  makeDraggable(draggableContainer);
}
