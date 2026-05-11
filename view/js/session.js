const pathName = location.pathname;
const isViewMode = pathName.startsWith("/view/");
const isProtectedPage = ["/dashboard", "/files", "/history", "/view/app/"].some(
  (p) => pathName.startsWith(p),
);
const isAuthPage = [
  "/",
  "/index",
  "/index.html",
  "/login",
  "/signup",
  "/view/index.html",
  "/view/signup.html",
].includes(pathName);
const apiBase = typeof SERVER === "string" ? SERVER : "";
axios.defaults.baseURL = apiBase;
const THEME_STORAGE_KEY = "filemoonTheme";

const clearToken = () => {
  localStorage.removeItem("authToken");
};

const getLoginPath = () => (isViewMode ? "/view/index.html" : "/login");
const getDashboardPath = () =>
  isViewMode ? "/view/app/dashboard.html" : "/dashboard";

const redirectToLogin = () => {
  clearToken();
  location.href = getLoginPath();
};

const logout = () => {
  redirectToLogin();
};

const redirectToDashboard = () => {
  location.href = getDashboardPath();
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

const setTheme = (theme) => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
};

const initializeTheme = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "light";
  applyTheme(savedTheme);
};

const initThemeToggle = (buttonId, iconId) => {
  const button = document.getElementById(buttonId);
  const icon = document.getElementById(iconId);
  if (!button || !icon) return;

  const renderThemeIcon = () => {
    const isDark = document.documentElement.classList.contains("dark");
    icon.setAttribute("data-lucide", isDark ? "sun" : "moon");
    if (typeof lucide !== "undefined") lucide.createIcons();
  };

  renderThemeIcon();
  button.addEventListener("click", () => {
    const nextTheme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";
    setTheme(nextTheme);
    renderThemeIcon();
  });
};

const getSession = async () => {
  try {
    const session = localStorage.getItem("authToken");
    if (!session) {
      if (isProtectedPage) redirectToLogin();
      return null;
    }

    const payload = { token: session };
    const { data } = await axios.post("/api/token/verify", payload);
    if (isAuthPage) redirectToDashboard();
    return data;
  } catch (err) {
    clearToken();
    if (isProtectedPage) redirectToLogin();
    return null;
  }
};

getSession();
initializeTheme();

if (isProtectedPage) {
  setInterval(() => {
    if (!localStorage.getItem("authToken")) redirectToLogin();
  }, 1000);
}

window.clearToken = clearToken;
window.logout = logout;
window.initThemeToggle = initThemeToggle;
