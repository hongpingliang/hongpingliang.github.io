(function (global) {

  function create(options) {
    const container = document.querySelector(options.container);
    if (!container) {
      console.error("FractalWidget: container not found");
      return;
    }

    // Create layout wrapper
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "10px";

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.id = "fractal_canvas_widget";
    canvas.width = options.width || 400;
    canvas.height = options.height || 400;
    canvas.style.border = "1px solid #333";
    canvas.style.width = "100%";
    canvas.style.maxWidth = options.width + "px";

    wrapper.appendChild(canvas);
    container.appendChild(wrapper);

    // 🔥 Hook into your existing engine
    const engine = Index; // reuse your current global Index object

    engine.init(canvas, document.getElementById('control_ui')); // if needed

    // optional: expose API per instance
    return {
      canvas,
      engine
    };
  }

  global.FractalWidget = {
    create
  };

})(window);