const initializeDashboard = () => {
  const sidebar = document.getElementById("sidebar");
  const mainArea = document.getElementById("main-area");

  if (window.innerWidth < 1024) {
    sidebar.classList.remove("translate-x-0");
    sidebar.classList.add("-translate-x-full");
    mainArea.classList.remove("ml-64");
    mainArea.classList.add("ml-0");
  }

  window.toggleSidebar = () => {
    if (sidebar.classList.contains("translate-x-0")) {
      sidebar.classList.replace("translate-x-0", "-translate-x-full");
      mainArea.classList.replace("ml-64", "ml-0");
    } else {
      sidebar.classList.replace("-translate-x-full", "translate-x-0");
      mainArea.classList.replace("ml-0", "ml-64");
    }
  };

  window.showSection = (sectionId) => {
    document
      .querySelectorAll("section")
      .forEach((section) => section.classList.add("hidden"));

    const activeSection = document.getElementById("section-" + sectionId);
    if (activeSection) activeSection.classList.remove("hidden");

    const titles = {
      dash: "Dashboard Overview",
      files: "My File Library",
      history: "Activity History",
      upload: "Upload Center",
    };

    const viewTitle = document.getElementById("view-title");
    if (viewTitle) viewTitle.innerText = titles[sectionId] || "Filemoon";

    if (["dash", "files", "history"].includes(sectionId)) {
      document.querySelectorAll(".nav-item").forEach((button) => {
        button.classList.remove("active");
        button.classList.add("text-slate-500", "hover:bg-slate-100");
      });

      const activeButton = document.getElementById("btn-" + sectionId);
      if (activeButton) {
        activeButton.classList.add("active");
        activeButton.classList.remove("text-slate-500", "hover:bg-slate-100");
      }
    }
  };

  window.addEventListener("resize", () => {
    if (window.innerWidth < 1024) {
      sidebar.classList.add("-translate-x-full");
      sidebar.classList.remove("translate-x-0");
      mainArea.classList.replace("ml-64", "ml-0");
    } else {
      sidebar.classList.remove("-translate-x-full");
      sidebar.classList.add("translate-x-0");
      mainArea.classList.replace("ml-0", "ml-64");
    }
  });

  if (typeof initThemeToggle === "function") {
    initThemeToggle("theme-toggle", "theme-toggle-icon");
  }

  if (typeof lucide !== "undefined") lucide.createIcons();
};

document.addEventListener("DOMContentLoaded", initializeDashboard);
