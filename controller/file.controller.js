const FileModel = require("../models/file.model");
const fs = require("fs");
const path = require('path')
const createFile = async (req, res) => {
  try {
    const file = req.file;
    const payload = {
      filename: file.filename,
      type: file.mimetype.split("/")[0],
      path: (file.destination + file.filename),
      size: (file.size / (1024 * 1024)).toFixed(2),
    };
    const newFile = await FileModel.create(payload);
    res.status(200).json(newFile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const fetchFiles = async (req, res) => {
  try {
    const files = await FileModel.find();
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await FileModel.findByIdAndDelete(id);

    if (!file) return res.status(404).json({ message: "file not found" });
    fs.unlinkSync(file.path);
    res.status(200).json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const downloadFile = async(req, res) => {
  try {
    const { id } = req.params
    const file =await FileModel.findById(id)

    if (!file) 
      return res.status(404).json({ message: "file not found" })
    const root = process.cwd()

    
    const filePath = path.join(root, file.path)
 
   
    
    res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
    res.sendFile(filePath, (err) => {
      if (err)
        res.status(404).json({message: 'file not found'})
    })
    
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

module.exports = {
  createFile,
  fetchFiles,
  deleteFile,
  downloadFile
};
