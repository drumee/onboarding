export function initRive() {
  const RiveCtor = window.rive?.Rive;
  if (!RiveCtor) {
    console.error(
      "Rive runtime not found. Make sure you loaded: https://unpkg.com/@rive-app/webgl2"
    );
    return;
  }

  const canvases = document.querySelectorAll("canvas[data-riv]");
  if (!canvases.length) return;

  const instances = [];

  const setupCanvas = (canvas) => {
    const src = canvas.dataset.riv;
    if (!src) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };

    resize();

    const inst = new RiveCtor({
      src,
      canvas,
      autoplay: true,
    });

    instances.push({ canvas, inst, resize });
  };

  canvases.forEach(setupCanvas);

  window.addEventListener("resize", () => {
    instances.forEach(({ resize }) => resize());
  });
}
