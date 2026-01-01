const pages = {
  pricing: () => import("./pricing.js"),
  // home: () => import("/src/js/page-init/home.js"),
  // features: () => import("/src/js/page-init/features.js"),
};

export async function initPage(pageKey) {
  if (!pageKey) return;

  const loader = pages[pageKey];
  if (!loader) return;

  const mod = await loader();
  if (mod?.init) await mod.init();
}
