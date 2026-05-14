/* ============================================
   FILEMOON — UPLOAD LOADER LOGIC
   File: view/js/loader.js
   Requires: anime.js CDN (already in dashboard.html)
   ============================================ */

const UploadLoader = (() => {
  // ── DOM refs (set on first call) ──────────────────────────────────────────
  let overlay,
    ringProgress,
    percentNum,
    barFill,
    statusTitle,
    fileName,
    stepsEl,
    successEl;

  const CIRCUMFERENCE = 2 * Math.PI * 65; // r=65 → ≈ 408.4

  // ── Grab DOM elements once ────────────────────────────────────────────────
  const init = () => {
    overlay = document.getElementById("upload-loader-overlay");
    ringProgress = document.getElementById("ring-progress");
    percentNum = document.getElementById("loader-percent-num");
    barFill = document.getElementById("loader-bar-fill");
    statusTitle = document.getElementById("loader-status-title");
    fileName = document.getElementById("loader-file-name");
    stepsEl = document.querySelectorAll(".loader-step");
    successEl = document.getElementById("loader-success");
  };

  // ── Set ring + bar to a given % (0–100) ──────────────────────────────────
  const setProgress = (pct) => {
    const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
    ringProgress.style.strokeDashoffset = offset;
    barFill.style.width = pct + "%";
    percentNum.textContent = Math.round(pct);

    // Step highlights
    if (pct >= 5 && stepsEl[0]) stepsEl[0].classList.add("done");
    if (pct >= 50 && stepsEl[1]) stepsEl[1].classList.add("done");
    if (pct >= 90 && stepsEl[2]) stepsEl[2].classList.add("done");

    // Status label
    if (pct < 30) statusTitle.textContent = "Preparing file…";
    else if (pct < 70) statusTitle.textContent = "Uploading…";
    else if (pct < 99) statusTitle.textContent = "Almost there…";
  };

  // ── Show success state ────────────────────────────────────────────────────
  const showSuccess = (onDone) => {
    statusTitle.textContent = "Upload Complete!";

    // Hide ring area, show success icon
    document.getElementById("loader-ring-area").style.display = "none";
    successEl.style.display = "flex";

    // Bounce the card a bit
    anime({
      targets: ".loader-card",
      scale: [1, 1.04, 1],
      duration: 400,
      easing: "easeInOutQuad",
    });

    // Auto-close after 1.8s
    setTimeout(() => {
      hide();
      if (typeof onDone === "function") onDone();
    }, 1800);
  };

  // ── Open overlay ──────────────────────────────────────────────────────────
  const show = (fileLabel = "your file") => {
    if (!overlay) init();

    // Reset everything
    document.getElementById("loader-ring-area").style.display = "flex";
    successEl.style.display = "none";
    stepsEl.forEach((s) => s.classList.remove("done"));
    setProgress(0);
    fileName.textContent = fileLabel;
    statusTitle.textContent = "Preparing file…";

    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; // prevent scroll-behind
  };

  // ── Close overlay ─────────────────────────────────────────────────────────
  const hide = () => {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  // ──────────────────────────────────────────────────────────────────────────
  //  OPTION A — SIMULATED progress (fake, for demo/testing)
  // ──────────────────────────────────────────────────────────────────────────
  const startFake = (fileLabel = "your file", onDone) => {
    show(fileLabel);

    const obj = { value: 0 };

    anime({
      targets: obj,
      value: [0, 100],
      duration: 3500,
      easing: "easeInOutCubic",
      update: () => setProgress(obj.value),
      complete: () => showSuccess(onDone),
    });
  };

  // ──────────────────────────────────────────────────────────────────────────
  //    OPTION B — REAL progress (using axios onUploadProgress)

  //    Usage in dashboard.js:

  // ──────────────────────────────────────────────────────────────────────────
  const startReal = async (fileLabel, axiosCall, onDone, onError) => {
    show(fileLabel);
    try {
      await axiosCall();
      setProgress(100);
      setTimeout(() => showSuccess(onDone), 200);
    } catch (err) {
      hide();
      if (typeof onError === "function") onError(err);
    }
  };

  return { show, hide, setProgress, startFake, startReal };
})();

// ── Wire up the "Finish & Upload" button ─────────────────────────────────────
// This runs after DOM is ready so it safely finds the button.
document.addEventListener("DOMContentLoaded", () => {
  const uploadBtn = document.getElementById("finish-upload-btn");
  const fileInput = document.getElementById("realFileInput");
  const selectedPreview = document.getElementById("selected-file-preview");

  if (fileInput) {
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!selectedPreview) return;

      if (file) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        selectedPreview.textContent = `${file.name} · ${sizeMb} MB`;
        const nameInput = document.getElementById("fileNameInput");
        if (nameInput && !nameInput.value.trim()) {
          nameInput.value = file.name.replace(/\.[^/.]+$/, "");
        }
      } else {
        selectedPreview.textContent = "No file selected.";
      }
      });
    }

  if (!uploadBtn) return;

  uploadBtn.addEventListener("click", () => {
    const fileInput = document.getElementById("realFileInput");
    const nameInput = document.getElementById("fileNameInput");
    const file = fileInput?.files?.[0];
    const label = nameInput?.value?.trim() || file?.name || "Unnamed File";

    // ── SWITCH HERE: comment one block, uncomment the other ──────────────

    // 👇 OPTION A — Simulated (demo mode)
    //     UploadLoader.startFake(label, () => {
    //       console.log("Fake upload complete. Replace with real call.");
    //     });

    // 👇 OPTION B — Real upload (uncomment when backend is ready)

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const category = document.getElementById("categorySelect").value;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", label);
    formData.append("category", category);

    UploadLoader.startReal(
      label,
      () =>
        axios.post("/api/file", formData, {
          onUploadProgress: (e) => {
            const pct = Math.round((e.loaded / e.total) * 100);
            UploadLoader.setProgress(pct);
          },
        }),
      () => {
        console.log("Upload successful!");
        showSection("files"); // go back to file list
      },
      (err) => {
        alert(
          "Upload failed: " + (err?.response?.data?.message || "Unknown error"),
        );
      },
    );
  });
});
