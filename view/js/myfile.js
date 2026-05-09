const initializeMyFilePage = () => {
  const sidebar = document.getElementById("sidebar");
  if (window.innerWidth < 1024) {
    sidebar.classList.remove("translate-x-0");
    sidebar.classList.add("-translate-x-full");
  }

  window.toggleSidebar = () => {
    sidebar.classList.toggle("-translate-x-full");
  };

  if (typeof initThemeToggle === "function") {
    initThemeToggle("theme-toggle", "theme-toggle-icon");
  }

  if (typeof lucide !== "undefined") lucide.createIcons();
};

document.addEventListener("DOMContentLoaded", initializeMyFilePage);
