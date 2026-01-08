export function initRive() {
  // Rive global từ <script src="...webgl2">
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

      // Nếu bạn dùng state machine:
      // stateMachines: "State Machine 1",

      // Nếu cần fit/alignment (tùy runtime hỗ trợ):
      // layout: new window.rive.Layout({
      //   fit: window.rive.Fit.Contain,
      //   alignment: window.rive.Alignment.Center,
      // }),
    });

    instances.push({ canvas, inst, resize });
  };

  canvases.forEach(setupCanvas);

  // Resize tất cả instance khi đổi kích thước
  window.addEventListener("resize", () => {
    instances.forEach(({ resize }) => resize());
  });
}
