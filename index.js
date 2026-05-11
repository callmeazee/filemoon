const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
mongoose.connect(process.env.DB);

const root= process.cwd();
const express = require("express");
const path = require("path");
const { v4: uniqueId } = require("uuid");
const CORS = require("cors");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, "files/");
  },
  filename: (req, file, next) => {
    const nameArr = file.originalname.split(".");
    const ext = nameArr.pop();
    const name = `${uniqueId()}.${ext}`;
    next(null, name);
  },
});
const upload = multer({ storage: storage });

const { signup, login } = require("./controller/user.controller");
const {
  createFile,
  fetchFiles,
  deleteFile,
  downloadFile,
} = require("./controller/file.controller");
const { requireAuth, verifyToken } = require("./controller/token.controller");
const { fetchDashboard } = require("./controller/dashboard.controller");
const app = express(); 
app.listen(process.env.PORT || 8080);

app.use(
  CORS({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://localhost:8080",
      "http://127.0.0.1:8080",
    ],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("view"));

//function for making ui endpoints 
const getPath = (filename) => {
  return path.join(root, "view", filename);
}


//ui endpoints

app.get("/", (req, res) => {
  const p = getPath("index.html");
  res.sendFile(p);
});
app.get("/index", (req, res) => {
  const p = getPath("index.html");
  res.sendFile(p);
});
app.get("/signup", (req, res) => {
  const p = getPath("signup.html");
  res.sendFile(p);
}); 
app.get("/login", (req, res) => {
  const p = getPath("index.html");
  res.sendFile(p);
});
app.get("/dashboard", (req, res) => {
  const p = getPath("app/dashboard.html");
  res.sendFile(p);
}); 
app.get("/files", (req, res) => {
  const p = getPath("app/myfile.html");
  res.sendFile(p);
});
app.get("/history", (req, res) => {
  const p = getPath("app/history.html");
  res.sendFile(p);
});





// Api endpoints
app.post("/api/signup", signup);
app.post("/api/login", login);
app.post("/api/file", requireAuth, upload.single("file"), createFile);
app.get("/api/file", requireAuth, fetchFiles);
app.delete("/api/file/:id", requireAuth, deleteFile);
app.get("/api/file/dashboard", requireAuth, fetchDashboard);
app.get("/api/file/download/:id", requireAuth, downloadFile);
app.post("/api/token/verify", verifyToken);
