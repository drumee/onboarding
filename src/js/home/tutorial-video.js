export function initVideoModal() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("tutorialVideo");
  if (!modal || !video) return;

  // ✅ Bắt trigger theo class mới
  const openButtons = document.querySelectorAll(".tutorial-button");

  const closeButtons = modal.querySelectorAll("[data-video-close]");

  // ✅ Tránh addEventListener trùng nếu init nhiều lần
  if (modal.dataset.videoModalInited === "1") return;
  modal.dataset.videoModalInited = "1";

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    // reset về đầu và play
    try {
      video.currentTime = 0;
    } catch (_) {}
    video.play?.();

    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    video.pause?.();
    document.body.style.overflow = "";
  }

  openButtons.forEach((btn) => btn.addEventListener("click", openModal));
  closeButtons.forEach((btn) => btn.addEventListener("click", closeModal));

  // ESC close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}
