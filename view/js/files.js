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

document.addEventListener("DOMContentLoaded", async () => {
  initializeMyFilePage();
  await loadFiles();
});

const demoFiles = [
  {
    _id: "demo-1",
    name: "Project Brief.pdf",
    filename: "project_brief.pdf",
    category: "pdf",
    size: 1.12,
    createdAt: "2025-05-07",
  },
  {
    _id: "demo-2",
    name: "Brand Assets.zip",
    filename: "brand_assets.zip",
    category: "other",
    size: 24.5,
    createdAt: "2025-05-05",
  },
  {
    _id: "demo-3",
    name: "Launch Video.mp4",
    filename: "launch_video.mp4",
    category: "video",
    size: 57.72,
    createdAt: "2025-05-02",
  },
];

const renderFiles = (files = []) => {
  const tbody = document.getElementById("files-tbody");
  if (!tbody) return;

  if (!files.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="p-8 text-center text-slate-400 italic">
          No files uploaded yet. Please upload a file to see it here.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = files
    .map((file) => {
      const name = file.name || file.filename;
      const category =
        file.category?.charAt(0).toUpperCase() + file.category?.slice(1) ||
        "Other";
      const size =
        typeof file.size === "number"
          ? `${file.size.toFixed(2)} MB`
          : `${file.size} MB`;
      const date = file.createdAt
        ? new Date(file.createdAt).toLocaleDateString()
        : "-";

      return `
        <tr id="row-${file._id}" class="hover:bg-slate-50 transition-colors group">
          <td class="p-5 text-slate-700 font-semibold">${name}</td>
          <td class="p-5">
            <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
              ${category}
            </span>
          </td>
          <td class="p-5 text-slate-500 text-sm">${size}</td>
          <td class="p-5 text-slate-500 text-sm">${date}</td>
          <td class="p-5">
            <div class="flex justify-center gap-2">
              <button onclick="deleteFile('${file._id}')" class="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
              <button onclick="downloadFile('${file._id}')" class="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                <i data-lucide="download" class="w-4 h-4"></i>
              </button>
              <button onclick="shareFile('${file._id}')" class="p-2 bg-amber-50 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-white transition-all">
                <i data-lucide="share" class="w-4 h-4"></i>
              </button>
            </div>
          </td>
        </tr>`;
    })
    .join("");

  if (typeof lucide !== "undefined") lucide.createIcons();
};

const loadFiles = async () => {
  try {
    const res = await axios.get("/api/file");
    renderFiles(res.data);
  } catch (err) {
    console.error("Failed to load files:", err);
    renderFiles(demoFiles);
  }
};

window.deleteFile = async (id) => {
  if (!confirm("Are you sure you want to delete this file?")) return;

  try {
    await axios.delete(`/api/file/${id}`);
    const row = document.getElementById(`row-${id}`);
    if (row) row.remove();
    const tbody = document.getElementById("files-tbody");
    if (tbody && tbody.children.length === 0) renderFiles([]);
  } catch (err) {
    alert(err?.response?.data?.message || "Delete failed.");
  }
};

window.downloadFile = (id) => {
  window.location.href = `/api/file/download/${id}`;
};

window.shareFile = async (id) => {
  const shareUrl = `${window.location.origin}/api/file/download/${id}`;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Download link copied to clipboard.");
      return;
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  }
  window.prompt("Copy this download link", shareUrl);
};



const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/file", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const result = await response.json();
    return result;
  } catch (error) {
   toast.error(err.response ? err.response.data.message : error.message || "Upload failed.");
  }
};
