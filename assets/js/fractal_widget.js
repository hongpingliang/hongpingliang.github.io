/*
Copyright (c) 2026 Hongping Liang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, for any purpose, provided that the above copyright notice and
this permission notice are included in all copies or substantial portions of
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

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