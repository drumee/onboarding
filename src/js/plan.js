(async () => {
  const mount = document.getElementById("compare-table");
  if (!mount) return;

  const escapeHtml = (str = "") =>
    String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const renderCellValue = (value) => {
    if (typeof value === "boolean") {
      return `<span class="compare__bool ${
        value ? "is-true" : "is-false"
      }" aria-hidden="true">${value ? "✓" : "✕"}</span>`;
    }
    return `<span class="compare__text">${escapeHtml(value ?? "")}</span>`;
  };

  // ✅ helper: biến array features -> map theo key cho lookup nhanh
  const toFeatureMap = (featuresArr) => {
    const map = new Map();
    (featuresArr || []).forEach((f) => {
      if (!f) return;
      const key = f.key || f.name; // fallback
      map.set(key, f);
    });
    return map;
  };

  try {
    const res = await fetch("../../data/plans.json");
    if (!res.ok) throw new Error(`Failed to load plans.json: ${res.status}`);

    const data = await res.json();
    const plans = data.plans || [];
    if (!plans.length) throw new Error("plans[] is empty");

    // ✅ lấy list features từ plan đầu (array)
    const baseFeatures = plans[0].features || [];
    if (!Array.isArray(baseFeatures) || !baseFeatures.length)
      throw new Error("features[] is empty");

    // ✅ featureRows = danh sách feature theo thứ tự trong JSON
    // Mỗi item có { key, name }
    const featureRows = baseFeatures.map((f) => ({
      key: f.key || f.name,
      name: f.name || f.key,
    }));

    // ✅ tạo featureMap cho từng plan (lookup theo key nhanh)
    const planFeatureMaps = plans.map((p) => ({
      name: p.name,
      map: toFeatureMap(p.features),
    }));

    // Header row
    const headerRow = `
      <div class="compare__row compare__row--header" role="row">
        <div class="compare__cell compare__cell--feature" role="columnheader">Features</div>
        ${plans
          .map(
            (p) =>
              `<div class="compare__cell compare__cell--plan" role="columnheader">${escapeHtml(
                p.name
              )}</div>`
          )
          .join("")}
      </div>
    `;

    // Body rows
    const bodyRows = featureRows
      .map(({ key, name }) => {
        return `
          <div class="compare__row" role="row">
            <div class="compare__cell compare__cell--feature" role="rowheader">
              ${escapeHtml(name)}
            </div>
            ${planFeatureMaps
              .map(({ map }) => {
                const feature = map.get(key);
                const value = feature ? feature.value : ""; // nếu plan nào thiếu feature
                return `<div class="compare__cell" role="cell">${renderCellValue(
                  value
                )}</div>`;
              })
              .join("")}
          </div>
        `;
      })
      .join("");

    // Additional seat pricing (giữ nguyên)
    const additional =
      Array.isArray(data.additionalSeatPricing) &&
      data.additionalSeatPricing.length
        ? data.additionalSeatPricing
        : [
            {
              plan: "Pro",
              text: "5 seats included, additional seats $5/month each",
            },
            {
              plan: "Start Ups",
              text: "10 seats included, additional seats $5/month each",
            },
            {
              plan: "Enterprise",
              text: "Custom pricing for your team size. Contact frenz@drumee.org",
              email: "frenz@drumee.org",
            },
          ];

    const additionalHtml = `
      <div class="compare__extra" aria-labelledby="additional-seat-title">
        <h3 class="compare__extra-title" id="additional-seat-title">Additional seat pricing</h3>
        <ul class="compare__extra-list">
          ${additional
            .map((item) => {
              const plan = escapeHtml(item.plan);
              const text = escapeHtml(item.text);

              if (item.email) {
                const email = escapeHtml(item.email);
                const linked = text.replace(
                  email,
                  `<a class="compare__link" href="mailto:${email}">${email}</a>`
                );
                return `<li class="compare__extra-item"><strong>${plan}:</strong> ${linked}</li>`;
              }

              return `<li class="compare__extra-item"><strong>${plan}:</strong> ${text}</li>`;
            })
            .join("")}
        </ul>
      </div>
    `;

    // Final render (component)
    mount.innerHTML = `
      <header class="compare__header">
        <h2 class="compare__title" id="compare-title">COMPARE FEATURES</h2>
      </header>

      <div class="compare__table" role="table" aria-label="Compare features table">
        ${headerRow}
        ${bodyRows}
      </div>

      ${additionalHtml}
    `;
  } catch (err) {
    console.error(err);
    mount.innerHTML = `
      <div class="compare__error" role="alert" style="padding:20px;color:#b91c1c;">
        Compare table failed to load. Check console.
      </div>
    `;
  }
})();
