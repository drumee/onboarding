export async function init() {
  if (
    !document.getElementById("hero-pricing") &&
    !document.getElementById("compare-table")
  ) {
    return;
  }

  if (document.getElementById("hero-pricing")) {
    await import("/src/js/pricing/hero.js");
  }

  if (document.getElementById("compare-table")) {
    await import("/src/js/pricing/plan.js");
  }
}
